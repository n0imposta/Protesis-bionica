import { ResearchView } from "@/features/research/research-view";
import { getResearchPapers } from "@/services/research-service";

export default async function ResearchPage() {
  const papers = await getResearchPapers();
  return <ResearchView papers={papers} />;
}
