"use client";

import { motion } from "framer-motion";

const STATEMENTS = [
  { title: "Not a chatbot.", desc: "There are no conversational bubbles. You don't talk to it to learn; you talk to it to get things done." },
  { title: "Not a tool.", desc: "Tools require you to manage the inputs and outputs. NeuroFlow flips the paradigm: you manage intent, the system manages outcomes." },
  { title: "Not automation.", desc: "Automations are rigid if-then rules built for static software. NeuroFlow acts dynamically, understanding context like a human." }
];

export default function CoreStatement() {
  return (
    <section className="py-32 px-6 bg-[#0A0A0B] relative">
      <div className="max-w-5xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-24">
          {STATEMENTS.map((s, i) => (
             <motion.div
               key={i}
               initial={{ opacity: 0, y: 20 }}
               whileInView={{ opacity: 1, y: 0 }}
               viewport={{ once: true, margin: "-100px" }}
               transition={{ delay: i * 0.2, duration: 0.8 }}
               className="p-8 rounded-2xl bg-white/[0.02] border border-white/[0.05] hover:bg-white/[0.04] transition-colors"
             >
                <h3 className="text-xl font-semibold text-white/90 mb-3">{s.title}</h3>
                <p className="text-white/40 leading-relaxed font-light">{s.desc}</p>
             </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 1 }}
          className="text-center"
        >
          <h2 className="text-5xl md:text-7xl font-bold tracking-tight text-white mb-6">
            This is <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#7C3AED] to-[#3b82f6]">execution.</span>
          </h2>
          <p className="text-xl text-white/40 font-light">The new operating layer between humans and software.</p>
        </motion.div>
      </div>
    </section>
  );
}
