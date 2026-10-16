"use client"

import Link from "next/link"
import { motion } from "framer-motion"
import { Check } from "lucide-react"

const plans = [
  {
    name: "Free",
    price: "₹0",
    period: "forever",
    description: "For students exploring AI-assisted learning.",
    features: ["50 AI messages / day", "AI Tutor & Notes", "3 document uploads / month", "Voice assistant (basic)", "Community support"],
    cta: "Start for free",
    highlighted: false,
  },
  {
    name: "Pro",
    price: "₹299",
    period: "per month",
    description: "For power users who study and build every day.",
    features: ["Unlimited AI messages", "Unlimited document analysis", "Presentation generator", "Mock interview practice", "Priority response speed", "Email support"],
    cta: "Upgrade to Pro",
    highlighted: true,
  },
  {
    name: "Team",
    price: "₹999",
    period: "per month · 5 seats",
    description: "For study groups, clubs and small teams.",
    features: ["Everything in Pro", "Shared folders & chats", "Team analytics dashboard", "Admin controls", "Dedicated onboarding"],
    cta: "Contact us",
    highlighted: false,
  },
]

export function Pricing() {
  return (
    <section id="pricing" className="py-28 relative z-10 px-6 scroll-mt-20">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl sm:text-5xl font-bold tracking-tight mb-4 text-foreground">Simple, honest pricing</h2>
          <p className="text-lg text-muted-foreground max-w-xl mx-auto">
            Start free. Upgrade when Voxa becomes part of your daily workflow.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-6 items-stretch">
          {plans.map((plan, idx) => (
            <motion.div
              key={plan.name}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.1 }}
              className={`relative flex flex-col p-8 rounded-[28px] border ${
                plan.highlighted
                  ? "bg-gradient-to-br from-[#7C5CFF] to-[#4F8CFF] text-white border-transparent shadow-[0_12px_40px_-12px_rgba(124,92,255,0.6)]"
                  : "bg-card border-border shadow-sm"
              }`}
            >
              {plan.highlighted && (
                <span className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-1 text-xs font-semibold rounded-full bg-white text-primary shadow-sm">
                  Most popular
                </span>
              )}
              <h3 className={`text-xl font-bold ${plan.highlighted ? "text-white" : "text-foreground"}`}>{plan.name}</h3>
              <p className={`mt-2 text-sm ${plan.highlighted ? "text-white/80" : "text-muted-foreground"}`}>{plan.description}</p>
              <div className="mt-6 flex items-baseline gap-2">
                <span className={`text-4xl font-bold ${plan.highlighted ? "text-white" : "text-foreground"}`}>{plan.price}</span>
                <span className={`text-sm ${plan.highlighted ? "text-white/80" : "text-muted-foreground"}`}>{plan.period}</span>
              </div>
              <ul className="mt-6 space-y-3 flex-1">
                {plan.features.map((f) => (
                  <li key={f} className="flex items-start gap-2 text-sm">
                    <Check className={`h-4 w-4 mt-0.5 shrink-0 ${plan.highlighted ? "text-white" : "text-primary"}`} />
                    <span className={plan.highlighted ? "text-white/90" : "text-foreground/80"}>{f}</span>
                  </li>
                ))}
              </ul>
              <Link
                href={plan.name === "Team" ? "/contact" : "/auth"}
                className={`mt-8 inline-flex items-center justify-center h-12 rounded-xl font-semibold transition-colors ${
                  plan.highlighted
                    ? "bg-white text-primary hover:bg-white/90"
                    : "bg-secondary text-secondary-foreground hover:bg-accent border border-border"
                }`}
              >
                {plan.cta}
              </Link>
            </motion.div>
          ))}
        </div>
        <p className="mt-8 text-center text-xs text-muted-foreground">
          Voxa is a portfolio project — plans are illustrative and no payment is taken.
        </p>
      </div>
    </section>
  )
}
