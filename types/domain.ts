export type UserRole = "admin" | "researcher" | "engineer" | "medical_specialist" | "student";

export type ProjectStatus = "discovery" | "prototype" | "clinical_validation" | "manufacturing" | "paused";

export type ModuleKey =
  | "dashboard"
  | "projects"
  | "innovation-log"
  | "interviews"
  | "research"
  | "trends"
  | "convergence"
  | "roadmap"
  | "competitors"
  | "empathy-map"
  | "patients"
  | "contextual-observation";

export type Metric = {
  label: string;
  value: string;
  delta: string;
  tone: "cyan" | "mint" | "violet" | "rose" | "amber";
};

export type RoadmapPhase = {
  year: string;
  title: string;
  domain: string;
  maturity: number;
  status: "historical" | "active" | "forecast";
};

export type ResearchPaper = {
  title: string;
  category: string;
  doi: string;
  confidence: number;
  summary: string;
};

export type Trend = {
  name: string;
  impact: number;
  readiness: number;
  category: string;
};

export type Competitor = {
  company: string;
  product: string;
  price: string;
  accessibility: number;
  sensors: string;
  ai: string;
};

export type DashboardOverview = {
  projectCount: number;
  insightCount: number;
  paperCount: number;
  prototypeCount: number;
  recentProjects: Array<{
    id: string;
    name: string;
    status: string;
    progress: number;
    owner?: string | null;
  }>;
  recentActivity: string[];
  recentPapers: Array<{
    id: string;
    title: string;
    category: string;
    doi: string | null;
  }>;
  recentMilestones: Array<{
    id: string;
    title: string;
    domain: string;
    milestone_year: number;
  }>;
};

export type IntelligenceResult = {
  title: string;
  source: string;
  url: string;
  summary: string;
  published?: string;
  tags: string[];
};
