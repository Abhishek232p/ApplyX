"use client";

import { motion } from "framer-motion";
import { useState } from "react";
import { ArrowRight, Sparkles } from "lucide-react";

export default function VisionAndCTA() {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) {
       setSubmitted(true);
       setTimeout(() => {
          setEmail("");
          setSubmitted(false);
       }, 5000);
    }
  };

  return (
    <section className="py-40 px-6 bg-black relative overflow-hidden">
      
      {/* Background glow for the vision statement */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-[#7C3AED]/10 blur-[150px] rounded-full pointer-events-none" />

      <div className="max-w-4xl mx-auto text-center relative z-10">
        
        <motion.div
           initial={{ opacity: 0, scale: 0.95 }}
           whileInView={{ opacity: 1, scale: 1 }}
           viewport={{ once: true }}
           transition={{ duration: 1 }}
        >
           <h2 className="text-4xl md:text-6xl font-bold text-white mb-6 leading-tight tracking-tight">
             Future is not faster tools.<br />
             <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-[#7C3AED]">Future is no tools.</span>
           </h2>
           <p className="text-xl md:text-2xl text-white/40 font-light mb-16 max-w-2xl mx-auto">
             Stop managing work. Start managing outcomes. Join the private alpha of NeuroFlow AI and become superhuman.
           </p>
        </motion.div>

        <motion.div
           initial={{ opacity: 0, y: 30 }}
           whileInView={{ opacity: 1, y: 0 }}
           viewport={{ once: true }}
           transition={{ delay: 0.3, duration: 0.8 }}
           className="max-w-md mx-auto"
        >
          {submitted ? (
            <div className="flex flex-col items-center justify-center p-8 border border-emerald-500/20 bg-emerald-500/5 rounded-2xl backdrop-blur-sm">
               <Sparkles className="text-emerald-500 mb-4" size={32} />
               <h3 className="text-xl text-white font-medium mb-2">You're on the list.</h3>
               <p className="text-white/50 text-sm">We'll notify you when your node is ready.</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3">
              <input 
                type="email" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email" 
                required
                className="flex-grow px-6 py-4 rounded-xl bg-white/5 border border-white/10 text-white placeholder:text-white/30 focus:outline-none focus:border-[#7C3AED]/50 focus:ring-1 focus:ring-[#7C3AED]/50 transition-all text-lg"
              />
              <button 
                type="submit"
                className="px-8 py-4 rounded-xl bg-white text-black font-semibold text-lg hover:bg-gray-200 transition-colors flex items-center justify-center gap-2 group whitespace-nowrap"
              >
                Join early users
                <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
              </button>
            </form>
          )}
          <p className="text-sm text-white/20 mt-6 tracking-wide uppercase">Limited access. Engineering heavy load.</p>
        </motion.div>

      </div>
    </section>
  );
}
