"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useState, useRef, useEffect } from "react";
import { Mic, Send, MicOff } from "lucide-react";

interface WisprInputProps {
  onSubmit: (input: string) => void;
  status: "idle" | "processing" | "complete";
}

export default function WisprInput({ onSubmit, status }: WisprInputProps) {
  const [input, setInput] = useState("");
  const [isFocused, setIsFocused] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  
  // Web Speech API
  const recognitionRef = useRef<any>(null);

  useEffect(() => {
    // Check for browser support
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (SpeechRecognition) {
      recognitionRef.current = new SpeechRecognition();
      recognitionRef.current.continuous = true;
      recognitionRef.current.interimResults = true;
      
      recognitionRef.current.onresult = (event: any) => {
        let currentTranscript = "";
        for (let i = 0; i < event.results.length; i++) {
          currentTranscript += event.results[i][0].transcript;
        }
        setInput(currentTranscript);
      };

      recognitionRef.current.onerror = (event: any) => {
        console.error("Speech recognition error", event.error);
        setIsRecording(false);
      };

      recognitionRef.current.onend = () => {
        setIsRecording(false);
      };
    }
  }, []);

  const toggleRecording = () => {
    if (!recognitionRef.current) {
      alert("Your browser does not support the Web Speech API for voice dictation.");
      return;
    }

    if (isRecording) {
      recognitionRef.current.stop();
      setIsRecording(false);
    } else {
      setInput(""); // clear previous
      recognitionRef.current.start();
      setIsRecording(true);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (isRecording) {
      recognitionRef.current?.stop();
      setIsRecording(false);
    }
    if (input.trim() && status !== "processing") {
      onSubmit(input);
      setInput("");
      inputRef.current?.blur();
    }
  };

  const isProcessing = status === "processing";

  // Auto-focus on component mount
  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  return (
    <div className="fixed bottom-12 left-1/2 -translate-x-1/2 z-50 flex flex-col items-center pointer-events-auto">
      <AnimatePresence>
        {isFocused && !input && !isProcessing && !isRecording && (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.95 }}
            animate={{ opacity: 1, y: -16, scale: 1 }}
            exit={{ opacity: 0, y: 5, scale: 0.95 }}
            transition={{ type: "spring", stiffness: 400, damping: 25 }}
            className="text-[#888] text-sm mb-2 font-medium tracking-wide flex items-center gap-2"
          >
            Type or press Mic to dictate
          </motion.div>
        )}
      </AnimatePresence>

      <motion.div
        layout
        initial={{ opacity: 0, scale: 0.8, y: 50 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ type: "spring", stiffness: 350, damping: 25 }}
        className="relative"
      >
        <form
          suppressHydrationWarning
          onSubmit={handleSubmit}
          className={`flex items-center gap-2 px-3 py-2.5 rounded-full transition-all duration-300 backdrop-blur-3xl overflow-hidden
            ${isFocused || isRecording
              ? "bg-[#1C1C1E]/90 shadow-[0_0_0_1px_rgba(255,255,255,0.1),0_16px_32px_-8px_rgba(0,0,0,0.6)] w-[480px]" 
              : "bg-[#2A2A2D]/80 shadow-[0_0_0_1px_rgba(255,255,255,0.05),0_8px_16px_rgba(0,0,0,0.4)] hover:bg-[#323236] w-[400px]"
            }
          `}
        >
          {/* Interactive Mic Button */}
          <button 
            suppressHydrationWarning
            type="button"
            onClick={toggleRecording}
            className={`flex-shrink-0 flex items-center justify-center w-10 h-10 rounded-full transition-all ${isRecording ? "bg-red-500 shadow-[0_0_15px_rgba(239,68,68,0.5)]" : "bg-gradient-to-br from-[#3b82f6] to-[#8b5cf6]"} text-white shadow-inner cursor-pointer`}
          >
            {isProcessing ? (
              <motion.div className="flex gap-1 items-center h-4">
                {[1, 2, 3].map((i) => (
                  <motion.div
                    key={i}
                    animate={{ height: ["4px", "14px", "4px"] }}
                    transition={{ repeat: Infinity, duration: 1, delay: i * 0.15, ease: "easeInOut" }}
                    className="w-1 bg-white rounded-full origin-bottom"
                  />
                ))}
              </motion.div>
            ) : isRecording ? (
               <MicOff className="w-5 h-5 fill-white/80" />
            ) : (
              <Mic className="w-5 h-5 fill-white/20" />
            )}
          </button>
          
          <input
            suppressHydrationWarning
            ref={inputRef}
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
            placeholder={isProcessing ? "NeuroFlow is acting..." : isRecording ? "Listening..." : "Dictate or type..."}
            disabled={isProcessing}
            className="flex-grow bg-transparent border-none outline-none text-[#F2F2F2] text-[17px] font-medium placeholder-[#666] disabled:opacity-50 px-2 leading-tight"
          />

          <AnimatePresence>
            {input.trim() && !isProcessing && (
              <motion.button
                type="submit"
                initial={{ opacity: 0, scale: 0.5, x: 10 }}
                animate={{ opacity: 1, scale: 1, x: 0 }}
                exit={{ opacity: 0, scale: 0.5, x: 10 }}
                className="flex-shrink-0 w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white mr-1 transition-colors"
              >
                <Send className="w-4 h-4 ml-0.5" />
              </motion.button>
            )}
          </AnimatePresence>
        </form>
        
        <AnimatePresence>
          {((isFocused && !isProcessing) || isRecording) && (
            <motion.div
              layoutId="wisprGlow"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className={`absolute inset-0 -z-10 rounded-full blur-xl scale-110 transition-colors duration-500 ${isRecording ? 'bg-gradient-to-r from-red-500/30 to-rose-500/30' : 'bg-gradient-to-r from-blue-500/30 via-purple-500/30 to-blue-500/30'}`}
            />
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
}
