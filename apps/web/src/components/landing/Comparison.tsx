"use client";

import { motion } from "framer-motion";
import { MessageSquare, Zap, CheckCircle2, ChevronRight, XCircle } from "lucide-react";

export default function ComparisonSection() {
  return (
    <section className="py-24 px-6 bg-[#050505] border-t border-white/5 relative overflow-hidden">
      {/* Background Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] rounded-full bg-purple-900/10 blur-[120px] pointer-events-none" />
      
      <div className="max-w-6xl mx-auto space-y-16 relative z-10">
        <div className="text-center space-y-4">
           <h2 className="text-3xl md:text-5xl font-bold text-white tracking-tight">The Old Way vs. <span className="text-[#7C3AED]">NeuroFlow</span></h2>
           <p className="text-[#888] text-lg max-w-2xl mx-auto">LLMs generate text. They tell you how to do your job. NeuroFlow actually does it for you.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12">
           
           {/* ChatGPT Side */}
           <motion.div 
             initial={{ opacity: 0, y: 20 }}
             whileInView={{ opacity: 1, y: 0 }}
             viewport={{ once: true }}
             className="bg-[#111] border border-white/5 rounded-3xl p-8 flex flex-col gap-6"
           >
              <div className="flex items-center gap-3 pb-4 border-b border-white/10">
                 <div className="w-10 h-10 rounded-full bg-gray-800 flex items-center justify-center">
                    <MessageSquare size={18} className="text-gray-400" />
                 </div>
                 <div>
                    <h3 className="text-lg font-semibold text-white">ChatGPT / Gemini</h3>
                    <p className="text-sm text-gray-500">Conversational AI</p>
                 </div>
              </div>

              <div className="space-y-4 flex-grow font-sans text-sm">
                 <div className="bg-black/50 p-4 rounded-2xl rounded-tr-none self-end text-white/90 border border-white/5 w-[85%] ml-auto">
                    "Send the Q3 pitch deck to investor@example.com."
                 </div>
                 <div className="bg-[#1A1A1A] p-4 rounded-2xl rounded-tl-none self-start text-gray-400 border border-white/5 w-full space-y-3">
                    <p>I cannot send emails on your behalf.</p>
                    <p>However, here is a draft you can copy and paste into your email client:</p>
                    <div className="bg-black/80 rounded-lg p-3 font-mono text-xs border border-white/5 space-y-1">
                       <p>Subject: Q3 Pitch Deck</p>
                       <p>Hi there,</p>
                       <p>Please find attached...</p>
                    </div>
                 </div>
              </div>

              <div className="bg-red-500/10 border border-red-500/20 rounded-xl p-4 flex items-center gap-3 mt-4">
                 <XCircle className="text-red-400 w-5 h-5 flex-shrink-0" />
                 <span className="text-red-200/80 text-sm">Requires you to open Gmail, copy-paste, attach the file manually, and click send.</span>
              </div>
           </motion.div>

           {/* NeuroFlow Side */}
           <motion.div 
             initial={{ opacity: 0, y: 20 }}
             whileInView={{ opacity: 1, y: 0 }}
             viewport={{ once: true }}
             transition={{ delay: 0.2 }}
             className="bg-gradient-to-b from-[#111] to-[#1A1A1A] border border-[#7C3AED]/30 rounded-3xl p-8 flex flex-col gap-6 relative overflow-hidden shadow-[0_0_40px_-15px_rgba(124,58,237,0.3)]"
           >
              <div className="flex items-center gap-3 pb-4 border-b border-white/10 relative z-10">
                 <div className="w-10 h-10 rounded-full bg-[#7C3AED]/20 flex items-center justify-center border border-[#7C3AED]/30">
                    <Zap size={18} className="text-[#7C3AED]" />
                 </div>
                 <div>
                    <h3 className="text-lg font-semibold text-white">NeuroFlow Engine</h3>
                    <p className="text-sm text-[#7C3AED]/80">Execution Matrix</p>
                 </div>
              </div>

              <div className="space-y-4 flex-grow font-sans text-sm relative z-10">
                 <div className="bg-black/50 p-4 rounded-2xl rounded-tr-none self-end text-white/90 border border-[#7C3AED]/30 w-[85%] ml-auto">
                    "Send the Q3 pitch deck to investor@example.com."
                 </div>

                 <div className="flex flex-col gap-2 mt-4 font-mono text-xs text-[#7C3AED]">
                    <div className="flex items-center gap-2"><CheckCircle2 size={14} /> <span>Intent parsed: gmail.send</span></div>
                    <div className="flex items-center gap-2"><CheckCircle2 size={14} /> <span>Drafted Q3 context from memory</span></div>
                    <div className="flex items-center gap-2"><CheckCircle2 size={14} /> <span>Found 'Q3_Pitch.pdf' via system linkage</span></div>
                    <div className="flex items-center gap-2 glow-text font-bold"><CheckCircle2 size={14} /> <span>Delivered via Gmail Webhook.</span></div>
                 </div>
              </div>

              <div className="bg-[#7C3AED]/10 border border-[#7C3AED]/30 rounded-xl p-4 flex items-center gap-3 mt-4 relative z-10">
                 <CheckCircle2 className="text-[#7C3AED] w-5 h-5 flex-shrink-0" />
                 <span className="text-[#E2E2E2] text-sm">Zero manual work. NeuroFlow physically sent the email seamlessly in the background.</span>
              </div>
           </motion.div>

        </div>
      </div>
    </section>
  );
}
