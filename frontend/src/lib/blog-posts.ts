export interface BlogPost {
  slug: string
  title: string
  excerpt: string
  date: string
  readTime: string
  tag: string
  body: string[]
}

export const blogPosts: BlogPost[] = [
  {
    slug: "study-smarter-with-ai-tutor",
    title: "How to study smarter with an AI tutor",
    excerpt: "Five habits that turn an AI chat into a real learning partner instead of an answer machine.",
    date: "2026-10-12",
    readTime: "5 min read",
    tag: "Learning",
    body: [
      "An AI tutor is most useful when you treat it like a patient teacher, not a search engine. The goal is understanding, not just a correct answer you'll forget tomorrow.",
      "1. Explain it back. After the tutor explains a concept, rephrase it in your own words and ask it to point out what you got wrong. This is the fastest way to find gaps.",
      "2. Ask for examples at your level. Add context like \"I'm a second-year CS student\" so explanations use the right vocabulary and examples.",
      "3. Practise, don't just read. Ask for three practice questions on the topic, attempt them, then ask for feedback on your answers.",
      "4. Turn sessions into notes. Use Voxa's AI Notes to convert a long chat into a structured summary you can revise later.",
      "5. Space it out. Come back to the same topic after a few days and ask the tutor to quiz you. Spaced repetition beats a single long session.",
    ],
  },
  {
    slug: "chat-with-your-pdfs",
    title: "Chat with your PDFs: getting reliable answers from documents",
    excerpt: "Upload a research paper or textbook chapter and ask questions about it. Here's how to get answers you can trust.",
    date: "2026-10-05",
    readTime: "6 min read",
    tag: "Product",
    body: [
      "Voxa's Doc Analyzer extracts the text from your PDF and lets you ask questions grounded in that document, so answers stay specific to what you uploaded.",
      "Start broad, then narrow. Ask for a one-paragraph summary first, then follow up on the sections that matter to you.",
      "Ask for evidence. Prompts like \"quote the sentence that supports this\" make it easy to verify an answer against the source.",
      "Watch for scanned PDFs. If a PDF is a scanned image, there may be little extractable text, which leads to vague answers. Text-based PDFs work best.",
      "Combine with notes. Once you understand a paper, generate notes from the conversation and keep them in a folder for the subject.",
    ],
  },
  {
    slug: "acing-mock-interviews",
    title: "Acing technical interviews with AI mock practice",
    excerpt: "Use mock interviews to practise explaining your projects and handling follow-up questions under pressure.",
    date: "2026-09-28",
    readTime: "4 min read",
    tag: "Careers",
    body: [
      "Interviews test how clearly you think out loud as much as what you know. Mock practice is where you build that skill.",
      "Pick a role and level, then answer each question as if a real interviewer were listening. Typing full answers forces you to structure your thoughts.",
      "Use the STAR format (Situation, Task, Action, Result) for behavioural questions and ask for feedback on clarity and impact.",
      "For project questions, prepare a 60-second version of each project: the problem, your approach, the result, and one thing you'd improve.",
      "Repeat the same mock a week later and compare. Seeing your answers improve is the best confidence boost before the real thing.",
    ],
  },
  {
    slug: "how-voxa-is-built",
    title: "Under the hood: how Voxa AI is built",
    excerpt: "A look at the architecture: Next.js on Vercel, FastAPI on Render, PostgreSQL on Neon and an LLM behind a single service layer.",
    date: "2026-09-20",
    readTime: "7 min read",
    tag: "Engineering",
    body: [
      "Voxa is split into a Next.js frontend and a FastAPI backend. The frontend is deployed on Vercel; the backend runs on Render and stores data in a serverless PostgreSQL database on Neon.",
      "The backend follows an MVC-style layout: controllers define the API routes, models describe the database tables with SQLAlchemy, and services wrap external providers.",
      "All AI features — chat, tutor, notes, presentations and voice — go through one AI service. It speaks the OpenAI-compatible chat API, so it can use OpenAI or Google Gemini by changing configuration, with automatic fallback when a model is busy.",
      "Authentication uses bcrypt-hashed passwords and short-lived JWT access tokens. Rate limiting with SlowAPI protects the public endpoints.",
      "Keeping providers behind a single service layer made it easy to switch models without touching any feature code.",
    ],
  },
]

export function getPost(slug: string): BlogPost | undefined {
  return blogPosts.find((p) => p.slug === slug)
}

export function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })
}
