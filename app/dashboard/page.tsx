"use client";

import { useEffect, useMemo, useState } from "react";
import WorkoutStatsCard from "@/components/WorkoutStatsCard";
import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  LineElement,
  CategoryScale,
  LinearScale,
  PointElement,
  Tooltip,
  Legend
} from "chart.js";
import Link from "next/link";

ChartJS.register(LineElement, CategoryScale, LinearScale, PointElement, Tooltip, Legend);

type Workout = {
  id: string;
  exercise: string;
  reps: number;
  accuracy: number;
  durationMs: number;
  createdAt: number;
};

export default function Dashboard() {
  const [workouts, setWorkouts] = useState<Workout[]>([]);

  useEffect(() => {
    fetch("/api/workouts")
      .then((res) => res.json())
      .then((data) => setWorkouts(data.workouts ?? []))
      .catch(() => {});
  }, []);

  const totalReps = workouts.reduce((sum, w) => sum + (w.reps ?? 0), 0);
  const avgAccuracy = workouts.length
    ? Math.round(workouts.reduce((sum, w) => sum + (w.accuracy ?? 0), 0) / workouts.length)
    : 0;

  const chartData = useMemo(
    () => ({
      labels: workouts.map((w) => new Date(w.createdAt ?? Date.now()).toLocaleDateString()),
      datasets: [
        {
          label: "Reps",
          data: workouts.map((w) => w.reps),
          borderColor: "#7C3AED",
          backgroundColor: "rgba(124,58,237,0.3)"
        },
        {
          label: "Accuracy",
          data: workouts.map((w) => w.accuracy),
          borderColor: "#0EA5E9",
          backgroundColor: "rgba(14,165,233,0.3)",
          yAxisID: "y1"
        }
      ]
    }),
    [workouts]
  );

  return (
    <main className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-secondary uppercase tracking-[0.2em] font-semibold">
            Dashboard
          </p>
          <h1 className="text-3xl font-bold text-white">Progress Overview</h1>
        </div>
        <Link href="/" className="text-sm text-secondary underline">
          Home
        </Link>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <WorkoutStatsCard title="Total Reps" value={String(totalReps)} subtitle="All sessions" />
        <WorkoutStatsCard title="Avg Accuracy" value={`${avgAccuracy}%`} subtitle="Pose quality" />
        <WorkoutStatsCard title="Sessions" value={String(workouts.length)} subtitle="Logged" />
      </div>

      <div className="glass rounded-3xl p-4">
        <h2 className="text-xl font-semibold text-white mb-3">Reps & Accuracy</h2>
        <Line
          data={chartData}
          options={{
            responsive: true,
            plugins: { legend: { labels: { color: "#e5e7eb" } } },
            scales: {
              x: { ticks: { color: "#94a3b8" }, grid: { color: "rgba(255,255,255,0.05)" } },
              y: { ticks: { color: "#94a3b8" }, grid: { color: "rgba(255,255,255,0.05)" } },
              y1: { position: "right", ticks: { color: "#94a3b8" }, grid: { display: false } }
            }
          }}
        />
      </div>

      <div className="glass rounded-3xl p-4">
        <h3 className="text-lg font-semibold text-white mb-2">History</h3>
        <div className="divide-y divide-slate-800">
          {workouts.map((w) => (
            <div key={w.id} className="py-3 flex items-center justify-between">
              <div>
                <p className="text-white capitalize">{w.exercise}</p>
                <p className="text-xs text-gray-400">
                  {new Date(w.createdAt ?? Date.now()).toLocaleString()}
                </p>
              </div>
              <div className="text-sm text-gray-300 flex gap-3">
                <span>{w.reps} reps</span>
                <span>{w.accuracy}% accuracy</span>
              </div>
            </div>
          ))}
          {!workouts.length && <p className="text-gray-400 text-sm">No workouts logged yet.</p>}
        </div>
      </div>
    </main>
  );
}



