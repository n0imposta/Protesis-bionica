import { DashboardView } from "@/features/dashboard/dashboard-view";
import { getDashboardStats } from "@/services/dashboard-service";

export default async function DashboardPage() {
  const overview = await getDashboardStats();
  return <DashboardView overview={overview} />;
}