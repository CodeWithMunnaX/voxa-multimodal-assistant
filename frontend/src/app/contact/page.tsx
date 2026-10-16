"use client"

import { useState } from "react"
import { Mail, Code2, Globe, MapPin, Send } from "lucide-react"
import { PageShell } from "@/components/landing/PageShell"

const CONTACT_EMAIL = "codewithmunna513@gmail.com"

const channels = [
  { icon: Mail, label: "Email", value: CONTACT_EMAIL, href: `mailto:${CONTACT_EMAIL}` },
  { icon: Globe, label: "Website", value: "codewithmunnax.com", href: "https://codewithmunnax.com" },
  { icon: Code2, label: "GitHub", value: "@CodeWithMunnaX", href: "https://github.com/CodeWithMunnaX" },
  { icon: MapPin, label: "Location", value: "India · Remote", href: undefined },
]

export default function ContactPage() {
  const [form, setForm] = useState({ name: "", email: "", subject: "General question", message: "" })

  // No backend mail service: open the visitor's email app with the message pre-filled
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const body = `${form.message}\n\n— ${form.name} (${form.email})`
    window.location.href = `mailto:${CONTACT_EMAIL}?subject=${encodeURIComponent(`[Voxa] ${form.subject}`)}&body=${encodeURIComponent(body)}`
  }

  const update = (key: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) =>
    setForm((f) => ({ ...f, [key]: e.target.value }))

  const inputClass =
    "w-full h-12 px-4 rounded-xl bg-white border border-input text-foreground placeholder:text-muted-foreground/70 focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary"

  return (
    <PageShell
      eyebrow="Contact"
      title="Get in touch"
      description="Questions, feedback, collaboration or a bug to report — we usually reply within a day."
    >
      <div className="grid lg:grid-cols-5 gap-8">
        <form onSubmit={handleSubmit} className="lg:col-span-3 bg-card border border-border rounded-2xl p-6 sm:p-8 shadow-sm space-y-5">
          <div className="grid sm:grid-cols-2 gap-5">
            <label className="block">
              <span className="block mb-1.5 text-sm font-medium text-foreground">Name</span>
              <input required value={form.name} onChange={update("name")} placeholder="Your name" className={inputClass} />
            </label>
            <label className="block">
              <span className="block mb-1.5 text-sm font-medium text-foreground">Email</span>
              <input required type="email" value={form.email} onChange={update("email")} placeholder="you@example.com" className={inputClass} />
            </label>
          </div>
          <label className="block">
            <span className="block mb-1.5 text-sm font-medium text-foreground">Subject</span>
            <select value={form.subject} onChange={update("subject")} className={inputClass}>
              <option>General question</option>
              <option>Feedback</option>
              <option>Bug report</option>
              <option>Team plan</option>
              <option>Collaboration</option>
            </select>
          </label>
          <label className="block">
            <span className="block mb-1.5 text-sm font-medium text-foreground">Message</span>
            <textarea
              required
              rows={6}
              value={form.message}
              onChange={update("message")}
              placeholder="How can we help?"
              className={`${inputClass} h-auto py-3 resize-none`}
            />
          </label>
          <button
            type="submit"
            className="inline-flex items-center gap-2 h-12 px-6 rounded-xl bg-primary text-primary-foreground font-semibold hover:bg-primary/90 shadow-[0_4px_24px_-8px_rgba(124,92,255,0.5)]"
          >
            <Send className="h-4 w-4" /> Send message
          </button>
          <p className="text-xs text-muted-foreground">This opens your email app with the message ready to send.</p>
        </form>

        <aside className="lg:col-span-2 space-y-4">
          {channels.map((c) => {
            const content = (
              <>
                <span className="h-11 w-11 shrink-0 rounded-xl bg-secondary text-primary flex items-center justify-center">
                  <c.icon className="h-5 w-5" />
                </span>
                <span>
                  <span className="block text-xs text-muted-foreground">{c.label}</span>
                  <span className="block font-semibold text-foreground break-all">{c.value}</span>
                </span>
              </>
            )
            return c.href ? (
              <a
                key={c.label}
                href={c.href}
                target={c.href.startsWith("http") ? "_blank" : undefined}
                rel="noopener noreferrer"
                className="flex items-center gap-4 bg-card border border-border rounded-2xl p-5 shadow-sm hover:border-primary/40 transition-colors"
              >
                {content}
              </a>
            ) : (
              <div key={c.label} className="flex items-center gap-4 bg-card border border-border rounded-2xl p-5 shadow-sm">
                {content}
              </div>
            )
          })}
        </aside>
      </div>
    </PageShell>
  )
}
