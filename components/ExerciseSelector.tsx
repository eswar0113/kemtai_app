"use client";

import Link from "next/link";
import { motion } from "framer-motion";


type Exercise = {
  name: string;
  label: string;
  description: string;
};

type Props = {
  exercises: Exercise[];
};

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1
    }
  }
};

const item = {
  hidden: { opacity: 0, scale: 0.95 },
  show: { opacity: 1, scale: 1 }
};

export default function ExerciseSelector({ exercises }: Props) {
  return (
    <motion.div
      variants={container}
      initial="hidden"
      animate="show"
      className="grid gap-6 md:grid-cols-2 lg:grid-cols-3"
    >
      {exercises.map((exercise) => (
        <motion.div key={exercise.name} variants={item}>
          <Link
            href={`/exercise/${exercise.name}`}
            className="group block h-full p-8 apple-card hover:bg-white relative overflow-hidden"
          >
            <div className="flex flex-col h-full justify-between space-y-8 relative z-10">
              <div>
                <h3 className="text-2xl font-semibold text-gray-900 mb-2 group-hover:text-blue-600 transition-colors">
                  {exercise.label}
                </h3>
                <p className="text-base text-gray-500 leading-relaxed">
                  {exercise.description}
                </p>
              </div>

              <div className="flex items-center text-sm font-medium text-blue-600 opacity-0 transform translate-y-2 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300">
                Start Session
                <svg className="ml-2 w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                </svg>
              </div>
            </div>

            {/* Subtle Gradient background on hover? Optional. Keeping it clean mainly. */}
          </Link>
        </motion.div>
      ))}
    </motion.div>
  );
}
