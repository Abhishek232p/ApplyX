"use client";

import { motion } from "framer-motion";
import { Mic, Eye, BrainCircuit, ListTree, Zap, ShieldCheck, CheckSquare } from "lucide-react";

const PIPELINE_STEPS = [
  { id: 1, icon: Mic, title: "1. User Input", desc: "Speak or type your intent anywhere via the Edge Extension or Web Terminal." },
  { id: 2, icon: Eye, title: "2. Context Capture", desc: "The system reads your active screen (Gmail, Notion) and retrieves your personal memory matrix." },
  { id: 3, icon: BrainCircuit, title: "3. Intent Understanding", desc: "Gemini 2.5 parses the unstructured context into a rigid JSON Action Schema." },
  { id: 4, icon: ListTree, title: "4. Execution Plan", desc: "The engine breaks the intent down into atomic, logical webhook tasks." },
  { id: 5, icon: Zap, title: "5. Parallel Execution", desc: "NeuroFlow physicalizes the workflow via n8n directly into external platforms." },
  { id: 6, icon: ShieldCheck, title: "6. Verification Engine", desc: "CRITICAL: The system awaits webhook confirmation before assuming success." },
  { id: 7, icon: CheckSquare, title: "7. Result & Memory", desc: "Outcomes are aggregated, UI is updated, and the matrix learns your preference." },
];

export default function HowItWorks() {
  return (
    <section className="py-40 px-6 bg-[#050505] relative">
      <div className="max-w-4xl mx-auto flex flex-col items-center">
        
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-24"
        >
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6 tracking-tight">The 7-Step Execution Loop</h2>
          <p className="text-xl text-[#888] font-light max-w-2xl mx-auto">
             NeuroFlow is a self-verifying execution system. Here is exactly how we route your intent directly into external action.
          </p>
        </motion.div>

        <div className="flex flex-col w-full relative">
           {/* Center Vertical Line */}
           <div className="absolute top-[40px] bottom-[40px] left-[28px] md:left-1/2 w-[2px] bg-white/10 -translate-x-1/2" />

           {PIPELINE_STEPS.map((step, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ duration: 0.6 }}
                className={`relative z-10 flex flex-col md:flex-row items-start md:items-center w-full mb-16 last:mb-0 ${i % 2 === 0 ? 'md:flex-row-reverse' : ''}`}
              >
                  {/* Timeline Dot & Icon */}
                  <div className="absolute left-[28px] md:left-1/2 -translate-x-1/2 w-14 h-14 rounded-full bg-[#111] border border-[#7C3AED]/50 flex items-center justify-center shadow-[0_0_20px_-5px_rgba(124,58,237,0.5)] z-20">
                     <step.icon size={22} className="text-[#7C3AED]" />
                  </div>

                  {/* Content Container */}
                  <div className={`w-full md:w-1/2 pl-24 md:pl-0 ${i % 2 === 0 ? 'md:pr-16 text-left md:text-right' : 'md:pl-16 text-left'}`}>
                      <div className="bg-[#111] border border-white/5 rounded-2xl p-8 hover:bg-white/[0.02] transition-colors relative group overflow-hidden">
                          <div className="absolute inset-0 bg-gradient-to-r from-[#7C3AED]/0 to-[#7C3AED]/5 opacity-0 group-hover:opacity-100 transition-opacity" />
                          <h3 className="text-xl font-semibold text-white/90 mb-3 relative z-10">{step.title}</h3>
                          <p className="text-[#888] font-light leading-relaxed relative z-10">{step.desc}</p>
                      </div>
                  </div>
              </motion.div>
           ))}

        </div>
      </div>
    </section>
  );
}
