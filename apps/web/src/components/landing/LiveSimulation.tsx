"use client";

import { motion, useInView, AnimatePresence } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import { CheckCircle2, CircleDashed, Loader2 } from "lucide-react";

const SIMULATION_STEPS = [
  { id: 1, text: "Understanding intent", delay: 1000 },
  { id: 2, text: "Fetching contacts from CRM", delay: 2500 },
  { id: 3, text: "Writing personalized email", delay: 4500 },
  { id: 4, text: "Sending to 14 investors", delay: 6500 },
];

export default function LiveSimulation() {
  const containerRef = useRef(null);
  const isInView = useInView(containerRef, { once: true, margin: "-100px" });
  
  const [activeStep, setActiveStep] = useState(0);
  const [isComplete, setIsComplete] = useState(false);

  useEffect(() => {
    if (!isInView) return;

    let timeouts: NodeJS.Timeout[] = [];
    
    SIMULATION_STEPS.forEach((step, index) => {
      const t = setTimeout(() => {
        setActiveStep(step.id);
        if (index === SIMULATION_STEPS.length - 1) {
          setTimeout(() => setIsComplete(true), 1500);
        }
      }, step.delay);
      timeouts.push(t);
    });

    return () => timeouts.forEach(clearTimeout);
  }, [isInView]);

  return (
    <section ref={containerRef} className="py-32 px-6 flex flex-col items-center justify-center border-t border-white/5">
      <div className="max-w-3xl w-full">
        
        <motion.div 
          initial={{ opacity: 0, filter: "blur(10px)" }}
          animate={isInView ? { opacity: 1, filter: "blur(0px)" } : {}}
          transition={{ duration: 1 }}
          className="relative bg-[#111] border border-white/10 rounded-3xl p-8 md:p-12 shadow-2xl overflow-hidden"
        >
          {/* Animated Matrix Background */}
          <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:40px_40px] [mask-image:radial-gradient(ellipse_60%_60%_at_50%_0%,#000_70%,transparent_100%)] pointer-events-none" />
          
          <div className="relative z-10 flex flex-col gap-10">
            {/* Input Phase */}
            <div className="space-y-3">
              <div className="text-xs uppercase tracking-widest text-[#7C3AED] font-bold">User Input</div>
              <div className="bg-black/50 border border-white/5 rounded-xl p-4 flex items-center gap-3 w-fit">
                 <div className="w-2 h-2 rounded-full bg-[#7C3AED] animate-pulse" />
                 <span className="text-lg md:text-xl font-medium text-white/90">"Send update to investors"</span>
              </div>
            </div>

            {/* Execution Stream Phase */}
            <div className="space-y-4">
               <div className="text-xs uppercase tracking-widest text-white/30 font-bold">System Execution</div>
               
               <div className="flex flex-col gap-3 font-mono text-sm md:text-base">
                 {SIMULATION_STEPS.map((step) => {
                   const isPast = activeStep > step.id || isComplete;
                   const isCurrent = activeStep === step.id && !isComplete;
                   const isFuture = activeStep < step.id && !isComplete;

                   if (isFuture && step.id > activeStep + 1) return null; // reveal sequentially

                   return (
                     <motion.div 
                       key={step.id}
                       initial={{ opacity: 0, x: -10 }}
                       animate={{ opacity: 1, x: 0 }}
                       className={`flex items-center gap-3 ${isPast ? 'text-white/60' : isCurrent ? 'text-[#7C3AED] glow-text' : 'text-white/20'}`}
                     >
                       {isPast ? (
                         <CheckCircle2 size={18} className="text-emerald-500" />
                       ) : isCurrent ? (
                         <Loader2 size={18} className="animate-spin" />
                       ) : (
                         <CircleDashed size={18} />
                       )}
                       <span>{step.text}</span>
                     </motion.div>
                   );
                 })}
               </div>
            </div>

            {/* Final Output Phase */}
            <AnimatePresence>
              {isComplete && (
                <motion.div 
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="mt-4 pt-6 border-t border-white/10"
                >
                  <div className="bg-emerald-500/10 border border-emerald-500/20 rounded-xl p-5 backdrop-blur-sm">
                    <p className="text-emerald-400 font-medium font-mono">Process Complete: Update sent to 14 investors.</p>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

          </div>
        </motion.div>
      </div>
    </section>
  );
}
