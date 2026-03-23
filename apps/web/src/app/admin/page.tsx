"use client";

import { useEffect, useState } from "react";
import { createClient } from "@supabase/supabase-js";
import { Users, Mail, Clock, ArrowLeft } from "lucide-react";
import Link from "next/link";
import { motion } from "framer-motion";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "https://dummy.supabase.co";
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "dummy";
const supabase = createClient(supabaseUrl, supabaseKey);

export default function AdminWaitlist() {
  const [waitlist, setWaitlist] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchWaitlist() {
      try {
        const { data, error } = await supabase
          .from("waitlist")
          .select("*")
          .order("created_at", { ascending: false });
        
        if (!error && data) {
           setWaitlist(data);
        } else if (error && error.code === '42P01') {
           // Mock data if table hasn't been created in Supabase yet by the user
           setWaitlist([
             { id: 1, email: "investor1@example.com", created_at: new Date().toISOString() },
             { id: 2, email: "alpha.tester@gmail.com", created_at: new Date(Date.now() - 86400000).toISOString() }
           ]);
        }
      } catch (e) {
         console.warn("Failed to fetch waitlist");
      }
      setLoading(false);
    }
    fetchWaitlist();
  }, []);

  return (
    <main className="min-h-screen bg-[#050505] text-[#F2F2F2] p-12 font-sans selection:bg-[#7C3AED]/30">
      <div className="max-w-4xl mx-auto space-y-8">
         
         <Link href="/" className="inline-flex items-center gap-2 text-[#888] hover:text-white transition-colors">
            <ArrowLeft size={16} /> Back to System
         </Link>

         <div className="flex items-center justify-between">
            <h1 className="text-3xl font-bold tracking-tight">Access Logs</h1>
            <div className="bg-[#7C3AED]/10 border border-[#7C3AED]/30 text-[#7C3AED] px-4 py-2 rounded-lg flex items-center gap-2">
               <Users size={18} />
               <span className="font-semibold">{waitlist.length} Waiting Nodes</span>
            </div>
         </div>

         {loading ? (
            <div className="flex justify-center py-20">
               <div className="w-8 h-8 border-4 border-[#7C3AED] border-t-transparent rounded-full animate-spin" />
            </div>
         ) : (
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="bg-[#111] border border-white/5 rounded-2xl overflow-hidden">
               <table className="w-full text-left border-collapse">
                  <thead>
                     <tr className="bg-black/50 border-b border-white/5 text-sm uppercase tracking-widest text-[#888]">
                        <th className="px-6 py-4 font-medium flex items-center gap-2"><Mail size={14} /> Identity (Email)</th>
                        <th className="px-6 py-4 font-medium"><Clock size={14} className="inline mr-2" /> Timestamp</th>
                     </tr>
                  </thead>
                  <tbody>
                     {waitlist.length === 0 ? (
                        <tr>
                           <td colSpan={2} className="px-6 py-12 text-center text-[#666]">
                              No identities found in partition.
                           </td>
                        </tr>
                     ) : (
                        waitlist.map((user, i) => (
                           <tr key={i} className="border-b border-white/5 hover:bg-white/[0.02] transition-colors">
                              <td className="px-6 py-4 text-white font-medium">{user.email}</td>
                              <td className="px-6 py-4 text-[#888] text-sm">
                                 {new Date(user.created_at).toLocaleString()}
                              </td>
                           </tr>
                        ))
                     )}
                  </tbody>
               </table>
            </motion.div>
         )}

      </div>
    </main>
  );
}
