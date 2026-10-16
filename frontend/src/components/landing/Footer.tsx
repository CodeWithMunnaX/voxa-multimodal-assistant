"use client";

import Link from "next/link";
import { Mic, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";

const GithubIcon = ({ className }: { className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4"/><path d="M9 18c-4.51 2-5-2-7-2"/></svg>
);

export function Footer() {
  return (
    <footer className="relative border-t border-border bg-white/60 pt-20 pb-10 overflow-hidden">
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-[1px] bg-gradient-to-r from-transparent via-violet-500/50 to-transparent" />
      
      <div className="max-w-7xl mx-auto px-6 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
          <div className="space-y-6">
            <Link href="/" className="flex items-center gap-2">
              <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-[#7C5CFF] to-[#4F8CFF] flex items-center justify-center text-white">
                <Mic className="h-4 w-4" />
              </div>
              <span className="font-bold text-xl tracking-tight text-foreground">
                Voxa <span className="text-primary">AI</span>
              </span>
            </Link>
            <p className="text-muted-foreground text-sm leading-relaxed max-w-xs">
              The premium AI productivity ecosystem. Voice, documents, and learning, unified in one intelligent workspace.
            </p>
            <div className="flex items-center gap-4">
              <a href="https://github.com/CodeWithMunnaX" target="_blank" rel="noopener noreferrer" aria-label="GitHub" className="h-10 w-10 rounded-full bg-card border border-border flex items-center justify-center text-muted-foreground hover:text-primary hover:bg-secondary transition-colors">
                <GithubIcon className="h-4 w-4" />
              </a>
            </div>
          </div>

          <div>
            <h4 className="font-semibold text-foreground mb-6">Product</h4>
            <ul className="space-y-4 text-sm text-muted-foreground">
              <li><Link href="/#features" className="hover:text-primary transition-colors">Features</Link></li>
              <li><Link href="/chat/voice" className="hover:text-primary transition-colors">Voice Assistant</Link></li>
              <li><Link href="/chat/docs" className="hover:text-primary transition-colors">Document Analyzer</Link></li>
              <li><Link href="/chat/tutor" className="hover:text-primary transition-colors">AI Tutor</Link></li>
              <li><Link href="/#pricing" className="hover:text-primary transition-colors">Pricing</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold text-foreground mb-6">Resources</h4>
            <ul className="space-y-4 text-sm text-muted-foreground">
              <li><Link href="/docs" className="hover:text-primary transition-colors">Documentation</Link></li>
              <li><Link href="/blog" className="hover:text-primary transition-colors">Blog</Link></li>
              <li><Link href="/docs#faq" className="hover:text-primary transition-colors">FAQ</Link></li>
              <li><Link href="/contact" className="hover:text-primary transition-colors">Contact</Link></li>
              <li><a href="https://voxa-api-wvlu.onrender.com/docs" target="_blank" rel="noopener noreferrer" className="hover:text-primary transition-colors">API Reference</a></li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold text-foreground mb-6">Stay Updated</h4>
            <p className="text-muted-foreground text-sm mb-4">Subscribe to our newsletter for the latest AI features.</p>
            <div className="flex items-center gap-2">
              <input 
                type="email" 
                placeholder="Enter your email" 
                className="bg-white border border-input rounded-xl px-4 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary w-full"
              />
              <Button size="icon" className="bg-primary text-primary-foreground hover:bg-primary/90 rounded-xl shrink-0">
                <ArrowRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>

        <div className="border-t border-border pt-8 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-muted-foreground text-sm">
            © {new Date().getFullYear()} Voxa AI. All rights reserved.
          </p>
          <p className="text-sm text-muted-foreground">
            Built by{" "}
            <a href="https://codewithmunnax.com" target="_blank" rel="noopener noreferrer" className="font-semibold text-primary hover:text-primary/80">
              CodeWithMunnaX
            </a>
          </p>
        </div>
      </div>
    </footer>
  );
}
