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
import { ArrowLeft } from "lucide-react";

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
      .catch(() => { });
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
          borderColor: "#0066CC", // Apple Blue
          backgroundColor: "rgba(0, 102, 204, 0.1)",
          tension: 0.4,
          pointBackgroundColor: "#ffffff",
          pointBorderColor: "#0066CC",
          pointBorderWidth: 2,
        },
        {
          label: "Accuracy",
          data: workouts.map((w) => w.accuracy),
          borderColor: "#34C759", // Apple Green
          backgroundColor: "rgba(52, 199, 89, 0.1)",
          yAxisID: "y1",
          tension: 0.4,
          pointBackgroundColor: "#ffffff",
          pointBorderColor: "#34C759",
          pointBorderWidth: 2,
        }
      ]
    }),
    [workouts]
  );

  return (
    <main className="min-h-screen bg-white pb-20 pt-10 px-6">
      <div className="max-w-5xl mx-auto space-y-10">

        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <div className="flex items-center gap-2 mb-2 text-blue-600">
              <Link href="/" className="flex items-center gap-1 text-sm font-medium hover:underline">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
                Back
              </Link>
            </div>
            <h1 className="text-4xl font-bold text-gray-900 tracking-tight">Summary</h1>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid gap-6 md:grid-cols-3">
          <WorkoutStatsCard title="Total Reps" value={String(totalReps)} subtitle="All sessions" />
          <WorkoutStatsCard title="Avg Accuracy" value={`${avgAccuracy}%`} subtitle="Pose quality" />
          <WorkoutStatsCard title="Sessions" value={String(workouts.length)} subtitle="Logged" />
        </div>

        {/* Chart Section */}
        <div className="p-8 apple-card">
          <h2 className="text-xl font-semibold text-gray-900 mb-6">Performance Trends</h2>
          <div className="h-[300px] w-full">
            <Line
              data={chartData}
              options={{
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                  legend: { labels: { color: "#1d1d1f", font: { family: "'Inter', sans-serif" } } }
                },
                scales: {
                  x: {
                    ticks: { color: "#86868b" },
                    grid: { color: "rgba(0,0,0,0.05)", drawBorder: false }
                  },
                  y: {
                    ticks: { color: "#86868b" },
                    grid: { color: "rgba(0,0,0,0.05)", drawBorder: false }
                  },
                  y1: {
                    position: "right",
                    ticks: { color: "#86868b" },
                    grid: { display: false }
                  }
                }
              }}
            />
          </div>
        </div>

        {/* History List */}
        <div className="p-8 apple-card">
          <h3 className="text-xl font-semibold text-gray-900 mb-6">Recent Activity</h3>
          <div className="divide-y divide-gray-100">
            {workouts.map((w) => (
              <div key={w.id} className="py-4 flex items-center justify-between group hover:bg-gray-50 -mx-4 px-4 rounded-lg transition-colors">
                <div>
                  <p className="text-gray-900 font-medium capitalize text-lg">{w.exercise}</p>
                  <p className="text-xs text-gray-500 font-medium mt-0.5">
                    {new Date(w.createdAt ?? Date.now()).toLocaleDateString(undefined, { weekday: 'short', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
                  </p>
                </div>
                <div className="text-right">
                  <div className="text-gray-900 font-semibold">{w.reps} reps</div>
                  <div className="text-xs text-green-600 font-medium">{w.accuracy}% acc</div>
                </div>
              </div>
            ))}
            {!workouts.length && <p className="text-gray-400 text-center py-8">No workouts logged yet.</p>}
          </div>
        </div>

      </div>
    </main>
  );
}
