import { Badge } from "@/components/ui/badge";

export function PageHeader({
  eyebrow,
  title,
  description,
  action,
}: {
  eyebrow: string;
  title: string;
  description: string;
  action?: React.ReactNode;
}) {
  return (
    <div className="mb-6 flex flex-col justify-between gap-4 md:flex-row md:items-end">
      <div className="max-w-3xl">
        <Badge tone="cyan">{eyebrow}</Badge>
        <h1 className="mt-4 text-3xl font-semibold tracking-normal text-white md:text-5xl">{title}</h1>
        <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-400 md:text-base">{description}</p>
      </div>
      {action}
    </div>
  );
}
