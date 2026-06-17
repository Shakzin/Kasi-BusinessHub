import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Store,
  Building2,
  Calendar,
  BarChart3,
  ArrowRight,
  Check,




} from "lucide-react";
import { Link } from "react-router";
import { useAuth } from "@/hooks/useAuth";

export default function Landing() {
  const { isAuthenticated } = useAuth();

  return (
    <div className="min-h-screen bg-[#FAFAF8]">
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-md border-b border-[#E7E5E4]">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2">
            <Store className="h-6 w-6 text-[#4F46E5]" />
            <span className="font-semibold text-[#1C1917]">Kasi BusinessHub</span>
          </Link>
          <div className="flex items-center gap-4">
            {isAuthenticated ? (
              <Link to="/dashboard">
                <Button className="bg-[#4F46E5] hover:bg-[#4338CA]">
                  Dashboard
                </Button>
              </Link>
            ) : (
              <>
                <Link to="/login">
                  <Button variant="ghost" className="text-[#57534E]">
                    Sign In
                  </Button>
                </Link>
                <Link to="/register">
                  <Button className="bg-[#4F46E5] hover:bg-[#4338CA]">
                    Get Started
                  </Button>
                </Link>
              </>
            )}
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="pt-32 pb-20 px-6 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-[#EDE9FE]/60 via-[#FAFAF8] to-[#ECFDF5]/40 pointer-events-none" />
        <div className="absolute top-20 right-10 w-72 h-72 bg-[#EDE9FE]/50 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-10 left-10 w-96 h-96 bg-[#ECFDF5]/40 rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-5xl mx-auto text-center relative">
          <Badge
            variant="secondary"
            className="mb-6 bg-[#EEF2FF] text-[#4F46E5] hover:bg-[#EEF2FF] px-4 py-1.5 text-xs font-medium"
          >
            <Sparkles className="h-3 w-3 mr-1" />
            South Africa's leading business platform
          </Badge>
          <h1 className="text-5xl md:text-6xl font-bold text-[#1C1917] tracking-tight leading-tight mb-6">
            Grow Your Business.
            <br />
            <span className="text-[#4F46E5]">Showcase Your Events.</span>
          </h1>
          <p className="text-lg text-[#78716C] max-w-2xl mx-auto mb-10 leading-relaxed">
            Join thousands of South African business owners who trust Kasi BusinessHub to manage
            their presence, organise events, and connect with their customers — all
            in one beautiful platform.
          </p>
          <div className="flex items-center justify-center gap-4">
            <Link to="/register">
              <Button
                size="lg"
                className="bg-[#4F46E5] hover:bg-[#4338CA] px-8 h-12 text-base"
              >
                Start Free Today
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
            <Link to="/subscription">
              <Button
                variant="outline"
                size="lg"
                className="px-8 h-12 text-base border-[#E7E5E4] text-[#57534E] hover:bg-[#F5F5F3]"
              >
                View Plans
              </Button>
            </Link>
          </div>

          {/* Floating cards mockup */}
          <div className="mt-16 relative max-w-4xl mx-auto">
            <div className="grid grid-cols-3 gap-4">
              <div className="bg-white rounded-xl shadow-lg border border-[#E7E5E4] p-4 rotate-[-3deg] transform hover:rotate-0 transition-transform duration-300">
                <div className="h-24 bg-gradient-to-br from-[#EDE9FE] to-[#F5F3FF] rounded-lg mb-3" />
                <div className="h-3 bg-[#E7E5E4] rounded w-3/4 mb-2" />
                <div className="h-2 bg-[#F5F5F4] rounded w-1/2" />
              </div>
              <div className="bg-white rounded-xl shadow-lg border border-[#E7E5E4] p-4 translate-y-[-12px]">
                <div className="h-24 bg-gradient-to-br from-[#ECFDF5] to-[#D1FAE5] rounded-lg mb-3" />
                <div className="h-3 bg-[#E7E5E4] rounded w-3/4 mb-2" />
                <div className="h-2 bg-[#F5F5F4] rounded w-1/2" />
              </div>
              <div className="bg-white rounded-xl shadow-lg border border-[#E7E5E4] p-4 rotate-[3deg] transform hover:rotate-0 transition-transform duration-300">
                <div className="h-24 bg-gradient-to-br from-[#EFF6FF] to-[#DBEAFE] rounded-lg mb-3" />
                <div className="h-3 bg-[#E7E5E4] rounded w-3/4 mb-2" />
                <div className="h-2 bg-[#F5F5F4] rounded w-1/2" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-20 px-6 bg-white">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-semibold text-[#1C1917] mb-4">
              Everything You Need
            </h2>
            <p className="text-[#78716C] max-w-xl mx-auto">
              Powerful tools to manage your business and events in one place
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                icon: Building2,
                title: "Business Profiles",
                desc: "Create stunning business profiles with photos, descriptions, and contact details. Make a lasting impression on your customers across South Africa.",
                color: "bg-[#EEF2FF] text-[#4F46E5]",
              },
              {
                icon: Calendar,
                title: "Event Management",
                desc: "Post and manage events with dates, locations, and rich details. Keep your customers engaged with your latest offerings and promotions.",
                color: "bg-[#ECFDF5] text-[#059669]",
              },
              {
                icon: BarChart3,
                title: "Analytics Dashboard",
                desc: "Track views, engagement, and growth with real-time insights. Understand your customer base and optimise your business performance.",
                color: "bg-[#EFF6FF] text-[#2563EB]",
              },
            ].map((feature) => (
              <div
                key={feature.title}
                className="p-8 rounded-2xl border border-[#E7E5E4] hover:shadow-lg hover:-translate-y-1 transition-all duration-300 bg-white"
              >
                <div
                  className={`w-12 h-12 rounded-xl ${feature.color} flex items-center justify-center mb-5`}
                >
                  <feature.icon className="h-6 w-6" />
                </div>
                <h3 className="text-xl font-semibold text-[#1C1917] mb-3">
                  {feature.title}
                </h3>
                <p className="text-[#78716C] leading-relaxed">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-20 px-6 bg-[#F5F5F3]">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-semibold text-[#1C1917] mb-4">
              Get Started in Minutes
            </h2>
          </div>

          <div className="grid md:grid-cols-4 gap-8">
            {[
              { step: "01", title: "Sign Up", desc: "Create your account in seconds" },
              { step: "02", title: "Subscribe", desc: "Choose a plan that fits your needs" },
              { step: "03", title: "Create", desc: "Add your business and event details" },
              { step: "04", title: "Publish", desc: "Go live and reach your audience" },
            ].map((item, i) => (
              <div key={item.step} className="text-center relative">
                <div className="w-12 h-12 rounded-full bg-[#4F46E5] text-white flex items-center justify-center font-semibold mx-auto mb-4 text-sm">
                  {item.step}
                </div>
                <h4 className="text-lg font-semibold text-[#1C1917] mb-2">
                  {item.title}
                </h4>
                <p className="text-[#78716C] text-sm">{item.desc}</p>
                {i < 3 && (
                  <div className="hidden md:block absolute top-6 left-[60%] right-[-40%] h-[2px] border-t-2 border-dashed border-[#E7E5E4]" />
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section className="py-20 px-6 bg-white">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-semibold text-[#1C1917] mb-4">
              Simple, Transparent Pricing
            </h2>
            <p className="text-[#78716C]">
              Choose the plan that works best for your business
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                name: "Starter",
                price: "R149",
                period: "/month",
                desc: "Perfect for individuals just getting started",
                features: [
                  "1 Business Profile",
                  "5 Active Events",
                  "Basic Analytics",
                  "Email Support",
                ],
                cta: "Get Started",
                highlighted: false,
              },
              {
                name: "Professional",
                price: "R499",
                period: "/month",
                desc: "Best for growing businesses",
                features: [
                  "5 Business Profiles",
                  "Unlimited Events",
                  "Advanced Analytics",
                  "Priority Support",
                  "Custom Domain",
                ],
                cta: "Go Professional",
                highlighted: true,
              },
              {
                name: "Enterprise",
                price: "R1,699",
                period: "/month",
                desc: "For businesses with advanced needs",
                features: [
                  "Unlimited Business Profiles",
                  "Unlimited Events",
                  "Full Analytics Suite",
                  "Dedicated Support",
                  "API Access",
                ],
                cta: "Contact Sales",
                highlighted: false,
              },
            ].map((plan) => (
              <div
                key={plan.name}
                className={`rounded-2xl p-8 border-2 ${
                  plan.highlighted
                    ? "border-[#4F46E5] shadow-xl relative"
                    : "border-[#E7E5E4]"
                } bg-white hover:shadow-lg transition-shadow`}
              >
                {plan.highlighted && (
                  <Badge className="absolute -top-3 left-1/2 -translate-x-1/2 bg-[#4F46E5] text-white hover:bg-[#4F46E5] px-3">
                    Most Popular
                  </Badge>
                )}
                <h3 className="text-lg font-semibold text-[#1C1917] mb-2">
                  {plan.name}
                </h3>
                <div className="flex items-baseline gap-1 mb-2">
                  <span className="text-4xl font-bold text-[#1C1917]">
                    {plan.price}
                  </span>
                  <span className="text-[#78716C]">{plan.period}</span>
                </div>
                <p className="text-[#78716C] text-sm mb-6">{plan.desc}</p>
                <ul className="space-y-3 mb-8">
                  {plan.features.map((f) => (
                    <li key={f} className="flex items-start gap-2 text-sm">
                      <Check className="h-4 w-4 text-[#059669] shrink-0 mt-0.5" />
                      <span className="text-[#57534E]">{f}</span>
                    </li>
                  ))}
                </ul>
                <Link to="/register" className="block">
                  <Button
                    className={`w-full ${
                      plan.highlighted
                        ? "bg-[#4F46E5] hover:bg-[#4338CA]"
                        : "bg-white text-[#57534E] border border-[#E7E5E4] hover:bg-[#F5F5F3]"
                    }`}
                    variant={plan.highlighted ? "default" : "outline"}
                  >
                    {plan.cta}
                  </Button>
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-[#1C1917] py-12 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-2">
              <Store className="h-5 w-5 text-[#4F46E5]" />
              <span className="font-semibold text-white">Kasi BusinessHub</span>
            </div>
            <p className="text-[#78716C] text-sm">
              &copy; {new Date().getFullYear()} Kasi BusinessHub. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}

function Sparkles({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z" />
      <path d="M5 3v4" />
      <path d="M19 17v4" />
      <path d="M3 5h4" />
      <path d="M17 19h4" />
    </svg>
  );
}
