"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Sparkles, ArrowRight, Mic } from "lucide-react";
import { Button } from "@/components/ui/button";

export function Hero() {
  return (
    <section className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden pt-32 pb-20 px-6 bg-background">
      {/* Background matching Auth Page */}
      <div className="absolute inset-0 z-0">
        <div className="absolute inset-0 bg-white/40 z-10" />
        <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent z-10" />
        <div className="absolute inset-0 bg-gradient-to-b from-secondary/50 to-transparent z-10" />
        <motion.img 
          initial={{ opacity: 0, scale: 1.05 }}
          animate={{ opacity: 0.15, scale: 1 }}
          transition={{ duration: 1.5, ease: "easeOut" }}
          src="/auth-hero.png" 
          alt="Voxa AI Background" 
          className="w-full h-full object-cover"
        />
        <div className="absolute w-[500px] h-[500px] rounded-full blur-[120px] pointer-events-none z-10 top-1/4 left-1/4 bg-[#7C5CFF]/15" />
        <div className="absolute w-[600px] h-[600px] rounded-full blur-[150px] pointer-events-none z-10 bottom-1/4 right-1/4 bg-[#4F8CFF]/15" />
      </div>

      <div className="relative z-20 text-center space-y-8 max-w-5xl mx-auto mt-10">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="inline-flex items-center gap-2 px-5 py-2 rounded-full glass text-sm font-medium text-foreground shadow-[0_4px_24px_-8px_rgba(124,92,255,0.15)]"
        >
          <Sparkles className="h-4 w-4 text-primary" />
          <span>The Future of Intelligence</span>
        </motion.div>

        <motion.h1 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="text-6xl sm:text-7xl lg:text-8xl font-extrabold tracking-tighter leading-[1.05] drop-shadow-sm text-foreground"
        >
          VOXA AI <br className="hidden sm:block"/>
          <span className="text-gradient">THE ULTIMATE AI AGENT</span>
        </motion.h1>
        
        <motion.p 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="text-xl sm:text-2xl text-muted-foreground max-w-3xl mx-auto leading-relaxed font-medium"
        >
          Your intelligent workspace. Seamlessly blending voice, documents, and learning into one autonomous AI experience.
        </motion.p>
        
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="flex flex-col sm:flex-row justify-center items-center gap-4 pt-4"
        >
          <Link href="/auth">
            <Button size="lg" className="bg-primary text-primary-foreground hover:bg-primary/90 font-semibold px-8 h-14 rounded-2xl text-lg shadow-[0_8px_24px_-8px_rgba(124,92,255,0.5)] hover:shadow-[0_10px_32px_-8px_rgba(124,92,255,0.6)] transition-all hover-lift group">
              Start Free
              <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
            </Button>
          </Link>
          <Link href="#demo">
            <Button size="lg" variant="outline" className="text-foreground border-border bg-white/70 hover:bg-muted h-14 rounded-2xl text-lg px-8 backdrop-blur-md transition-all hover-lift">
              Watch Demo
            </Button>
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
