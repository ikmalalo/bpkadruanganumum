import { useEffect, useRef, useState } from "react";
import * as THREE from "three";

// Fix for recent three.js versions turning hex colors dark/muddy in Vanta
if (THREE.ColorManagement) {
  THREE.ColorManagement.enabled = false;
}

// @ts-ignore
import NET from "vanta/dist/vanta.net.min";

export default function HomeBackground() {
  const [vantaEffect, setVantaEffect] = useState<any>(null);
  const vantaRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!vantaEffect && vantaRef.current) {
      setVantaEffect(
        NET({
          el: vantaRef.current,
          THREE: THREE,
          mouseControls: true,
          touchControls: true,
          gyroControls: false,
          minHeight: 200.00,
          minWidth: 200.00,
          scale: 1.00,
          scaleMobile: 1.00,
          color: 0xff6a00, // BPKAD Orange
          backgroundColor: 0xf9fafb, // Tailwind gray-50
          points: 12.00,
          maxDistance: 20.00,
          spacing: 16.00,
          showDots: true
        })
      );
    }
    return () => {
      if (vantaEffect) vantaEffect.destroy();
    };
  }, [vantaEffect]);

  return (
    <div 
      ref={vantaRef} 
      className="absolute inset-0 overflow-hidden z-0"
    >
      {/* 
        The Vanta background will render inside this div. 
        It needs to be able to receive mouse events, so we don't use pointer-events-none here.
        The interactive NET effect will track mouse movements in the empty space of the screen.
      */}
    </div>
  )
}
