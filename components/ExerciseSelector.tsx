import Link from "next/link";

type Exercise = {
  name: string;
  label: string;
  description: string;
};

type Props = {
  exercises: Exercise[];
};

export default function ExerciseSelector({ exercises }: Props) {
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      {exercises.map((exercise) => (
        <Link
          key={exercise.name}
          href={`/exercise/${exercise.name}`}
          className="glass rounded-xl p-4 border border-slate-800 hover:border-secondary transition"
        >
          <p className="text-lg font-semibold text-white">{exercise.label}</p>
          <p className="text-sm text-gray-400">{exercise.description}</p>
          <div className="mt-3 text-sm text-secondary">Start session →</div>
        </Link>
      ))}
    </div>
  );
}


