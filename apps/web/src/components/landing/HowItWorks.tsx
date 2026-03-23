"use client";

import { motion } from "framer-motion";
import { Mic, BrainCircuit, Zap, CheckCircle } from "lucide-react";

const FLOW_STEPS = [
  { icon: Mic, title: "You Say", desc: "Speak or type your intent anywhere." },
  { icon: BrainCircuit, title: "System Understands", desc: "AI maps the required digital workflow." },
  { icon: Zap, title: "System Executes", desc: "It physically ghost-types the work." },
  { icon: CheckCircle, title: "Work Done", desc: "You review the final outcome." },
];

export default function HowItWorks() {
  return (
    <section className="py-40 px-6 bg-black">
      <div className="max-w-6xl mx-auto flex flex-col items-center">
        
        <motion.div 
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="text-center mb-24"
        >
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">Zero Friction Workflow</h2>
        </motion.div>

        <div className="flex flex-col md:flex-row items-center justify-between w-full gap-8 relative">
           
           {/* Connecting Line (Desktop) */}
           <div className="hidden md:block absolute top-[40px] left-[10%] right-[10%] h-[1px] bg-gradient-to-r from-transparent via-white/20 to-transparent" />

           {FLOW_STEPS.map((step, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ delay: i * 0.2, duration: 0.6 }}
                className="relative z-10 flex flex-col items-center text-center max-w-[200px]"
              >
                  <div className="w-20 h-20 rounded-full bg-[#111] border border-white/10 flex items-center justify-center mb-6 shadow-2xl">
                     <step.icon size={28} className="text-white/70" />
                  </div>
                  <h3 className="text-lg font-semibold text-white/90 mb-2">{step.title}</h3>
                  <p className="text-sm text-white/40 font-light">{step.desc}</p>
              </motion.div>
           ))}

        </div>
      </div>
    </section>
  );
}
