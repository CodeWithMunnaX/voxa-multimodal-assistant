import Link from "next/link"
import { ArrowRight } from "lucide-react"
import { PageShell } from "@/components/landing/PageShell"
import { blogPosts, formatDate } from "@/lib/blog-posts"

export const metadata = {
  title: "Blog · Voxa AI",
  description: "Guides on learning with AI, product updates and engineering notes from the Voxa team.",
}

export default function BlogPage() {
  const [featured, ...rest] = blogPosts
  return (
    <PageShell
      eyebrow="Blog"
      title="Ideas, guides & updates"
      description="Practical guides on learning with AI, product walkthroughs and how Voxa is built."
    >
      <Link
        href={`/blog/${featured.slug}`}
        className="group block mb-10 p-8 sm:p-10 rounded-[28px] bg-gradient-to-br from-[#7C5CFF] to-[#4F8CFF] text-white shadow-[0_12px_40px_-12px_rgba(124,92,255,0.6)]"
      >
        <span className="text-xs font-semibold uppercase tracking-wide text-white/80">
          Featured · {featured.tag}
        </span>
        <h2 className="mt-3 text-2xl sm:text-3xl font-bold">{featured.title}</h2>
        <p className="mt-3 max-w-2xl text-white/85">{featured.excerpt}</p>
        <span className="mt-6 inline-flex items-center gap-2 text-sm font-semibold">
          Read article <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
        </span>
      </Link>

      <div className="grid md:grid-cols-3 gap-6">
        {rest.map((post) => (
          <Link
            key={post.slug}
            href={`/blog/${post.slug}`}
            className="group flex flex-col bg-card border border-border rounded-2xl p-6 shadow-sm hover:border-primary/40 transition-colors"
          >
            <span className="self-start px-2.5 py-0.5 text-xs font-semibold rounded-full bg-secondary text-primary">{post.tag}</span>
            <h3 className="mt-4 text-lg font-semibold text-foreground group-hover:text-primary transition-colors">{post.title}</h3>
            <p className="mt-2 text-sm text-muted-foreground flex-1">{post.excerpt}</p>
            <p className="mt-6 text-xs text-muted-foreground">
              {formatDate(post.date)} · {post.readTime}
            </p>
          </Link>
        ))}
      </div>
    </PageShell>
  )
}
