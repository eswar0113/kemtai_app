type Props = {
  title: string;
  value: string;
  subtitle?: string;
};

export default function WorkoutStatsCard({ title, value, subtitle }: Props) {
  return (
    <div className="p-8 group apple-card hover:bg-white transition-all duration-300">
      <div className="flex flex-col gap-4">
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-blue-500/80 group-hover:bg-blue-600 transition-colors"></div>
          <p className="text-xs uppercase tracking-wider text-gray-500 font-semibold">{title}</p>
        </div>
        <p className="text-4xl font-semibold text-gray-900 tracking-tight">{value}</p>
        {subtitle && (
          <p className="text-sm text-gray-400 font-medium">{subtitle}</p>
        )}
      </div>
    </div>
  );
}


