"""Collection layer — read a site's public pages and return clean text.

Free, no API: `requests` to fetch, `trafilatura` to strip pages down to their
main content (with a BeautifulSoup fallback). For each site we grab the homepage
and then a few "key" internal pages (services, about, pricing, contact,
locations) by matching link text/URLs against keywords.

Every fetch is wrapped so a dead or blocked site becomes a graceful "failed"
record instead of crashing the whole run — this is where the "handle
inaccessible websites gracefully" requirement lives.
"""
from __future__ import annotations

from urllib.parse import urljoin, urlparse

import requests
import trafilatura
from bs4 import BeautifulSoup

# Link keywords that usually mark the pages worth reading.
KEY_PAGE_KEYWORDS = [
    "service", "about", "pricing", "price", "plans", "contact",
    "location", "team", "faq", "blog", "product",
]

HEADERS = {
    "User-Agent": (
        "Mozilla/5.0 (compatible; CompetitorResearchAgent/1.0; +https://example.com/bot)"
    )
}


def _get(url: str, timeout: int) -> str | None:
    """Fetch one URL, returning HTML text or None on any failure."""
    try:
        resp = requests.get(url, headers=HEADERS, timeout=timeout)
        resp.raise_for_status()
        ctype = resp.headers.get("content-type", "")
        if "html" not in ctype and "text" not in ctype:
            return None
        return resp.text
    except requests.RequestException:
        return None


def _extract_text(html: str, url: str) -> str:
    """Reduce raw HTML to readable main-content text."""
    text = trafilatura.extract(html, include_comments=False, include_tables=True)
    if text:
        return text.strip()
    # Fallback: crude text extraction.
    soup = BeautifulSoup(html, "lxml")
    for tag in soup(["script", "style", "nav", "footer", "header"]):
        tag.decompose()
    return soup.get_text(separator="\n", strip=True)


def _find_key_links(html: str, base_url: str, limit: int) -> list[str]:
    """Find internal links that look like key pages."""
    soup = BeautifulSoup(html, "lxml")
    base_domain = urlparse(base_url).netloc
    found: list[str] = []
    seen: set[str] = set()
    for a in soup.find_all("a", href=True):
        href = a["href"].strip()
        if href.startswith(("mailto:", "tel:", "#", "javascript:")):
            continue
        full = urljoin(base_url, href)
        # Same-domain only, and drop fragments/query for dedup.
        parsed = urlparse(full)
        if parsed.netloc != base_domain:
            continue
        clean = f"{parsed.scheme}://{parsed.netloc}{parsed.path}".rstrip("/")
        if clean in seen or clean.rstrip("/") == base_url.rstrip("/"):
            continue
        haystack = (href + " " + a.get_text(" ", strip=True)).lower()
        if any(kw in haystack for kw in KEY_PAGE_KEYWORDS):
            seen.add(clean)
            found.append(clean)
        if len(found) >= limit:
            break
    return found


def fetch_site(
    url: str,
    max_pages: int = 5,
    max_chars: int = 30000,
    timeout: int = 20,
) -> tuple[list[dict], str, str]:
    """Fetch homepage + a few key pages.

    Returns (pages, status, notes) where:
      - pages: list of {"url":..., "text":...}
      - status: "ok" | "partial" | "failed"
      - notes: human-readable notes about what happened
    """
    if not url.startswith(("http://", "https://")):
        url = "https://" + url
    url = url.rstrip("/")

    home_html = _get(url, timeout)
    if not home_html:
        return [], "failed", f"Could not fetch homepage: {url}"

    pages = [{"url": url, "text": _extract_text(home_html, url)}]
    notes_parts: list[str] = []

    key_links = _find_key_links(home_html, url, limit=max_pages - 1)
    failed = 0
    for link in key_links:
        html = _get(link, timeout)
        if not html:
            failed += 1
            continue
        pages.append({"url": link, "text": _extract_text(html, link)})

    # Enforce the per-site text cap (keeps us inside free LLM rate limits).
    total = 0
    capped: list[dict] = []
    for page in pages:
        remaining = max_chars - total
        if remaining <= 0:
            break
        text = page["text"][:remaining]
        total += len(text)
        capped.append({"url": page["url"], "text": text})

    status = "ok"
    if failed:
        status = "partial"
        notes_parts.append(f"{failed} key page(s) could not be fetched")
    if total >= max_chars:
        notes_parts.append(f"site text truncated to {max_chars} chars")

    return capped, status, "; ".join(notes_parts)
