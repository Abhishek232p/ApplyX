"use client";

import { motion, AnimatePresence } from "framer-motion";
import { CheckCircle, Loader2, Circle, AlertCircle } from "lucide-react";

export interface ExecutionAction {
  id: string;
  title: string;
  status: "pending" | "processing" | "completed" | "error";
}

interface WisprExecutionStreamProps {
  actions: ExecutionAction[];
}

export default function WisprExecutionStream({ actions }: WisprExecutionStreamProps) {
  // Only show the latest 3 actions to keep it clean like Wispr
  const visibleActions = actions.slice(-3);

  return (
    <div className="fixed top-8 right-8 z-40 flex flex-col gap-2 pointer-events-none w-[320px]">
      <AnimatePresence>
        {visibleActions.map((action) => (
          <motion.div
            layout
            key={action.id}
            initial={{ opacity: 0, scale: 0.9, y: -10, filter: "blur(4px)" }}
            animate={{ opacity: 1, scale: 1, y: 0, filter: "blur(0px)" }}
            exit={{ opacity: 0, scale: 0.9, y: -10, filter: "blur(4px)", transition: { duration: 0.2 } }}
            transition={{ type: "spring", stiffness: 300, damping: 25 }}
            className="flex items-center gap-3 bg-[#111111]/80 backdrop-blur-xl border border-white/5 p-3 rounded-2xl shadow-xl"
          >
            <div className="flex-shrink-0 flex items-center justify-center w-6 h-6">
               {action.status === "processing" && (
                  <Loader2 className="w-4 h-4 text-[#8b5cf6] animate-spin" />
                )}
                {action.status === "completed" && (
                  <CheckCircle className="w-4 h-4 text-[#10b981]" />
                )}
                {action.status === "error" && (
                  <AlertCircle className="w-4 h-4 text-[#ef4444]" />
                )}
                {action.status === "pending" && (
                  <Circle className="w-4 h-4 text-[#444] border-dashed" />
                )}
            </div>
            
            <p className={`text-[13px] font-medium tracking-wide ${action.status === "completed" ? "text-[#888]" : "text-[#eee]"}`}>
              {action.title}
            </p>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}
