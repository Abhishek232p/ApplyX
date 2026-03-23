"use client";

import { useState } from "react";
import WisprInput from "@/components/AdaptiveInput";
import WisprExecutionStream, { ExecutionAction } from "@/components/ExecutionStream";
import { motion, AnimatePresence } from "framer-motion";
import { Sparkles, Terminal, Database, ShieldCheck, ArrowRightLeft } from "lucide-react";

interface OutputMessage {
  id: string;
  role: "user" | "neuroflow";
  content: string;
  telemetry?: any;
}

export default function VirtualSandbox() {
  const [status, setStatus] = useState<"idle" | "processing" | "complete">("idle");
  const [actions, setActions] = useState<ExecutionAction[]>([]);
  const [outputs, setOutputs] = useState<OutputMessage[]>([]);
  const [activeTelemetry, setActiveTelemetry] = useState<any>(null);

  const handleInputSubmit = async (input: string) => {
    setStatus("processing");
    
    const messageId = Date.now().toString();
    setOutputs(prev => [...prev, { id: `user-${messageId}`, role: "user", content: input }]);
    setActiveTelemetry({ status: "Connecting to Edge Node...", payload: null });

    const newActions: ExecutionAction[] = [
      { id: "1", title: "Parsing intent...", status: "processing" }
    ];
    setActions(newActions);

    try {
      const res = await fetch("/api/runNeuroFlow", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ input, context: { page: "virtual_sandbox" } })
      });
      const data = await res.json();

      if (data.success) {
        newActions[0].status = "completed";
        newActions[0].title = `Intent: ${data.intent.action}`;
        setActions([...newActions]);
        
        // Expose Real-Time Telemetry
        setActiveTelemetry({
           status: "Intent Parsed & Executed",
           payload: data.intent
        });

        const streamAction = data.data?.actions?.find((a: any) => a.type === "stream");
        const msgContent = streamAction?.message || `System Action Executed: ${data.intent.action}\nTarget: ${data.intent.target || 'Background Webhook'}`;
        
        // JARVIS VOICE SYNTHESIS
        if ('speechSynthesis' in window) {
            window.speechSynthesis.cancel();
            const utterance = new SpeechSynthesisUtterance(msgContent);
            utterance.rate = 1.05;
            utterance.pitch = 0.95;
            window.speechSynthesis.speak(utterance);
        }

        setTimeout(() => {
            setOutputs(prev => [...prev, { id: `ai-${messageId}`, role: "neuroflow", content: msgContent, telemetry: data.intent }]);
            setStatus("complete");
            setTimeout(() => setStatus("idle"), 2000);
        }, 800);
      } else {
        newActions[0].status = "error";
        newActions[0].title = `Failed: ${data.error}`;
        setActiveTelemetry({ status: "Execution Failed", payload: { error: data.error } });
        setStatus("idle");
        setActions([...newActions]);
      }
    } catch (err: any) {
      newActions[0].status = "error";
      newActions[0].title = "Network Error";
      setActiveTelemetry({ status: "Network Disconnect", payload: { error: err.message } });
      setStatus("idle");
      setActions([...newActions]);
    }
  };

  return (
    <main className="min-h-screen bg-[#050505] text-[#E2E2E2] flex flex-col lg:flex-row relative overflow-hidden font-sans selection:bg-[#7C3AED]/30">
      
      {/* Dynamic Ambient Background */}
      <div className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[1000px] h-[1000px] rounded-full blur-[200px] pointer-events-none transition-all duration-1000 ${status === "processing" ? "bg-[#7C3AED]/20" : "bg-blue-900/10"}`} />

      {/* Main Conversation Feed */}
      <div className="flex-1 h-screen flex flex-col relative z-10 p-6 lg:p-12 overflow-y-auto pb-48">
         <div className="w-full max-w-3xl mx-auto flex flex-col gap-6">
            
            {outputs.length === 0 ? (
               <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="flex flex-col items-center justify-center h-[50vh] text-center space-y-4">
                  <div className="w-16 h-16 rounded-2xl bg-[#111] border border-white/10 flex items-center justify-center mb-4">
                     <Sparkles className="w-8 h-8 text-[#7C3AED]" />
                  </div>
                  <h1 className="text-3xl md:text-4xl font-light text-white tracking-tight">Virtual Execution Sandbox</h1>
                  <p className="text-[#888] text-lg max-w-xl font-light">
                     Speak or type your intent below. The panel on the right will instantly expose exactly how the AI processes, plans, and executes your command in real-time.
                  </p>
               </motion.div>
            ) : (
               <AnimatePresence>
                 {outputs.map((msg, idx) => (
                    <motion.div 
                      key={msg.id}
                      initial={{ opacity: 0, scale: 0.98, y: 10 }}
                      animate={{ opacity: 1, scale: 1, y: 0 }}
                      className={`w-full p-6 rounded-3xl ${msg.role === 'user' ? 'bg-transparent text-right self-end' : 'bg-[#111] border border-white/5 backdrop-blur-xl text-left self-start shadow-2xl'}`}
                    >
                       <p className={`text-lg leading-relaxed whitespace-pre-wrap ${msg.role === 'user' ? 'text-[#AAA] font-light' : 'text-white'}`}>
                          {msg.content}
                       </p>
                    </motion.div>
                 ))}
               </AnimatePresence>
            )}

            {status === "processing" && (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex gap-2 items-center p-6">
                   <div className="w-2 h-2 rounded-full bg-[#7C3AED] animate-bounce" style={{ animationDelay: '0ms' }} />
                   <div className="w-2 h-2 rounded-full bg-[#7C3AED] animate-bounce" style={{ animationDelay: '150ms' }} />
                   <div className="w-2 h-2 rounded-full bg-[#7C3AED] animate-bounce" style={{ animationDelay: '300ms' }} />
                </motion.div>
            )}

         </div>
      </div>

      {/* System Telemetry Glass Box (Right Side) */}
      <div className="hidden lg:flex w-[450px] h-screen bg-[#0A0A0A]/80 border-l border-white/5 backdrop-blur-3xl flex-col z-20 overflow-y-auto">
         <div className="p-6 border-b border-white/5 flex items-center justify-between sticky top-0 bg-[#0A0A0A]/90 backdrop-blur-md">
            <h3 className="text-white font-medium flex items-center gap-2">
               <Terminal size={16} className="text-[#7C3AED]" /> System Telemetry
            </h3>
            <span className="flex items-center gap-2 text-xs text-emerald-500 bg-emerald-500/10 px-2 py-1 rounded-full border border-emerald-500/20">
               <Database size={12} /> Live Engine
            </span>
         </div>

         <div className="p-6 flex-1 flex flex-col gap-6 font-mono text-sm">
            {!activeTelemetry ? (
               <div className="flex flex-col items-center justify-center h-full text-white/20 text-center gap-3">
                  <ArrowRightLeft size={32} />
                  <p>Awaiting intent stream...</p>
               </div>
            ) : (
               <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="space-y-6">
                  
                  <div className="space-y-2">
                     <p className="text-xs uppercase tracking-widest text-[#7C3AED] font-bold">Network Status</p>
                     <div className="bg-[#111] border border-white/5 rounded-xl p-3 text-white/80">
                        {activeTelemetry.status}
                     </div>
                  </div>

                  {activeTelemetry.payload && (
                     <div className="space-y-2">
                        <p className="text-xs uppercase tracking-widest text-[#7C3AED] font-bold">Cognitive Architecture (JSON)</p>
                        <div className="bg-[#111] border border-white/10 rounded-xl p-4 overflow-x-auto">
                           <pre className="text-emerald-400 text-xs leading-relaxed">
                              {JSON.stringify(activeTelemetry.payload, null, 2)}
                           </pre>
                        </div>
                     </div>
                  )}

                  {activeTelemetry.payload?.tasks?.length > 0 && (
                     <div className="space-y-2">
                        <p className="text-xs uppercase tracking-widest text-[#7C3AED] font-bold">Physical Execution (n8n)</p>
                        <div className="bg-[#7C3AED]/10 border border-[#7C3AED]/30 rounded-xl p-4 text-[#E2E2E2] flex items-start gap-3">
                           <ShieldCheck className="w-5 h-5 text-[#7C3AED] flex-shrink-0 mt-0.5" />
                           <p className="text-sm">Webhook fired. {activeTelemetry.payload.tasks.length} sub-tasks dispatched into external applications.</p>
                        </div>
                     </div>
                  )}

               </motion.div>
            )}
         </div>
      </div>

      {/* Persistent Elements */}
      <WisprInput onSubmit={handleInputSubmit} status={status} />
      <WisprExecutionStream actions={actions} />
    </main>
  );
}
