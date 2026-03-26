export default function HomeBackground() {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
      
      {/* Dynamic Animated Blobs (Increased Size & Count) */}
      <div 
        className="absolute top-[-10%] left-[-10%] w-[60rem] h-[60rem] bg-[radial-gradient(circle_at_center,rgba(255,146,60,0.12),transparent_70%)] animate-pulse direction-alternate duration-[10s] will-change-[transform,opacity]" 
      />
      <div 
        className="absolute bottom-[-15%] right-[-15%] w-[70rem] h-[70rem] bg-[radial-gradient(circle_at_center,rgba(191,219,254,0.15),transparent_70%)] animate-pulse direction-alternate duration-[15s] will-change-[transform,opacity]" 
      />
      <div 
        className="absolute top-[30%] right-[-5%] w-[50rem] h-[50rem] bg-[radial-gradient(circle_at_center,rgba(255,107,0,0.1),transparent_70%)] animate-pulse direction-alternate duration-[12s] will-change-[transform,opacity]" 
      />
      <div 
        className="absolute bottom-[20%] left-[-10%] w-[45rem] h-[45rem] bg-[radial-gradient(circle_at_center,rgba(139,92,246,0.08),transparent_70%)] animate-pulse direction-alternate duration-[18s] will-change-[transform,opacity]" 
      />
      <div 
        className="absolute top-[10%] right-[30%] w-[40rem] h-[40rem] bg-[radial-gradient(circle_at_center,rgba(253,224,71,0.05),transparent_70%)] animate-pulse direction-alternate duration-[14s] will-change-[transform,opacity]" 
      />
      
      {/* High-Density Micro-Particles (24 particles) */}
      {[...Array(24)].map((_, i) => (
        <div
          key={i}
          className="particle opacity-20"
          style={{
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
            width: `${Math.random() * 4 + 1.5}px`,
            height: `${Math.random() * 4 + 1.5}px`,
            animationDelay: `${Math.random() * 10}s`,
            animationDuration: `${Math.random() * 6 + 4}s`,
            boxShadow: 'none',
            willChange: 'transform, opacity'
          }}
        />
      ))}

      {/* Soft Multi-Layer Overlay */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(255,255,255,0.4),transparent)]" />
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-white/60" />

    </div>
  )
}
