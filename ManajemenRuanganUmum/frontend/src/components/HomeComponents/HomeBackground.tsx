export default function HomeBackground() {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
      
      {/* Optimized Animated Blobs (Gradients instead of Blurs) */}
      <div 
        className="absolute top-[10%] left-[-10%] w-[40rem] h-[40rem] bg-[radial-gradient(circle_at_center,rgba(255,146,60,0.08),transparent_70%)] animate-pulse direction-alternate duration-[8s] will-change-[transform,opacity]" 
      />
      <div 
        className="absolute bottom-[10%] right-[-10%] w-[50rem] h-[50rem] bg-[radial-gradient(circle_at_center,rgba(191,219,254,0.12),transparent_70%)] animate-pulse direction-alternate duration-[12s] will-change-[transform,opacity]" 
      />
      <div 
        className="absolute top-[40%] right-[5%] w-[35rem] h-[35rem] bg-[radial-gradient(circle_at_center,rgba(255,107,0,0.06),transparent_70%)] animate-pulse direction-alternate duration-[10s] will-change-[transform,opacity]" 
      />
      
      {/* Optimized Micro-Particles (Lower count) */}
      {[...Array(12)].map((_, i) => (
        <div
          key={i}
          className="particle opacity-30"
          style={{
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
            width: `${Math.random() * 3 + 1}px`,
            height: `${Math.random() * 3 + 1}px`,
            animationDelay: `${Math.random() * 8}s`,
            animationDuration: `${Math.random() * 4 + 6}s`,
            boxShadow: 'none', // Remove heavy shadow
            willChange: 'transform, opacity'
          }}
        />
      ))}

      {/* Lightweight Mesh Overlay */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_100%,rgba(255,255,255,0.7),transparent)]" />

    </div>
  )
}
