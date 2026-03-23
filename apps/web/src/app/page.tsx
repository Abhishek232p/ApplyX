"use client";

import { useState } from "react";
import WisprInput from "@/components/AdaptiveInput";
import WisprExecutionStream, { ExecutionAction } from "@/components/ExecutionStream";
import { motion, AnimatePresence } from "framer-motion";
import { Calendar, Mail, Linkedin, AppWindow, Clock, Sparkles, CheckCircle2 } from "lucide-react";

interface OutputMessage {
  id: string;
  role: "user" | "neuroflow";
  content: string;
}

export default function Home() {
  const [status, setStatus] = useState<"idle" | "processing" | "complete">("idle");
  const [actions, setActions] = useState<ExecutionAction[]>([]);
  const [outputs, setOutputs] = useState<OutputMessage[]>([]);

  const handleInputSubmit = async (input: string) => {
    setStatus("processing");
    
    // Optimistically add user message to feed
    const messageId = Date.now().toString();
    setOutputs(prev => [...prev, { id: `user-${messageId}`, role: "user", content: input }]);

    const newActions: ExecutionAction[] = [
      { id: "1", title: "Parsing intent...", status: "processing" }
    ];
    setActions(newActions);

    try {
      const res = await fetch("/api/runNeuroFlow", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ input, context: { page: "web_dashboard" } })
      });
      const data = await res.json();

      if (data.success) {
        newActions[0].status = "completed";
        newActions[0].title = `Intent: ${data.intent.action}`;
        setActions([...newActions]);
        
        const streamAction = data.data?.actions?.find((a: any) => a.type === "stream");
        
        if (streamAction && streamAction.message) {
            
            // JARVIS VOICE SYNTHESIS
            if ('speechSynthesis' in window) {
                window.speechSynthesis.cancel();
                const utterance = new SpeechSynthesisUtterance(streamAction.message);
                const voices = window.speechSynthesis.getVoices();
                const preferredVoice = voices.find(v => v.name.includes("Google UK English Male") || v.name.includes("Samantha") || v.name.includes("Daniel") || v.name.includes("Google US English")) || voices[0];
                if (preferredVoice) utterance.voice = preferredVoice;
                utterance.rate = 1.05;
                utterance.pitch = 0.95;
                window.speechSynthesis.speak(utterance);
            }

            // Typing effect for the answer
            setTimeout(() => {
                setOutputs(prev => [...prev, { id: `ai-${messageId}`, role: "neuroflow", content: streamAction.message }]);
                setStatus("complete");
                setTimeout(() => setStatus("idle"), 2000);
            }, 800);
        } else {
            // Abstract execution completed
            setTimeout(() => {
                setOutputs(prev => [...prev, { id: `ai-${messageId}`, role: "neuroflow", content: `System Action Executed: ${data.intent.action}\nTarget: ${data.intent.target || 'Background'}` }]);
                setStatus("complete");
                setTimeout(() => setStatus("idle"), 2000);
            }, 800);
        }
      } else {
        newActions[0].status = "error";
        newActions[0].title = `Failed: ${data.error}`;
        setStatus("idle");
        setActions([...newActions]);
      }
    } catch (err: any) {
      newActions[0].status = "error";
      newActions[0].title = "Network Error";
      setStatus("idle");
      setActions([...newActions]);
    }
  };

  return (
    <main className="min-h-screen bg-[#0A0A0E] text-[#E2E2E2] flex flex-col relative overflow-hidden font-sans selection:bg-purple-500/30">
      {/* Dynamic Ambient Glow based on interaction state */}
      <div 
        className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] rounded-full blur-[160px] pointer-events-none transition-all duration-1000 
        ${status === "processing" ? "bg-purple-600/10" : "bg-blue-600/5 opacity-40"}`} 
      />

      <div className="z-10 flex-grow flex flex-col items-center w-full pt-20 pb-48 px-6 overflow-y-auto">
        
        <AnimatePresence mode="wait">
          {outputs.length === 0 ? (
            <motion.div 
              key="command-center"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20, filter: "blur(10px)" }}
              transition={{ duration: 0.5 }}
              className="w-full max-w-4xl flex flex-col items-center mt-12 space-y-12"
            >
              {/* Greeting & Quick Stats */}
              <div className="text-center space-y-3">
                 <h1 className="text-4xl font-light tracking-tight text-white flex items-center justify-center gap-3">
                    <Sparkles className="w-6 h-6 text-purple-400" />
                    Good Evening, Abhishek.
                 </h1>
                 <p className="text-[#888] text-lg font-light">NeuroFlow has synchronized your workspace.</p>
              </div>

              {/* Startup Context Dashboard Bento Grid */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 w-full">
                 <div className="col-span-1 md:col-span-2 bg-white/[0.02] border border-white/[0.05] rounded-3xl p-6 backdrop-blur-xl flex flex-col justify-between hover:bg-white/[0.04] transition-colors">
                    <div className="flex items-center gap-3 mb-6">
                       <Clock className="w-5 h-5 text-blue-400" />
                       <h3 className="text-white font-medium">Today's Schedule</h3>
                    </div>
                    <div className="space-y-4">
                       <div className="flex justify-between items-center text-sm">
                          <span className="text-[#AAA]">10:00 AM — Core Team Sync</span>
                          <CheckCircle2 className="w-4 h-4 text-green-500/70" />
                       </div>
                       <div className="flex justify-between items-center text-sm">
                          <span className="text-[#AAA]">2:30 PM — Investor Pitch Deck Review</span>
                          <CheckCircle2 className="w-4 h-4 text-green-500/70" />
                       </div>
                       <div className="flex justify-between items-center text-sm">
                          <span className="text-white font-medium">6:00 PM — Architecture Planning (Upcoming)</span>
                          <span className="px-2 py-1 bg-blue-500/20 text-blue-300 rounded-full text-xs">Due in 15m</span>
                       </div>
                    </div>
                 </div>

                 <div className="bg-white/[0.02] border border-white/[0.05] rounded-3xl p-6 backdrop-blur-xl flex flex-col items-center justify-center hover:bg-white/[0.04] transition-colors group">
                    <div className="relative">
                        <div className="w-16 h-16 rounded-full bg-purple-500/10 flex items-center justify-center border border-purple-500/20 group-hover:scale-110 transition-transform">
                            <span className="text-2xl font-semibold text-purple-300">12</span>
                        </div>
                        <div className="absolute -top-1 -right-1 w-4 h-4 bg-purple-500 rounded-full border-2 border-[#0A0A0E] animate-pulse" />
                    </div>
                    <p className="text-[#888] text-sm mt-4 text-center">Unread emails parsed<br/>and summarized.</p>
                 </div>
              </div>

              {/* Integrations Dock */}
              <div className="w-full pt-8 border-t border-white/[0.05]">
                 <p className="text-xs text-[#666] uppercase tracking-widest text-center mb-6 font-semibold">Active Integrations</p>
                 <div className="flex items-center justify-center gap-6">
                    <div className="flex flex-col items-center gap-2 opacity-60 hover:opacity-100 transition-opacity cursor-pointer">
                       <div className="w-12 h-12 rounded-2xl bg-white/[0.03] border border-white/[0.1] flex items-center justify-center">
                          <Mail className="w-5 h-5" />
                       </div>
                       <span className="text-xs text-[#888]">Gmail</span>
                    </div>
                    <div className="flex flex-col items-center gap-2 opacity-60 hover:opacity-100 transition-opacity cursor-pointer">
                       <div className="w-12 h-12 rounded-2xl bg-white/[0.03] border border-white/[0.1] flex items-center justify-center">
                          <Calendar className="w-5 h-5" />
                       </div>
                       <span className="text-xs text-[#888]">Calendar</span>
                    </div>
                    <div className="flex flex-col items-center gap-2 opacity-60 hover:opacity-100 transition-opacity cursor-pointer">
                       <div className="w-12 h-12 rounded-2xl bg-white/[0.03] border border-white/[0.1] flex items-center justify-center">
                          <Linkedin className="w-5 h-5" />
                       </div>
                       <span className="text-xs text-[#888]">LinkedIn</span>
                    </div>
                    <div className="flex flex-col items-center gap-2 opacity-60 hover:opacity-100 transition-opacity cursor-pointer">
                       <div className="w-12 h-12 rounded-2xl bg-white/[0.03] border border-white/[0.1] flex items-center justify-center">
                          <AppWindow className="w-5 h-5" />
                       </div>
                       <span className="text-xs text-[#888]">System</span>
                    </div>
                 </div>
              </div>

            </motion.div>
          ) : (
            <motion.div 
              key="output-feed"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="w-full max-w-3xl flex flex-col space-y-6 mt-8"
            >
               {outputs.map((msg, idx) => (
                  <motion.div 
                    key={msg.id}
                    initial={{ opacity: 0, y: 10, scale: 0.98 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    transition={{ duration: 0.4, delay: idx === outputs.length - 1 ? 0.1 : 0 }}
                    className={`w-full p-6 rounded-3xl ${msg.role === 'user' ? 'bg-transparent text-right' : 'bg-white/[0.03] border border-white/[0.05] backdrop-blur-xl text-left shadow-2xl shadow-black/50'}`}
                  >
                     <p className={`text-lg font-light leading-relaxed whitespace-pre-wrap ${msg.role === 'user' ? 'text-[#AAA] italic' : 'text-[#E2E2E2]'}`}>
                        {msg.content}
                     </p>
                  </motion.div>
               ))}
               
               {status === "processing" && (
                  <motion.div 
                     initial={{ opacity: 0, y: 10 }}
                     animate={{ opacity: 1, y: 0 }}
                     className="w-full p-6 rounded-3xl bg-transparent flex items-center gap-3"
                  >
                     <div className="w-2 h-2 rounded-full bg-purple-500 animate-bounce" style={{ animationDelay: '0ms' }} />
                     <div className="w-2 h-2 rounded-full bg-purple-500 animate-bounce" style={{ animationDelay: '150ms' }} />
                     <div className="w-2 h-2 rounded-full bg-purple-500 animate-bounce" style={{ animationDelay: '300ms' }} />
                  </motion.div>
               )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <WisprInput onSubmit={handleInputSubmit} status={status} />
      <WisprExecutionStream actions={actions} />
    </main>
  );
}
