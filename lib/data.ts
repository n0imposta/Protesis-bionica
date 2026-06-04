import type { Competitor, Metric, ResearchPaper, RoadmapPhase, Trend } from "@/types/domain";
import {
  Activity,
  Binary,
  BookOpenText,
  BrainCircuit,
  ClipboardList,
  GitBranch,
  HeartPulse,
  Map,
  Microscope,
  Network,
  NotebookPen,
  PanelsTopLeft,
  Radar,
  Route,
  Sparkles,
  UsersRound,
} from "lucide-react";

export const navigation = [
  { href: "/dashboard", label: "Command Center", icon: PanelsTopLeft },
  { href: "/projects", label: "Proyectos", icon: ClipboardList },
  { href: "/innovation-log", label: "Bitacora", icon: NotebookPen },
  { href: "/interviews", label: "Entrevistas", icon: UsersRound },
  { href: "/research", label: "Repositorio cientifico", icon: BookOpenText },
  { href: "/trends", label: "Tendencias", icon: Radar },
  { href: "/convergence", label: "Convergencia", icon: Network },
  { href: "/roadmap", label: "Roadmap", icon: Route },
  { href: "/competitors", label: "Competidores", icon: GitBranch },
  { href: "/empathy-map", label: "Empathy Map", icon: BrainCircuit },
  { href: "/patients", label: "Pacientes", icon: HeartPulse },
  { href: "/contextual-observation", label: "Observacion", icon: Map },
  { href: "/ai-agents", label: "AI Agents", icon: Sparkles },
  { href: "/profile", label: "Perfil", icon: UsersRound },
];

export const metrics: Metric[] = [
  { label: "Proyectos activos", value: "14", delta: "+23% este mes", tone: "cyan" },
  { label: "Insights validados", value: "186", delta: "42 clinicos", tone: "mint" },
  { label: "Papers curados", value: "328", delta: "18 con DOI nuevo", tone: "violet" },
  { label: "Prototipos", value: "27", delta: "6 en pruebas", tone: "amber" },
];

export const activeProjects = [
  { name: "MyoHand Lite", status: "Prototype V4", progress: 74, owner: "Biomedical Lab", risk: "Medio" },
  { name: "Haptic Socket", status: "Clinical protocol", progress: 51, owner: "Rehab Team", risk: "Alto" },
  { name: "OpenGrip AI", status: "Discovery", progress: 38, owner: "AI Research", risk: "Bajo" },
];

export const activityFeed = [
  "Nueva entrevista con terapeuta ocupacional etiquetada como ADL.",
  "Se aprobo material TPU-carbon para socket flexible.",
  "Roadmap actualizado con sensores hapticos de bajo costo.",
  "Paper EMG decoding agregado al repositorio cientifico.",
];

export const researchPapers: ResearchPaper[] = [
  {
    title: "Low-cost sEMG intent recognition for transradial prostheses",
    category: "EMG",
    doi: "10.1109/TBME.2024.1842",
    confidence: 92,
    summary: "Pipeline de senales superficiales EMG con clasificacion robusta para agarres cotidianos.",
  },
  {
    title: "Soft robotic fingers for accessible prosthetic hands",
    category: "Robotica",
    doi: "10.1016/j.softx.2023.1128",
    confidence: 87,
    summary: "Actuadores blandos imprimibles y tolerantes a impacto para prototipos asequibles.",
  },
  {
    title: "Haptic feedback strategies in upper-limb prosthetics",
    category: "Sensores",
    doi: "10.1038/s41551-024-1021",
    confidence: 95,
    summary: "Comparativa de vibrotactil, mecanotactil y estimulacion neural para feedback sensorial.",
  },
];

export const trends: Trend[] = [
  { name: "IA aplicada a protesis", impact: 94, readiness: 72, category: "IA medica" },
  { name: "Interfaces neuronales", impact: 89, readiness: 44, category: "Neurociencia" },
  { name: "Sensores hapticos", impact: 83, readiness: 68, category: "Sensores" },
  { name: "Bioimpresion", impact: 76, readiness: 39, category: "Materiales" },
  { name: "Open source prosthetics", impact: 81, readiness: 86, category: "Fabricacion digital" },
];

export const roadmap: RoadmapPhase[] = [
  { year: "2015", title: "Impresion 3D accesible", domain: "Fabricacion", maturity: 64, status: "historical" },
  { year: "2022", title: "Control mioelectrico portable", domain: "EMG", maturity: 74, status: "historical" },
  { year: "2026", title: "Socket inteligente modular", domain: "Biomecanica", maturity: 56, status: "active" },
  { year: "2028", title: "Feedback haptico asequible", domain: "Sensores", maturity: 46, status: "forecast" },
  { year: "2030", title: "Adaptacion por IA en tiempo real", domain: "IA", maturity: 31, status: "forecast" },
];

export const competitors: Competitor[] = [
  { company: "Open Bionics", product: "Hero Arm", price: "$8k-$15k", accessibility: 76, sensors: "EMG", ai: "No" },
  { company: "Ottobock", product: "bebionic", price: "$30k+", accessibility: 38, sensors: "EMG multi", ai: "Limitada" },
  { company: "Unlimited Tomorrow", product: "TrueLimb", price: "$8k+", accessibility: 69, sensors: "EMG", ai: "No" },
  { company: "Taska", product: "TASKA Hand", price: "$20k+", accessibility: 44, sensors: "EMG", ai: "No" },
];

export const convergenceNodes = [
  { id: "IA", x: 50, y: 16, icon: Binary },
  { id: "Medicina", x: 20, y: 36, icon: HeartPulse },
  { id: "Robotica", x: 80, y: 36, icon: Activity },
  { id: "Rehabilitacion", x: 25, y: 74, icon: UsersRound },
  { id: "Materiales", x: 75, y: 74, icon: Microscope },
  { id: "Protesis bionica accesible", x: 50, y: 52, icon: BrainCircuit },
];
