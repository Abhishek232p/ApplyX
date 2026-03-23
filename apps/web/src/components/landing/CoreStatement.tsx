"use client";

import { motion } from "framer-motion";

export default function CoreStatement() {
  return (
    <section className="py-48 px-6 bg-[#050505] relative flex flex-col items-center justify-center min-h-[80vh]">
      
      {/* Massive Glowing Aura */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-purple-900/10 blur-[150px] rounded-full pointer-events-none" />

      <div className="max-w-5xl mx-auto text-center relative z-10 space-y-16">
        
        <motion.div
           initial={{ opacity: 0, scale: 0.95 }}
           whileInView={{ opacity: 1, scale: 1 }}
           viewport={{ once: true, margin: "-100px" }}
           transition={{ duration: 0.8 }}
        >
           <h2 className="text-5xl md:text-8xl font-bold tracking-tighter text-white leading-[1.1]">
             NeuroFlow is <span className="text-white/20 line-through decoration-red-500/50">not a tool.</span>
           </h2>
        </motion.div>

        <motion.div
           initial={{ opacity: 0, y: 30 }}
           whileInView={{ opacity: 1, y: 0 }}
           viewport={{ once: true, margin: "-100px" }}
           transition={{ delay: 0.2, duration: 0.8 }}
           className="space-y-6"
        >
           <p className="text-4xl md:text-6xl font-semibold tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-white via-white to-white/40 leading-tight">
             It is an execution system.<br/>
             A replacement for digital work.<br/>
             A new layer between humans and software.
           </p>
        </motion.div>

        <motion.div
           initial={{ opacity: 0, y: 30 }}
           whileInView={{ opacity: 1, y: 0 }}
           viewport={{ once: true, margin: "-100px" }}
           transition={{ delay: 0.4, duration: 0.8 }}
           className="inline-block"
        >
           <div className="bg-[#7C3AED]/10 border border-[#7C3AED]/30 px-8 py-6 rounded-3xl backdrop-blur-sm shadow-[0_0_40px_-10px_rgba(124,58,237,0.3)]">
              <h3 className="text-2xl md:text-4xl font-bold text-white tracking-tight">
                 You should <span className="text-[#7C3AED]">not manage tasks.</span><br/>
                 The system should <span className="text-emerald-400">manage outcomes.</span>
              </h3>
           </div>
        </motion.div>

      </div>
    </section>
  );
}
