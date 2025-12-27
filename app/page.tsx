import Link from "next/link";
import ExerciseSelector from "@/components/ExerciseSelector";
import { Logo } from "@/components/Logo";
import { HeroBanner } from "@/components/HeroBanner";

export default function Home() {
  const exercises = [
    { name: "squat", label: "Squats", description: "Leg strength and glutes" },
    { name: "pushup", label: "Pushups", description: "Upper body strength" },
    { name: "lunge", label: "Lunges", description: "Leg stability and balance" },
    { name: "jumpingjack", label: "Jumping Jacks", description: "Cardio warmup" },
    { name: "headrotation", label: "Head Rotations", description: "Neck mobility and flexibility" }
  ];

  return (
    <main className="min-h-screen bg-white text-gray-900 pb-20">
      {/* Navbar Placeholder */}
      <nav className="fixed top-0 w-full z-50 glass border-b border-gray-100/50">
        <div className="max-w-5xl mx-auto px-6 h-12 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
            <Logo className="w-8 h-8" />
            <span className="text-sm font-semibold tracking-tight">KEMTAI</span>
          </Link>
          <div className="flex gap-4 text-xs font-medium text-gray-500">
            <Link href="/dashboard" className="hover:text-black transition-colors">Studio</Link>
            <Link href="#features" className="hover:text-black transition-colors">Features</Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-20 pb-20 px-6 text-center">
        {/* Hero Banner */}
        <div className="max-w-5xl mx-auto mb-8">
          <HeroBanner />
        </div>
        <div className="max-w-3xl mx-auto space-y-6 animate-fade-in">
          <h1 className="text-5xl md:text-7xl font-semibold tracking-tight text-gray-900 hero-text">
            Fitness. <br />
            <span className="text-gradient-blue">Reimagined.</span>
          </h1>
          <p className="text-xl md:text-2xl text-gray-500 font-normal leading-relaxed max-w-xl mx-auto sub-hero-text">
            Real-time AI form correction. <br className="hidden md:block" />
            Precision training right from your living room.
          </p>

          <div className="pt-8 flex items-center justify-center gap-4">
            <Link
              href="/dashboard"
              className="px-8 py-3 bg-blue-600 text-white rounded-full text-base font-medium hover:bg-blue-700 transition-all shadow-lg hover:shadow-xl hover:-translate-y-0.5"
            >
              Start Training
            </Link>
            <Link
              href="#learn-more"
              className="px-8 py-3 text-blue-600 rounded-full text-base font-medium hover:bg-blue-50 transition-colors"
            >
              Learn more
            </Link>
          </div>
        </div>
      </section>

      {/* Stats Grid */}
      <section className="max-w-5xl mx-auto px-6 py-12">
        <div className="grid md:grid-cols-3 gap-6">
          <div className="apple-card p-8 text-center space-y-2">
            <div className="text-3xl font-semibold text-gray-900">99%</div>
            <div className="text-sm text-gray-500 font-medium">Precision Analysis</div>
          </div>
          <div className="apple-card p-8 text-center space-y-2">
            <div className="text-3xl font-semibold text-gray-900">&lt;0.1s</div>
            <div className="text-sm text-gray-500 font-medium">Latency</div>
          </div>
          <div className="apple-card p-8 text-center space-y-2">
            <div className="text-3xl font-semibold text-gray-900">100%</div>
            <div className="text-sm text-gray-500 font-medium">Private & Local</div>
          </div>
        </div>
      </section>

      {/* Exercise Selection */}
      <section className="max-w-5xl mx-auto px-6 py-20 space-y-12">
        <div className="text-center space-y-4">
          <h2 className="text-4xl font-semibold tracking-tight text-gray-900">Select Your Routine.</h2>
          <p className="text-gray-500 text-lg">Choose from a variety of exercises tailored to your needs.</p>
        </div>

        {/* We need to update ExerciseSelector to match the theme too, passing props or relying on global styles */}
        <ExerciseSelector exercises={exercises} />
      </section>
    </main>
  );
}
