type Props = {
  title: string;
  value: string;
  subtitle?: string;
};

export default function WorkoutStatsCard({ title, value, subtitle }: Props) {
  return (
    <div className="glass rounded-2xl p-4 flex flex-col gap-1 shadow-lg border border-slate-800">
      <p className="text-xs uppercase tracking-[0.25em] text-gray-400">{title}</p>
      <p className="text-2xl font-semibold text-white">{value}</p>
      {subtitle && <p className="text-sm text-gray-400">{subtitle}</p>}
    </div>
  );
}


