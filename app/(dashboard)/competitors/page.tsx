import { CompetitorsView } from "@/features/competitors/competitors-view";
import { getCompetitors } from "@/services/competitors-service";

export default async function CompetitorsPage() {
  const competitors = await getCompetitors();
  return <CompetitorsView competitors={competitors} />;
}
