import Link from "next/link"
import { MessageSquare, Mic, GraduationCap, FileText, Presentation, NotebookPen, Users, FolderOpen, KeyRound } from "lucide-react"
import { PageShell } from "@/components/landing/PageShell"

export const metadata = {
  title: "Docs · Voxa AI",
  description: "Get started with Voxa AI: chat, voice, AI tutor, documents, notes, presentations and mock interviews.",
}

const steps = [
  { title: "Create an account", body: "Sign up with your name, email and a password — or use the demo account to explore with sample data." },
  { title: "Open the dashboard", body: "The dashboard shows your recent chats and documents, weekly usage and shortcuts to every tool." },
  { title: "Pick a tool", body: "Start a chat, upload a PDF, open the AI tutor or generate notes. Everything you create is saved to your workspace." },
]

const guides = [
  { icon: MessageSquare, title: "AI Chat", href: "/chat/ai-chat", body: "Ask anything. Conversations keep context, support Markdown and code blocks, and are saved to History. Organise chats into folders." },
  { icon: Mic, title: "Voice Assistant", href: "/chat/voice", body: "Speak your question and hear the answer read back. Uses your browser's speech recognition, so allow microphone access." },
  { icon: GraduationCap, title: "AI Tutor", href: "/chat/tutor", body: "Choose a subject and learn step by step. The tutor explains, gives examples and checks your understanding." },
  { icon: FileText, title: "Doc Analyzer", href: "/chat/docs", body: "Upload a PDF, DOCX or TXT file. Voxa extracts the text and answers questions grounded in your document." },
  { icon: NotebookPen, title: "AI Notes", href: "/chat/notes", body: "Pick a subject, enter a topic and get structured study notes you can save and revisit." },
  { icon: Presentation, title: "Presentations", href: "/chat/presentations", body: "Enter a topic and get a slide deck outline with titles and bullet points, ready to present." },
  { icon: Users, title: "Mock Interview", href: "/chat/interview", body: "Practise interviews for a role and level. Answer each question and get feedback on clarity and content." },
  { icon: FolderOpen, title: "My Files", href: "/chat/files", body: "All uploaded documents and images in one place, with previews and downloads." },
]

const faqs = [
  { q: "Which AI model does Voxa use?", a: "Voxa talks to models through an OpenAI-compatible API. The hosted version uses Google Gemini, with automatic fallback between models when one is busy." },
  { q: "Is my data private?", a: "Your chats, notes and documents are linked to your account and only returned to you when you're signed in. Passwords are stored as bcrypt hashes." },
  { q: "Why is the first request slow?", a: "The backend runs on a free hosting tier that sleeps when idle. The first request after a quiet period can take up to a minute while it wakes up." },
  { q: "What file types can I upload?", a: "PDF, DOCX and TXT for document analysis, and common image formats for the image tools." },
]

export default function DocsPage() {
  return (
    <PageShell
      eyebrow="Documentation"
      title="Get started with Voxa AI"
      description="Everything you need to know to learn, research and practise faster with Voxa."
    >
      <section className="mb-16">
        <h2 className="text-2xl font-bold text-foreground mb-6">Quick start</h2>
        <ol className="grid md:grid-cols-3 gap-4">
          {steps.map((s, i) => (
            <li key={s.title} className="bg-card border border-border rounded-2xl p-6 shadow-sm">
              <span className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-primary text-primary-foreground text-sm font-bold">
                {i + 1}
              </span>
              <h3 className="mt-4 font-semibold text-foreground">{s.title}</h3>
              <p className="mt-2 text-sm text-muted-foreground">{s.body}</p>
            </li>
          ))}
        </ol>
      </section>

      <section className="mb-16">
        <h2 className="text-2xl font-bold text-foreground mb-6">Feature guides</h2>
        <div className="grid sm:grid-cols-2 gap-4">
          {guides.map((g) => (
            <Link
              key={g.title}
              href={g.href}
              className="group flex gap-4 bg-card border border-border rounded-2xl p-6 shadow-sm hover:border-primary/40 transition-colors"
            >
              <span className="h-11 w-11 shrink-0 rounded-xl bg-secondary text-primary flex items-center justify-center">
                <g.icon className="h-5 w-5" />
              </span>
              <span>
                <span className="block font-semibold text-foreground group-hover:text-primary transition-colors">{g.title}</span>
                <span className="block mt-1 text-sm text-muted-foreground">{g.body}</span>
              </span>
            </Link>
          ))}
        </div>
      </section>

      <section className="mb-16">
        <h2 className="text-2xl font-bold text-foreground mb-6 flex items-center gap-2">
          <KeyRound className="h-6 w-6 text-primary" /> API
        </h2>
        <div className="bg-card border border-border rounded-2xl p-6 shadow-sm">
          <p className="text-sm text-muted-foreground">
            The backend is a FastAPI service. Authenticate with <code className="px-1.5 py-0.5 rounded bg-muted text-foreground text-xs">POST /api/auth/login</code>{" "}
            and send the returned token as <code className="px-1.5 py-0.5 rounded bg-muted text-foreground text-xs">Authorization: Bearer &lt;token&gt;</code>.
          </p>
          <pre className="mt-4 text-xs leading-relaxed bg-slate-900 text-slate-100 rounded-xl p-4 overflow-x-auto">
{`curl -X POST $API/api/auth/login \\
  -H "Content-Type: application/json" \\
  -d '{"email": "you@example.com", "password": "••••••"}'

curl -X POST $API/api/chats/<chat_id>/messages \\
  -H "Authorization: Bearer <token>" \\
  -H "Content-Type: application/json" \\
  -d '{"message": "Explain overfitting in one sentence."}'`}
          </pre>
        </div>
      </section>

      <section id="faq" className="scroll-mt-24">
        <h2 className="text-2xl font-bold text-foreground mb-6">FAQ</h2>
        <div className="divide-y divide-border bg-card border border-border rounded-2xl shadow-sm">
          {faqs.map((f) => (
            <details key={f.q} className="group p-6">
              <summary className="cursor-pointer list-none flex justify-between items-center font-semibold text-foreground">
                {f.q}
                <span className="text-primary text-xl leading-none group-open:rotate-45 transition-transform">+</span>
              </summary>
              <p className="mt-3 text-sm text-muted-foreground">{f.a}</p>
            </details>
          ))}
        </div>
      </section>
    </PageShell>
  )
}
