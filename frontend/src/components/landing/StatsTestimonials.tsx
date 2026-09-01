"use client";

import { motion } from "framer-motion";

export function StatsTestimonials() {
  const stats = [
    { value: "1M+", label: "Active Users" },
    { value: "50M+", label: "Prompts Generated" },
    { value: "99.9%", label: "Uptime SLA" },
    { value: "4.9/5", label: "Average Rating" },
  ];

  const testimonials = [
    {
      quote: "Voxa AI completely replaced my fragmented tech stack. It's like having ChatGPT, Notion, and Perplexity seamlessly integrated into one beautiful UI.",
      author: "Sarah Jenkins",
      role: "Product Designer @ TechFlow"
    },
    {
      quote: "The Voice Assistant feature is incredible. The low latency and ability to interrupt makes it feel like I'm talking to a real human assistant.",
      author: "David Chen",
      role: "Software Engineer"
    },
    {
      quote: "As a student, the AI Tutor and Document Analyzer have saved me hundreds of hours. It generates flashcards and mind maps instantly from my dense PDFs.",
      author: "Emily Rodriguez",
      role: "Medical Student"
    }
  ];

  return (
    <section className="py-24 relative z-10 px-6 border-t border-white/5 bg-background/50">
      <div className="max-w-7xl mx-auto">
        {/* Trusted By (Mock) */}
        <div className="text-center mb-24">
          <p className="text-sm font-medium text-secondary-text mb-8 tracking-widest uppercase">Trusted by forward-thinking teams</p>
          <div className="flex flex-wrap justify-center gap-12 opacity-50 grayscale">
             {/* Text fallbacks for logos to avoid missing images */}
             <span className="text-xl font-bold font-mono">ACME Corp</span>
             <span className="text-xl font-bold font-serif">Globex</span>
             <span className="text-xl font-bold font-sans">Soylent</span>
             <span className="text-xl font-bold font-mono">Initech</span>
             <span className="text-xl font-bold font-serif">Umbrella</span>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-32">
          {stats.map((stat, idx) => (
            <motion.div 
              key={idx}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.1 }}
              className="text-center"
            >
              <div className="text-4xl md:text-5xl font-extrabold text-white mb-2">{stat.value}</div>
              <div className="text-secondary-text font-medium">{stat.label}</div>
            </motion.div>
          ))}
        </div>

        {/* Testimonials */}
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-5xl font-bold tracking-tight mb-4">Loved by thousands</h2>
          <p className="text-secondary-text text-lg max-w-2xl mx-auto">Don't just take our word for it. See what our community has to say.</p>
        </div>
        
        <div className="grid md:grid-cols-3 gap-6">
          {testimonials.map((testimonial, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.1 }}
              className="glass p-8 rounded-3xl flex flex-col justify-between"
            >
              <p className="text-neutral-300 leading-relaxed mb-8">"{testimonial.quote}"</p>
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-violet-500 to-electric-blue-500 flex items-center justify-center text-white font-bold text-lg shadow-lg">
                  {testimonial.author.charAt(0)}
                </div>
                <div>
                  <div className="font-bold text-white">{testimonial.author}</div>
                  <div className="text-sm text-secondary-text">{testimonial.role}</div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
