import { Navbar } from "@/components/landing/Navbar"
import { Footer } from "@/components/landing/Footer"

/** Layout for static marketing pages (docs, blog, contact): landing navbar + page header + footer. */
export function PageShell({
  eyebrow,
  title,
  description,
  children,
}: {
  eyebrow: string
  title: string
  description: string
  children: React.ReactNode
}) {
  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col font-sans overflow-x-hidden">
      <Navbar />
      <main className="flex-1 pt-32 pb-24 px-6">
        <div className="max-w-6xl mx-auto">
          <header className="max-w-3xl mb-14">
            <span className="inline-block px-3 py-1 text-xs font-semibold rounded-full bg-secondary text-primary border border-border">
              {eyebrow}
            </span>
            <h1 className="mt-4 text-4xl sm:text-5xl font-bold tracking-tight text-foreground">{title}</h1>
            <p className="mt-4 text-lg text-muted-foreground">{description}</p>
          </header>
          {children}
        </div>
      </main>
      <Footer />
    </div>
  )
}
