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
      case "pushup":
        return "Pushups";
      case "lunge":
        return "Lunges";
      case "jumpingjack":
        return "Jumping Jacks";
      case "headrotation":
        return "Head Rotations";
      default:
        return "Squats";
    }
  }, [exercise]);

  const handleResult = useCallback((res: { reps: number; accuracy: number; feedback?: string | null }) => {
    setReps(res.reps);
    setAccuracy(Math.round(res.accuracy));
    if (res.feedback) setFeedback(res.feedback);
  }, []);

  if (!isValid) return notFound();

  return (
    <main className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-primary uppercase tracking-[0.2em] font-semibold">
            Live Session
          </p>
          <h1 className="text-3xl font-bold text-white">{title}</h1>
        </div>
        <Link href="/" className="text-sm text-secondary underline">
          Back to home
        </Link>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <WorkoutStatsCard title="Reps" value={String(reps)} subtitle="Auto-counted" />
        <WorkoutStatsCard title="Accuracy" value={`${accuracy}%`} subtitle="Avg pose score" />
        <WorkoutStatsCard title="Timer" value={`${Math.floor(elapsed / 1000)}s`} subtitle="Session time" />
      </div>

      <div className="glass rounded-3xl p-4">
        <CameraView
          exercise={exercise as any}
          onResult={handleResult}
        />
        <div className="mt-4 flex justify-end">
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
            className="px-4 py-2 rounded-lg bg-primary text-white disabled:opacity-60"
            disabled={saving}
          >
            {saving ? "Saving..." : saved ? "Saved" : "Save Session"}
          </button>
        </div>
      </div>

      {feedback && (
        <div className="rounded-xl border border-secondary/40 bg-secondary/10 px-4 py-3 text-secondary">
          Voice feedback: {feedback}
        </div>
      )}
    </main>
  );
}

