export default function Footer() {
  return (
    <footer className="py-12 px-6 border-t border-white/5 bg-black">
      <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
        
        <div className="flex flex-col items-center md:items-start text-center md:text-left">
          <span className="text-lg font-bold tracking-widest text-[#7C3AED] mb-1">NEUROFLOW AI</span>
          <p className="text-sm text-white/30 font-light">The first personal execution system.</p>
        </div>

        <div className="text-sm text-white/20 flex gap-6">
          <a href="mailto:founder@neuroflow.ai" className="hover:text-white/60 transition-colors">Contact Founder</a>
          <a href="#" className="hover:text-white/60 transition-colors">Manifesto</a>
        </div>
        
        <div className="text-xs text-white/20 font-mono">
          SYSTEM. ONLINE. © {new Date().getFullYear()}
        </div>

      </div>
    </footer>
  );
}
