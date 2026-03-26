export default function HomeBackground() {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
      
      {/* Animated Blobs */}
      <div className="absolute top-[10%] left-[-5%] w-72 h-72 bg-orange-200/30 rounded-full blur-[100px] animate-pulse direction-alternate duration-[8s]" />
      <div className="absolute bottom-[10%] right-[-5%] w-96 h-96 bg-blue-100/40 rounded-full blur-[120px] animate-pulse direction-alternate duration-[12s]" />
      <div className="absolute top-[40%] right-[10%] w-64 h-64 bg-orange-100/30 rounded-full blur-[80px] animate-pulse direction-alternate duration-[10s]" />
      
      {/* Moving Particles */}
      {[...Array(20)].map((_, i) => (
        <div
          key={i}
          className="particle"
          style={{
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
            width: `${Math.random() * 4 + 2}px`,
            height: `${Math.random() * 4 + 2}px`,
            animationDelay: `${Math.random() * 8}s`,
            animationDuration: `${Math.random() * 4 + 6}s`,
            opacity: Math.random() * 0.5 + 0.2
          }}
        />
      ))}

      {/* Subtle Mesh Gradient Overlay */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(255,255,255,0)_0%,rgba(255,255,255,0.8)_100%)]" />

    </div>
  )
}
