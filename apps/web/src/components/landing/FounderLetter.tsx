"use client";

import { motion } from "framer-motion";

export default function FounderLetter() {
  return (
    <section className="py-32 px-6 bg-[#050505] border-t border-b border-white/5">
      <div className="max-w-3xl mx-auto">
        
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="space-y-12"
        >
          <h2 className="text-3xl md:text-4xl font-semibold text-white/90 tracking-tight">
            Why I Built This
          </h2>

          <div className="space-y-8 text-lg md:text-xl text-white/50 font-light leading-relaxed">
            <p>
              I failed twice trying to build something meaningful. 
            </p>
            <p>
              Both times, I built highly complex SaaS dashboards. I spent months perfecting the navigation, the analytics, the forms. And both times, I realized the core problem wasn't the tools. The problem was that <strong className="text-white/80 font-normal">humans were still doing the digital work.</strong>
            </p>
            <p>
              We don't need faster tools. We don't need better organized lists of tasks.
            </p>
            <p>
              We need execution. 
            </p>
            <p>
              I became obsessed with the edge of AI capabilities. I realized we are at an inflection point where software can transcend being a passive canvas and become an active participant. 
            </p>
            <p className="text-xl md:text-2xl text-white/80 font-medium pt-4">
              "This is my third attempt. This time, I am not building a product. I am building a system."
            </p>
            <p>
              NeuroFlow acts as the translation layer between your raw intent and the digital universe. It removes the 10 steps of friction between thinking of a task and seeing it completed.
            </p>
            
            <div className="pt-12 pb-4">
              <p className="text-white/90 font-medium">Abhishek Jaiswal</p>
              <p className="text-sm text-white/40 uppercase tracking-widest mt-1">Founder, NeuroFlow AI</p>
            </div>
          </div>
        </motion.div>

      </div>
    </section>
  );
}
