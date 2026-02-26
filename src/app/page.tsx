import Link from "next/link";
import { ArrowRight, Camera, Check, Shield, Zap } from "lucide-react";
import { cn } from "@/lib/utils";

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen bg-black text-white selection:bg-yellow-400 selection:text-black">
      {/* Header */}
      <header className="fixed w-full z-50 bg-black/80 backdrop-blur-md border-b border-white/10">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Camera className="w-6 h-6 text-yellow-400" />
            <span className="font-bold text-xl tracking-tighter">Snaparoo<span className="text-yellow-400">.</span></span>
          </div>
          <nav className="hidden md:flex gap-8 text-sm font-medium text-gray-400">
            <Link href="#features" className="hover:text-white transition-colors">Features</Link>
            <Link href="#how-it-works" className="hover:text-white transition-colors">How it Works</Link>
            <Link href="#pricing" className="hover:text-white transition-colors">Pricing</Link>
          </nav>
          <div className="flex gap-4">
            <Link 
              href="/create" 
              className="px-4 py-2 bg-yellow-400 text-black font-bold text-sm rounded hover:bg-yellow-300 transition-all flex items-center gap-2"
            >
              Create Event <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="pt-32 pb-20 md:pt-48 md:pb-32 px-4 container mx-auto text-center relative overflow-hidden">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-yellow-400/20 blur-[120px] rounded-full pointer-events-none" />
        
        <h1 className="text-5xl md:text-7xl font-extrabold tracking-tighter mb-6 relative z-10">
          Event memories captured.<br />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-orange-500">Hassle-free.</span>
        </h1>
        <p className="text-xl text-gray-400 max-w-2xl mx-auto mb-10 relative z-10">
          The disposable camera for the digital age. No app download required. 
          Just scan, snap, and keep the memories forever.
        </p>
        <div className="flex flex-col md:flex-row gap-4 justify-center items-center relative z-10">
          <Link 
            href="/create" 
            className="px-8 py-4 bg-white text-black font-bold text-lg rounded hover:bg-gray-100 transition-all w-full md:w-auto"
          >
            Start Your Event
          </Link>
          <Link 
            href="#demo" 
            className="px-8 py-4 border border-white/20 bg-white/5 backdrop-blur text-white font-bold text-lg rounded hover:bg-white/10 transition-all w-full md:w-auto"
          >
            View Demo
          </Link>
        </div>
      </section>

      {/* Features Grid */}
      <section id="features" className="py-20 bg-zinc-900">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-16 tracking-tighter">Why Snaparoo?</h2>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                icon: <Zap className="w-8 h-8 text-yellow-400" />,
                title: "Instant Access",
                desc: "No apps to install. Guests scan a QR code and start snapping photos immediately."
              },
              {
                icon: <Shield className="w-8 h-8 text-yellow-400" />,
                title: "Privacy First",
                desc: "Photos go directly to your Google Drive. We don't keep your memories hostage."
              },
              {
                icon: <Camera className="w-8 h-8 text-yellow-400" />,
                title: "Disposable Feel",
                desc: "Limit shots per guest to recreate the preciousness of film photography."
              }
            ].map((feature, i) => (
              <div key={i} className="p-8 rounded-2xl bg-black border border-white/10 hover:border-yellow-400/50 transition-all">
                <div className="mb-6">{feature.icon}</div>
                <h3 className="text-xl font-bold mb-3">{feature.title}</h3>
                <p className="text-gray-400 leading-relaxed">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="py-20 container mx-auto px-4">
        <h2 className="text-3xl font-bold text-center mb-4 tracking-tighter">Simple Pricing</h2>
        <p className="text-gray-400 text-center mb-16">Pay once per event. No subscriptions.</p>
        
        <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          {[
            {
              name: "Basic",
              price: "$29",
              features: ["Up to 50 Guests", "Standard Branding", "7 Day Gallery Access", "Google Drive Sync"]
            },
            {
              name: "Premium",
              price: "$49",
              popular: true,
              features: ["Up to 200 Guests", "Custom Branding", "30 Day Gallery Access", "Video Support", "Priority Support"]
            },
            {
              name: "Corporate",
              price: "Custom",
              features: ["Unlimited Guests", "White-label Domain", "Analytics Dashboard", "Dedicated Account Manager"]
            }
          ].map((plan, i) => (
            <div key={i} className={cn(
              "p-8 rounded-2xl border flex flex-col relative",
              plan.popular ? "bg-zinc-900 border-yellow-400" : "bg-black border-white/10"
            )}>
              {plan.popular && (
                <span className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-1 bg-yellow-400 text-black text-xs font-bold uppercase tracking-wider rounded-full">
                  Most Popular
                </span>
              )}
              <h3 className="text-xl font-bold mb-2">{plan.name}</h3>
              <div className="text-4xl font-extrabold mb-6">{plan.price}</div>
              <ul className="space-y-4 mb-8 flex-1">
                {plan.features.map((f, j) => (
                  <li key={j} className="flex items-center gap-3 text-sm text-gray-300">
                    <Check className="w-4 h-4 text-yellow-400" /> {f}
                  </li>
                ))}
              </ul>
              <Link 
                href={`/create?plan=${plan.name.toLowerCase()}`}
                className={cn(
                  "w-full py-3 rounded font-bold text-center transition-all",
                  plan.popular ? "bg-yellow-400 text-black hover:bg-yellow-300" : "bg-white/10 text-white hover:bg-white/20"
                )}
              >
                Choose {plan.name}
              </Link>
            </div>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 border-t border-white/10 bg-black text-center text-gray-500 text-sm">
        <p>&copy; {new Date().getFullYear()} Snaparoo by Hili. All rights reserved.</p>
      </footer>
    </div>
  );
}
