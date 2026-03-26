export default function HomeBackground() {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
      
      {/* Performance-Optimized Background Globs (Statik/Low-Animation) */}
      <div 
        className="absolute top-[-10%] left-[-10%] w-[50rem] h-[50rem] bg-[radial-gradient(circle_at_center,rgba(255,146,60,0.06),transparent_70%)]" 
      />
      <div 
        className="absolute bottom-[-15%] right-[-15%] w-[60rem] h-[60rem] bg-[radial-gradient(circle_at_center,rgba(191,219,254,0.08),transparent_70%)]" 
      />
      <div 
        className="absolute top-[20%] right-[5%] w-[40rem] h-[40rem] bg-[radial-gradient(circle_at_center,rgba(255,107,0,0.04),transparent_70%)] animate-pulse-slow" 
      />
      
      {/* Minimal Micro-Particles (8 particles only) */}
      {[...Array(8)].map((_, i) => (
        <div
          key={i}
          className="particle opacity-10"
          style={{
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
            width: `${Math.random() * 2 + 1}px`,
            height: `${Math.random() * 2 + 1}px`,
            animationDelay: `${Math.random() * 5}s`,
            animationDuration: `${Math.random() * 8 + 4}s`,
          }}
        />
      ))}

      {/* Static Overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-white/10 via-transparent to-white/40" />

    </div>
  )
}
