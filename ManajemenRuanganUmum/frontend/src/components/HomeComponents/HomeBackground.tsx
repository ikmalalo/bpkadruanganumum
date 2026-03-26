import { useEffect, useState } from "react";
import Particles, { initParticlesEngine } from "@tsparticles/react";
import { loadSlim } from "@tsparticles/slim";

export default function HomeBackground() {
  const [init, setInit] = useState(false);

  useEffect(() => {
    initParticlesEngine(async (engine) => {
      await loadSlim(engine);
    }).then(() => {
      setInit(true);
    });
  }, []);

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
      
      {/* Premium Particles Effect */}
      {init && (
        <Particles
          id="tsparticles"
          className="absolute inset-0 z-0 pointer-events-none"
          options={{
            background: {
              color: { value: "transparent" },
            },
            fpsLimit: 120,
            interactivity: {
              events: {
                onClick: { enable: false },
                onHover: { enable: false },
              },
            },
            particles: {
              color: { value: "#fb923c" },
              links: {
                color: "#fdba74",
                distance: 150,
                enable: true,
                opacity: 0.2,
                width: 1,
              },
              move: {
                direction: "none",
                enable: true,
                outModes: { default: "bounce" },
                random: false,
                speed: 1.5,
                straight: false,
              },
              number: {
                density: { enable: true },
                value: 60,
              },
              opacity: { value: 0.5 },
              shape: { type: "circle" },
              size: { value: { min: 3, max: 7 } },
            },
            detectRetina: true,
          }}
        />
      )}

      {/* Performance-Optimized Background Globs (Statik/Low-Animation) */}
      <div 
        className="absolute top-[-10%] left-[-10%] w-[50rem] h-[50rem] bg-[radial-gradient(circle_at_center,rgba(255,146,60,0.06),transparent_70%)] pointer-events-none" 
      />
      <div 
        className="absolute bottom-[-15%] right-[-15%] w-[60rem] h-[60rem] bg-[radial-gradient(circle_at_center,rgba(191,219,254,0.08),transparent_70%)] pointer-events-none" 
      />
      <div 
        className="absolute top-[20%] right-[5%] w-[40rem] h-[40rem] bg-[radial-gradient(circle_at_center,rgba(255,107,0,0.04),transparent_70%)] animate-pulse-slow pointer-events-none" 
      />
      
      {/* Static Overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-white/10 via-transparent to-white/40 pointer-events-none" />

    </div>
  )
}
