"use client";

import { motion, useInView, AnimatePresence } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import { CheckCircle2, CircleDashed, Loader2, Play, Sparkles } from "lucide-react";

export default function LiveSimulation() {
  const containerRef = useRef(null);
  const isInView = useInView(containerRef, { once: true, margin: "-100px" });
  
  const [input, setInput] = useState("Generate a 3-sentence elevator pitch for NeuroFlow AI");
  const [isExecuting, setIsExecuting] = useState(false);
  const [actions, setActions] = useState<{id: number, text: string, status: 'pending'|'active'|'done'}[]>([]);
  const [finalResult, setFinalResult] = useState<string | null>(null);

  const triggerLiveExecution = async () => {
    if (!input.trim() || isExecuting) return;
    
    setIsExecuting(true);
    setFinalResult(null);
    setActions([
        { id: 1, text: "Connecting to NeuroFlow API...", status: "active" },
        { id: 2, text: "Parsing Intent via Gemini 2.5", status: "pending" },
        { id: 3, text: "Executing Plan", status: "pending" }
    ]);

    try {
      const res = await fetch("/api/runNeuroFlow", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ input, context: { page: "landing_demo" } })
      });
      
      setActions(prev => [
          { id: 1, text: "NeuroFlow API Connected", status: "done" },
          { id: 2, text: "Intent Parsed Successfully", status: "active" },
          { id: 3, text: "Executing Plan", status: "pending" }
      ]);
      
      const data = await res.json();
      
      setTimeout(() => {
          if (data.success) {
            setActions([
                { id: 1, text: "NeuroFlow API Connected", status: "done" },
                { id: 2, text: `Intent Parsed: ${data.intent.action}`, status: "done" },
                { id: 3, text: `Execution Output Generated`, status: "done" }
            ]);
            
            const streamMsg = data.data?.actions?.find((a: any) => a.type === "stream")?.message;
            setFinalResult(streamMsg || `Action Executed: ${data.intent.action}`);
          } else {
            setActions(prev => prev.map(a => a.id === 3 ? { ...a, text: `Execution Failed: ${data.error}`, status: "done" } : { ...a, status: "done" }));
          }
          setIsExecuting(false);
      }, 1000);
      
    } catch (e) {
      setActions(prev => prev.map(a => ({ ...a, status: "done", text: "Network Error" })));
      setIsExecuting(false);
    }
  };

  return (
    <section ref={containerRef} className="py-32 px-6 flex flex-col items-center justify-center border-t border-white/5">
      <div className="max-w-3xl w-full">
        
        <div className="text-center mb-12">
           <h2 className="text-3xl font-bold text-white mb-4 flex items-center justify-center gap-3">
             <Sparkles className="text-[#7C3AED]" /> 
             Live Architecture Demo
           </h2>
           <p className="text-white/40">This is not a mock. Type a command below to ping the real NeuroFlow Engine.</p>
        </div>

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
              <div className="flex items-center gap-3">
                  <input 
                    suppressHydrationWarning
                    type="text" 
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    disabled={isExecuting}
                    className="flex-grow bg-black/50 border border-white/10 rounded-xl p-4 text-white/90 focus:outline-none focus:border-[#7C3AED]/50 transition-colors"
                  />
                  <button 
                    suppressHydrationWarning
                    onClick={triggerLiveExecution}
                    disabled={isExecuting || !input.trim()}
                    className="h-14 px-6 rounded-xl bg-[#7C3AED] hover:bg-[#6D28D9] disabled:opacity-50 text-white font-medium flex items-center gap-2 transition-colors"
                  >
                     {isExecuting ? <Loader2 className="animate-spin" size={18} /> : <Play size={18} fill="currentColor" />}
                     Run
                  </button>
              </div>
            </div>

            {/* Execution Stream Phase */}
            {actions.length > 0 && (
                <div className="space-y-4">
                   <div className="text-xs uppercase tracking-widest text-white/30 font-bold">Live Execution Stream</div>
                   
                   <div className="flex flex-col gap-3 font-mono text-sm md:text-base">
                     {actions.map((step) => (
                         <motion.div 
                           key={step.id}
                           initial={{ opacity: 0, x: -10 }}
                           animate={{ opacity: 1, x: 0 }}
                           className={`flex items-center gap-3 ${step.status === 'done' ? 'text-white/60' : step.status === 'active' ? 'text-[#7C3AED] glow-text' : 'text-white/20'}`}
                         >
                           {step.status === 'done' ? (
                             <CheckCircle2 size={18} className="text-emerald-500" />
                           ) : step.status === 'active' ? (
                             <Loader2 size={18} className="animate-spin" />
                           ) : (
                             <CircleDashed size={18} />
                           )}
                           <span>{step.text}</span>
                         </motion.div>
                     ))}
                   </div>
                </div>
            )}

            {/* Final Output Phase */}
            <AnimatePresence>
              {finalResult && (
                <motion.div 
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="mt-4 pt-6 border-t border-white/10"
                >
                  <div className="bg-emerald-500/5 border border-emerald-500/20 rounded-xl p-5 backdrop-blur-sm">
                    <p className="text-emerald-400 font-medium whitespace-pre-wrap">{finalResult}</p>
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
