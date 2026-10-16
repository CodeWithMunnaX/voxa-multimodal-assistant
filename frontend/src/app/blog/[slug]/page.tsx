import Link from "next/link"
import { notFound } from "next/navigation"
import { ArrowLeft } from "lucide-react"
import { Navbar } from "@/components/landing/Navbar"
import { Footer } from "@/components/landing/Footer"
import { blogPosts, getPost, formatDate } from "@/lib/blog-posts"

export function generateStaticParams() {
  return blogPosts.map((p) => ({ slug: p.slug }))
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const post = getPost((await params).slug)
  return post ? { title: `${post.title} · Voxa AI`, description: post.excerpt } : {}
}

export default async function BlogPostPage({ params }: { params: Promise<{ slug: string }> }) {
  const post = getPost((await params).slug)
  if (!post) notFound()

  const more = blogPosts.filter((p) => p.slug !== post.slug).slice(0, 2)

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col font-sans overflow-x-hidden">
      <Navbar />
      <main className="flex-1 pt-32 pb-24 px-6">
        <article className="max-w-3xl mx-auto">
          <Link href="/blog" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-primary">
            <ArrowLeft className="h-4 w-4" /> All articles
          </Link>
          <span className="mt-8 block w-fit px-2.5 py-0.5 text-xs font-semibold rounded-full bg-secondary text-primary">{post.tag}</span>
          <h1 className="mt-4 text-3xl sm:text-5xl font-bold tracking-tight text-foreground">{post.title}</h1>
          <p className="mt-4 text-sm text-muted-foreground">
            {formatDate(post.date)} · {post.readTime} · Voxa Team
          </p>
          <div className="mt-10 space-y-5 text-lg leading-relaxed text-foreground/85">
            {post.body.map((para, i) => (
              <p key={i}>{para}</p>
            ))}
          </div>

          <div className="mt-16 p-8 rounded-2xl bg-card border border-border shadow-sm text-center">
            <h2 className="text-xl font-bold text-foreground">Try it yourself</h2>
            <p className="mt-2 text-muted-foreground">Open the demo workspace — no sign-up needed.</p>
            <Link
              href="/auth"
              className="mt-5 inline-flex h-11 items-center px-6 rounded-xl bg-primary text-primary-foreground font-semibold hover:bg-primary/90"
            >
              Get started
            </Link>
          </div>

          <div className="mt-16">
            <h2 className="text-lg font-semibold text-foreground mb-4">Keep reading</h2>
            <div className="grid sm:grid-cols-2 gap-4">
              {more.map((p) => (
                <Link key={p.slug} href={`/blog/${p.slug}`} className="bg-card border border-border rounded-2xl p-5 hover:border-primary/40 transition-colors">
                  <p className="font-semibold text-foreground">{p.title}</p>
                  <p className="mt-1 text-xs text-muted-foreground">{p.readTime}</p>
                </Link>
              ))}
            </div>
          </div>
        </article>
      </main>
      <Footer />
    </div>
  )
}
