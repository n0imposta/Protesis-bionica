import type { IntelligenceResult } from "@/types/domain";

const DEFAULT_QUERY = "low cost bionic prosthetics myoelectric haptic sensors rehabilitation";

function clean(value?: string | null) {
  return value?.replace(/<[^>]+>/g, "").replace(/\s+/g, " ").trim() ?? "";
}

function asRecord(value: unknown): Record<string, unknown> {
  return typeof value === "object" && value !== null ? (value as Record<string, unknown>) : {};
}

function asString(value: unknown) {
  return typeof value === "string" ? value : undefined;
}

function asArray(value: unknown) {
  return Array.isArray(value) ? value : [];
}

export async function searchOpenAlex(query = DEFAULT_QUERY): Promise<IntelligenceResult[]> {
  const url = new URL("https://api.openalex.org/works");
  url.searchParams.set("search", query);
  url.searchParams.set("per-page", "5");
  url.searchParams.set("sort", "publication_date:desc");

  const response = await fetch(url, { next: { revalidate: 3600 } });
  if (!response.ok) return [];
  const payload = await response.json();

  return asArray(payload.results).map((raw) => {
    const item = asRecord(raw);
    const primaryLocation = asRecord(item.primary_location);
    return {
    title: asString(item.title) ?? "Untitled work",
    source: "OpenAlex",
    url: asString(primaryLocation.landing_page_url) ?? asString(item.id) ?? "https://openalex.org",
    summary: clean(item.abstract_inverted_index ? "Abstract disponible en OpenAlex para analisis posterior." : asString(item.display_name)),
    published: asString(item.publication_date),
    tags: ["paper", "openalex", asString(item.type)].filter(Boolean) as string[],
  };
  });
}

export async function searchEuropePmc(query = DEFAULT_QUERY): Promise<IntelligenceResult[]> {
  const url = new URL("https://www.ebi.ac.uk/europepmc/webservices/rest/search");
  url.searchParams.set("query", query);
  url.searchParams.set("format", "json");
  url.searchParams.set("pageSize", "5");
  url.searchParams.set("sort", "FIRST_PDATE_D desc");

  const response = await fetch(url, { next: { revalidate: 3600 } });
  if (!response.ok) return [];
  const payload = await response.json();

  const resultList = asRecord(payload.resultList);
  return asArray(resultList.result).map((raw) => {
    const item = asRecord(raw);
    const doi = asString(item.doi);
    const source = asString(item.source);
    const id = asString(item.id);
    return {
    title: asString(item.title) ?? "Untitled biomedical record",
    source: "Europe PMC",
    url: doi ? `https://doi.org/${doi}` : `https://europepmc.org/article/${source}/${id}`,
    summary: clean(asString(item.abstractText) ?? asString(item.journalTitle)),
    published: asString(item.firstPublicationDate),
    tags: ["biomedical", "publication", source].filter(Boolean) as string[],
  };
  });
}

export async function searchCrossref(query = DEFAULT_QUERY): Promise<IntelligenceResult[]> {
  const url = new URL("https://api.crossref.org/works");
  url.searchParams.set("query", query);
  url.searchParams.set("rows", "5");
  url.searchParams.set("sort", "published");
  url.searchParams.set("order", "desc");

  const response = await fetch(url, { next: { revalidate: 3600 } });
  if (!response.ok) return [];
  const payload = await response.json();

  const message = asRecord(payload.message);
  return asArray(message.items).map((raw) => {
    const item = asRecord(raw);
    const titles = asArray(item.title);
    const containerTitles = asArray(item["container-title"]);
    const published = asRecord(item.published);
    const dateParts = asArray(published["date-parts"]);
    const firstDatePart = asArray(dateParts[0]);
    const doi = asString(item.DOI);
    return {
    title: asString(titles[0]) ?? "Untitled DOI record",
    source: "Crossref",
    url: asString(item.URL) ?? (doi ? `https://doi.org/${doi}` : "https://crossref.org"),
    summary: clean(asString(item.abstract) ?? asString(containerTitles[0])),
    published: firstDatePart.map(String).join("-"),
    tags: ["doi", "metadata", asString(item.type)].filter(Boolean) as string[],
  };
  });
}

export async function searchClinicalTrials(query = "upper limb prosthesis"): Promise<IntelligenceResult[]> {
  const url = new URL("https://clinicaltrials.gov/api/v2/studies");
  url.searchParams.set("query.term", query);
  url.searchParams.set("pageSize", "5");

  const response = await fetch(url, { next: { revalidate: 3600 } });
  if (!response.ok) return [];
  const payload = await response.json();

  return asArray(payload.studies).map((raw) => {
    const study = asRecord(raw);
    const protocol = asRecord(study.protocolSection);
    const identification = asRecord(protocol.identificationModule);
    const status = asRecord(protocol.statusModule);
    const description = asRecord(protocol.descriptionModule);
    const startDate = asRecord(status.startDateStruct);
    const nctId = asString(identification.nctId) ?? "";
    return {
      title: asString(identification.briefTitle) ?? "Clinical trial",
      source: "ClinicalTrials.gov",
      url: `https://clinicaltrials.gov/study/${nctId}`,
      summary: clean(asString(description.briefSummary)),
      published: asString(startDate.date),
      tags: ["clinical-trial", asString(status.overallStatus)].filter(Boolean) as string[],
    };
  });
}

export async function runMultiSourceSearch(query: string) {
  const results = await Promise.all([
    searchOpenAlex(query),
    searchEuropePmc(query),
    searchCrossref(query),
    searchClinicalTrials(query),
  ]);

  return results.flat().slice(0, 20);
}
