"use client";

import { useEffect, useMemo, useState, useCallback } from "react";
import { notFound, useParams } from "next/navigation";
import CameraView from "@/components/CameraView";
import WorkoutStatsCard from "@/components/WorkoutStatsCard";
import Link from "next/link";

const supported = ["squat", "pushup", "lunge", "jumpingjack", "headrotation"] as const;

export default function ExercisePage() {
  const params = useParams<{ name: string }>();
  const exercise = params?.name?.toLowerCase();
  const isValid = supported.includes(exercise as (typeof supported)[number]);
  const [reps, setReps] = useState(0);
  const [accuracy, setAccuracy] = useState(0);
  const [feedback, setFeedback] = useState<string | null>(null);
  const [startTime] = useState(() => Date.now());
  const [elapsed, setElapsed] = useState(0);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    const timer = setInterval(() => setElapsed(Date.now() - startTime), 1000);
    return () => clearInterval(timer);
  }, [startTime]);

  const title = useMemo(() => {
    switch (exercise) {
      case "pushup": return "Pushups";
      case "lunge": return "Lunges";
      case "jumpingjack": return "Jumping Jacks";
      case "headrotation": return "Head Rotations";
      default: return "Squats";
    }
  }, [exercise]);

  const handleResult = useCallback((res: { reps: number; accuracy: number; feedback?: string | null }) => {
    setReps(res.reps);
    setAccuracy(Math.round(res.accuracy));
    if (res.feedback) setFeedback(res.feedback);
  }, []);

  if (!isValid) return notFound();

  return (
    <main className="min-h-screen bg-gray-50 pb-20 pt-8 px-6">
      <div className="max-w-6xl mx-auto space-y-8">

        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
              <p className="text-xs uppercase tracking-widest text-gray-500 font-semibold">Live Session</p>
            </div>
            <h1 className="text-4xl font-bold text-gray-900 tracking-tight">{title}</h1>
          </div>
          <Link href="/" className="px-4 py-2 text-sm text-gray-600 bg-white border border-gray-200 rounded-full hover:bg-gray-100 transition-colors shadow-sm">
            End Session
          </Link>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">

          {/* Left Column: Camera */}
          <div className="lg:col-span-2 space-y-6">
            <CameraView
              exercise={exercise as "squat" | "pushup" | "lunge" | "jumpingjack" | "headrotation"}
              onResult={handleResult}
            />
            {feedback && (
              <div className="p-4 bg-blue-50 border border-blue-100 rounded-xl text-blue-700 text-sm font-medium flex items-start gap-2">
                <svg className="w-5 h-5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                {feedback}
              </div>
            )}
          </div>

          {/* Right Column: Stats */}
          <div className="space-y-6">
            <div className="grid gap-4">
              <WorkoutStatsCard title="Reps" value={String(reps)} subtitle="Counted" />
              <WorkoutStatsCard title="Accuracy" value={`${accuracy}%`} subtitle="Form Score" />
              <WorkoutStatsCard title="Time" value={`${Math.floor(elapsed / 1000)}s`} subtitle="Total Duration" />
            </div>

            <div className="p-6 apple-card bg-white">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Session Controls</h3>
              <p className="text-sm text-gray-500 mb-6">Finished with your set? Save your progress to the dashboard.</p>
              <button
                onClick={async () => {
                  setSaving(true);
                  await fetch("/api/workouts", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({
                      exercise,
                      reps,
                      accuracy,
                      durationMs: elapsed
                    })
                  });
                  setSaving(false);
                  setSaved(true);
                }}
                className={`w-full py-4 rounded-xl text-white font-semibold text-lg transition-all shadow-lg ${saved ? "bg-green-500 hover:bg-green-600" : "bg-blue-600 hover:bg-blue-700 hover:-translate-y-0.5"
                  } disabled:opacity-50 disabled:cursor-not-allowed`}
                disabled={saving || saved}
              >
                {saving ? "Saving..." : saved ? "Session Saved" : "Save Workout"}
              </button>
            </div>
          </div>

        </div>
      </div>
    </main>
  );
}
