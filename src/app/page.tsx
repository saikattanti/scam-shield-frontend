import Hero from "@/components/Hero";
import InputForm from "@/components/InputForm";
import LiveTicker from "@/components/LiveTicker";

export default function Home() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 text-slate-900 selection:bg-blue-200 pb-12">
      {/* Background Pattern */}
      <div className="fixed inset-0 z-0 bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(59,130,246,0.1),rgba(255,255,255,0))]"></div>

      <div className="relative z-10 container mx-auto px-4 max-w-7xl pt-6">
        <Hero />

        {/* Main Content Grid */}
        <div className="grid lg:grid-cols-12 gap-8 mt-8 items-start">
          {/* Left: Main Analysis */}
          <div className="lg:col-span-7 xl:col-span-8">
            <InputForm />
          </div>

          {/* Right: Live Activity Sidebar */}
          <div className="lg:col-span-5 xl:col-span-4 sticky top-6">
            <LiveTicker />
          </div>
        </div>
      </div>
    </main>
  );
}
