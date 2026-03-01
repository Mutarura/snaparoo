import Link from "next/link";
import { ArrowRight, Camera, Check, Shield, Zap, Star, Users, ImageIcon, QrCode, Smartphone } from "lucide-react";

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen bg-[#050505] text-white overflow-x-hidden">
      {/* Header */}
      <header className="fixed w-full z-50 glass-dark border-b border-white/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-yellow-400 flex items-center justify-center">
              <Camera className="w-4.5 h-4.5 text-black" strokeWidth={2.5} />
            </div>
            <span className="font-bold text-lg tracking-tight">
              Snaparoo<span className="text-yellow-400">.</span>
            </span>
            <span className="hidden sm:block text-xs text-white/30 font-medium ml-1">by Hili</span>
          </div>

          <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-white/50">
            <Link href="#features" className="hover:text-white transition-colors">Features</Link>
            <Link href="#how-it-works" className="hover:text-white transition-colors">How it Works</Link>
            <Link href="#pricing" className="hover:text-white transition-colors">Pricing</Link>
          </nav>

          <div className="flex items-center gap-3">
            <Link href="/auth" className="hidden sm:block text-sm font-medium text-white/60 hover:text-white transition-colors px-3 py-2">
              Sign In
            </Link>
            <Link
              href="/auth?mode=signup"
              className="btn-primary text-sm px-5 py-2.5 flex items-center gap-1.5"
            >
              Get Started <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="relative pt-32 pb-24 md:pt-44 md:pb-36 px-4 flex flex-col items-center text-center overflow-hidden">
        {/* Background glows */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] bg-yellow-400/10 blur-[120px] rounded-full pointer-events-none" />
        <div className="absolute top-1/4 left-1/4 w-[300px] h-[300px] bg-orange-500/8 blur-[80px] rounded-full pointer-events-none" />
        <div className="absolute top-1/4 right-1/4 w-[300px] h-[300px] bg-yellow-300/8 blur-[80px] rounded-full pointer-events-none" />

        {/* Badge */}
        <div className="relative z-10 inline-flex items-center gap-2 px-4 py-2 rounded-full glass border border-yellow-400/20 text-sm font-medium text-yellow-400 mb-8">
          <Star className="w-3.5 h-3.5 fill-yellow-400" />
          The Disposable Camera for the Digital Age
        </div>

        <h1 className="relative z-10 text-5xl sm:text-6xl md:text-7xl font-extrabold tracking-tighter leading-[1.05] mb-6 max-w-4xl">
          Event memories captured.{" "}
          <span className="gradient-text">Hassle-free.</span>
        </h1>

        <p className="relative z-10 text-xl text-white/50 max-w-2xl mx-auto mb-10 leading-relaxed">
          No app download needed. Guests scan a QR code, snap photos & videos, and they&apos;re automatically shared. You stay in full control of your event gallery.
        </p>

        <div className="relative z-10 flex flex-col sm:flex-row gap-4 justify-center w-full max-w-sm sm:max-w-none">
          <Link
            href="/auth?mode=signup"
            className="btn-primary text-base px-8 py-4 flex items-center justify-center gap-2"
          >
            Create Your Event <ArrowRight className="w-5 h-5" />
          </Link>
          <Link
            href="#how-it-works"
            className="btn-ghost text-base px-8 py-4 flex items-center justify-center gap-2"
          >
            <QrCode className="w-5 h-5" /> See How It Works
          </Link>
        </div>

        {/* Phone mockup hint */}
        <div className="relative z-10 mt-16 flex items-center gap-2 text-sm text-white/30">
          <Smartphone className="w-4 h-4" />
          <span>Works on any smartphone — no install required</span>
        </div>
      </section>

      {/* Stats bar */}
      <div className="border-y border-white/5 py-8 bg-white/[0.02]">
        <div className="max-w-5xl mx-auto px-4 grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
          {[
            { value: "10K+", label: "Events Hosted" },
            { value: "500K+", label: "Photos Taken" },
            { value: "98%", label: "Guest Satisfaction" },
            { value: "0", label: "Apps to Install" },
          ].map((stat) => (
            <div key={stat.label}>
              <div className="text-3xl font-extrabold gradient-text">{stat.value}</div>
              <div className="text-sm text-white/40 mt-1">{stat.label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Features */}
      <section id="features" className="py-24 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-extrabold tracking-tight mb-4">
              Everything you need to run a perfect event
            </h2>
            <p className="text-white/40 max-w-xl mx-auto">
              Snaparoo gives event organizers powerful tools and guests a seamless experience.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {[
              {
                icon: <QrCode className="w-6 h-6 text-yellow-400" />,
                title: "QR Code Access",
                desc: "Generate a QR code for your event. Guests scan it and immediately get access to the camera — no account, no app needed.",
              },
              {
                icon: <Shield className="w-6 h-6 text-yellow-400" />,
                title: "Privacy First",
                desc: "Media goes straight to your Google Drive or iCloud. We never store or access your guests' memories.",
              },
              {
                icon: <Camera className="w-6 h-6 text-yellow-400" />,
                title: "Disposable Feel",
                desc: "Limit shots per guest. Apply vintage filters. Recreate the magic and preciousness of a real disposable camera.",
              },
              {
                icon: <ImageIcon className="w-6 h-6 text-yellow-400" />,
                title: "Custom Branding",
                desc: "Upload your own poster or choose from our gallery. Every event gets its own branded camera interface.",
              },
              {
                icon: <Users className="w-6 h-6 text-yellow-400" />,
                title: "Guest Management",
                desc: "Set a guest limit, control gallery visibility, and manage when guests can view shared photos.",
              },
              {
                icon: <Zap className="w-6 h-6 text-yellow-400" />,
                title: "Instant Share",
                desc: "Photos appear in your gallery in real-time. Set it to show during the event or reveal after — your choice.",
              },
            ].map((f) => (
              <div
                key={f.title}
                className="glass p-6 rounded-2xl hover:border-yellow-400/20 transition-all group"
              >
                <div className="w-12 h-12 rounded-xl bg-yellow-400/10 flex items-center justify-center mb-5 group-hover:bg-yellow-400/15 transition-colors">
                  {f.icon}
                </div>
                <h3 className="text-lg font-bold mb-2">{f.title}</h3>
                <p className="text-white/40 text-sm leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How it Works */}
      <section id="how-it-works" className="py-24 px-4 bg-white/[0.02] border-y border-white/5">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-extrabold tracking-tight mb-4">
              Up and running in minutes
            </h2>
            <p className="text-white/40">Three steps. That&apos;s all it takes.</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                num: "01",
                title: "Create Your Event",
                desc: "Sign up, fill in your event details, pick a poster, set your guest limit and preferences. Done in 2 minutes.",
              },
              {
                num: "02",
                title: "Share the QR Code",
                desc: "Display your QR code at your venue or share the link via WhatsApp, email, or however you like.",
              },
              {
                num: "03",
                title: "Watch the Memories Flow",
                desc: "Guests scan, snap, and your gallery fills up automatically. Download everything after the event.",
              },
            ].map((step, i) => (
              <div key={step.num} className="relative">
                {i < 2 && (
                  <div className="hidden md:block absolute top-6 left-full w-8 h-px bg-gradient-to-r from-yellow-400/30 to-transparent z-10" style={{ transform: 'translateX(-50%)' }} />
                )}
                <div className="text-6xl font-black text-white/5 mb-4">{step.num}</div>
                <h3 className="text-xl font-bold mb-3">{step.title}</h3>
                <p className="text-white/40 leading-relaxed">{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section id="pricing" className="py-24 px-4">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-extrabold tracking-tight mb-4">Simple, event-based pricing</h2>
            <p className="text-white/40">Pay per event. No subscriptions. Start free.</p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {[
              {
                name: "Freemium",
                price: "Free",
                sub: "Up to 10 guests",
                features: [
                  "Up to 10 guests",
                  "25 photos per guest",
                  "Standard camera UI",
                  "Basic filters",
                  "7-day gallery access",
                ],
                cta: "Start Free",
                href: "/auth?mode=signup&plan=free",
                popular: false,
              },
              {
                name: "Starter",
                price: "300 KES",
                sub: "per event · 11–15 guests",
                features: [
                  "Up to 15 guests",
                  "50 photos per guest",
                  "Custom poster/branding",
                  "All filters",
                  "30-day gallery access",
                  "QR code download",
                ],
                cta: "Choose Starter",
                href: "/auth?mode=signup&plan=starter",
                popular: true,
              },
              {
                name: "Pro",
                price: "Custom",
                sub: "16+ guests · enterprise",
                features: [
                  "Unlimited guests",
                  "Custom media limits",
                  "White-label branding",
                  "Analytics dashboard",
                  "Priority support",
                  "Multi-event management",
                ],
                cta: "Contact Hili",
                href: "mailto:hili@snaparoo.app",
                popular: false,
              },
            ].map((plan) => (
              <div
                key={plan.name}
                className={`relative flex flex-col p-8 rounded-2xl border transition-all ${plan.popular
                    ? "border-yellow-400/50 bg-yellow-400/5 glow-yellow"
                    : "border-white/8 glass"
                  }`}
              >
                {plan.popular && (
                  <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 px-4 py-1 bg-yellow-400 text-black text-xs font-black uppercase tracking-widest rounded-full">
                    Most Popular
                  </div>
                )}
                <div className="mb-6">
                  <div className="text-sm font-semibold text-white/40 mb-1">{plan.name}</div>
                  <div className="text-4xl font-black tracking-tight mb-1">{plan.price}</div>
                  <div className="text-sm text-white/30">{plan.sub}</div>
                </div>

                <ul className="space-y-3 flex-1 mb-8">
                  {plan.features.map((f) => (
                    <li key={f} className="flex items-start gap-2.5 text-sm">
                      <Check className="w-4 h-4 text-yellow-400 mt-0.5 shrink-0" />
                      <span className="text-white/70">{f}</span>
                    </li>
                  ))}
                </ul>

                <Link
                  href={plan.href}
                  className={`w-full py-3 rounded-xl font-bold text-center transition-all text-sm ${plan.popular
                      ? "bg-yellow-400 text-black hover:bg-yellow-300"
                      : "bg-white/8 text-white hover:bg-white/15 border border-white/10"
                    }`}
                >
                  {plan.cta}
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Banner */}
      <section className="py-20 px-4">
        <div className="max-w-3xl mx-auto text-center">
          <div className="glass border border-yellow-400/20 rounded-3xl p-12">
            <h2 className="text-3xl md:text-4xl font-extrabold tracking-tight mb-4">
              Ready to capture your next event?
            </h2>
            <p className="text-white/40 mb-8">
              Join thousands of event organizers using Snaparoo to create unforgettable memories.
            </p>
            <Link
              href="/auth?mode=signup"
              className="btn-primary text-base px-10 py-4 inline-flex items-center gap-2"
            >
              Create Free Account <ArrowRight className="w-5 h-5" />
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-10 border-t border-white/5 bg-[#030303]">
        <div className="max-w-6xl mx-auto px-4 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded bg-yellow-400 flex items-center justify-center">
              <Camera className="w-3.5 h-3.5 text-black" strokeWidth={2.5} />
            </div>
            <span className="font-bold text-sm">Snaparoo by Hili</span>
          </div>
          <p className="text-sm text-white/20">
            &copy; {new Date().getFullYear()} Snaparoo by Hili. All rights reserved.
          </p>
          <div className="flex gap-6 text-sm text-white/30">
            <Link href="/privacy" className="hover:text-white transition-colors">Privacy</Link>
            <Link href="/terms" className="hover:text-white transition-colors">Terms</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
