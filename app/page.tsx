import Link from "next/link";
import ExerciseSelector from "@/components/ExerciseSelector";
import WorkoutStatsCard from "@/components/WorkoutStatsCard";

export default function Home() {
  const exercises = [
    { name: "squat", label: "Squats", description: "Leg strength and glutes" },
    { name: "pushup", label: "Pushups", description: "Upper body strength" },
    { name: "lunge", label: "Lunges", description: "Leg stability and balance" },
    { name: "jumpingjack", label: "Jumping Jacks", description: "Cardio warmup" },
    { name: "headrotation", label: "Head Rotations", description: "Neck mobility and flexibility" }
  ];

  return (
    <main className="space-y-8">
      <section className="glass rounded-3xl p-8 shadow-xl">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="text-sm uppercase tracking-[0.2em] text-primary font-semibold">
              AI Coach
            </p>
            <h1 className="text-4xl font-bold text-white">Kemtai-style Fitness Trainer</h1>
            <p className="text-gray-300 mt-2">
              Real-time pose tracking, rep counting, and voice feedback. Choose an exercise
              to get started.
            </p>
          </div>
          <div className="flex items-center gap-3">
            <Link
              className="px-4 py-2 rounded-full bg-primary text-white font-semibold shadow-lg"
              href="/dashboard"
            >
              Dashboard
            </Link>
            <a
              className="px-4 py-2 rounded-full border border-slate-600 text-gray-200"
              href="https://github.com"
              target="_blank"
              rel="noreferrer"
            >
              Docs
            </a>
          </div>
        </div>
      </section>

      <section className="grid gap-6 md:grid-cols-3">
        <WorkoutStatsCard title="Accuracy Engine" value="Angle scoring" subtitle="Hip/Knee/Elbow" />
        <WorkoutStatsCard title="Voice Feedback" value="Web Speech" subtitle="10-15 FPS loop" />
        <WorkoutStatsCard title="Session History" value="SQLite + Drizzle" subtitle="Persisted locally" />
      </section>

      <section className="glass rounded-3xl p-6 shadow-xl">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-2xl font-semibold text-white">Choose your exercise</h2>
          <Link href="/dashboard" className="text-sm text-secondary">
            View history
          </Link>
        </div>
        <ExerciseSelector exercises={exercises} />
      </section>
    </main>
  );
}


