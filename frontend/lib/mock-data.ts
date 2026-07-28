import type { AnalyzeResponse, SiteReport } from "@/types/report";

const ev = (value: string, evidence = "", source = "") => ({ value, evidence, source });

const target: SiteReport = {
  businessName: "freshbreaththerapy.com",
  url: "https://freshbreaththerapy.com",
  isTarget: true,
  fetchStatus: "ok",
  fetchNotes: "",
  pagesAnalyzed: [
    "https://freshbreaththerapy.com",
    "https://freshbreaththerapy.com/services",
    "https://freshbreaththerapy.com/about",
    "https://freshbreaththerapy.com/faqs",
  ],
  overview: ev(
    "Licensed in-person and virtual counseling for anxiety, depression, trauma and relationships.",
    "Licensed In-Person & Virtual Counseling for Anxiety, Depression, Trauma & Relationship Issues",
    "https://freshbreaththerapy.com",
  ),
  services: ["Individual Therapy", "Couples Therapy", "Family Therapy", "Child & Adolescent Therapy"],
  targetAudience: ev(
    "Individuals, families, children, teens and couples",
    "Evidence-based counseling for individuals, families, children, teens & couples",
    "https://freshbreaththerapy.com/services",
  ),
  websiteStructure: ["Home", "Services", "About", "FAQs", "Contact"],
  contentStrategy: ev("Person-centered, compassionate, evidence-based messaging", "We meet you where you are at.", "https://freshbreaththerapy.com/about"),
  seoObservations: ev("Descriptive titles and headings; light internal linking"),
  usp: ev("A refreshing, supportive environment with licensed clinicians", "We offer a refreshing, supportive environment where you can find clarity and peace.", "https://freshbreaththerapy.com"),
  pricing: ev("$100–150 per session (self-pay)", "Our standard rate is typically $100-150 per session, varying by therapist and session type.", "https://freshbreaththerapy.com/faqs"),
  strengths: [
    ev("Licensed, experienced therapists", "Licensed counseling", "https://freshbreaththerapy.com"),
    ev("Broad services across all ages"),
  ],
  weaknesses: [ev("Does not accept Medicare", "We do not accept Medicare", "https://freshbreaththerapy.com/faqs"), ev("Limited sliding-scale availability")],
  opportunitiesVsTarget: [],
};

const prism: SiteReport = {
  businessName: "prismwellnessnc.com",
  url: "https://www.prismwellnessnc.com",
  isTarget: false,
  fetchStatus: "ok",
  fetchNotes: "site text truncated to 30000 chars",
  pagesAnalyzed: ["https://www.prismwellnessnc.com", "https://www.prismwellnessnc.com/our-therapists"],
  overview: ev("Mental health & addictions counseling practice in Cary, NC", "Mental Health & Addictions Counseling in Cary, NC", "https://www.prismwellnessnc.com"),
  services: ["Mental Health Counseling", "Addictions Counseling", "Trauma Therapy", "Ketamine Assisted Psychotherapy"],
  targetAudience: ev("Individuals and families facing mental health and addiction challenges"),
  websiteStructure: ["Home", "Our Therapists", "Services"],
  contentStrategy: ev("Supportive, path-to-wellness messaging", "we are here to support you on your path to wellness.", "https://www.prismwellnessnc.com"),
  seoObservations: ev("Descriptive, keyword-relevant titles"),
  usp: ev("Specialty team of fully licensed clinicians with advanced training", "primarily of fully licensed clinicians with diverse backgrounds, advanced training", "https://www.prismwellnessnc.com"),
  pricing: ev("not publicly listed", "suggested rate of $35 ... with a Masters Level intern", "https://www.prismwellnessnc.com"),
  strengths: [ev("Diverse, specialized clinician team"), ev("Broad range of modalities")],
  weaknesses: [ev("Pricing not publicly listed"), ev("Limited insurance/payment detail")],
  opportunitiesVsTarget: ["Emphasize published, transparent pricing", "Own the family + child therapy niche Prism does not emphasize"],
};

const alpha: SiteReport = {
  businessName: "alphamindcounselingcenters.com",
  url: "https://alphamindcounselingcenters.com",
  isTarget: false,
  fetchStatus: "ok",
  fetchNotes: "",
  pagesAnalyzed: ["https://alphamindcounselingcenters.com", "https://alphamindcounselingcenters.com/services"],
  overview: ev("Counseling centers focused on anxiety, trauma and PTSD", "trauma, anxiety, and PTSD treatment"),
  services: ["EMDR", "Trauma Therapy", "Anxiety Treatment", "Telehealth"],
  targetAudience: ev("Adults seeking trauma and anxiety treatment"),
  websiteStructure: ["Home", "Services", "About", "Contact"],
  contentStrategy: ev("Clinical, specialization-led content"),
  seoObservations: ev("Service-focused pages with clear headings"),
  usp: ev("Integrative, evidence-based healing approach"),
  pricing: ev("not publicly listed"),
  strengths: [ev("Strong trauma/EMDR specialization"), ev("Telehealth availability")],
  weaknesses: [ev("Narrower age focus"), ev("No published pricing")],
  opportunitiesVsTarget: ["Target a broader geographic area", "Differentiate on couples and relationship work"],
};

export const mockReport: AnalyzeResponse = {
  target,
  competitors: [prism, alpha],
  comparison:
    "Fresh Breath Therapy offers a broader range of services across all ages, including child, teen and family therapy, whereas Prism Wellness leans on specialized modalities like ketamine-assisted psychotherapy and AlphaMind concentrates on trauma and EMDR. Fresh Breath Therapy publishes a self-pay rate ($100–150), while both competitors keep pricing off their sites.",
  recommendations: [
    "Lead with the published pricing as a trust signal competitors don't offer",
    "Promote family and child therapy as a wedge versus trauma-focused rivals",
    "Add evening/weekend availability to widen the addressable audience",
  ],
  metrics: { competitorsAnalyzed: 2, sitesReachable: 3, pricingPublished: 0 },
  generatedAt: new Date().toISOString(),
};
