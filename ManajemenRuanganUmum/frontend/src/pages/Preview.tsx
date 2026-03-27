import { useState, useEffect, useRef } from "react"
import { useNavigate } from "react-router-dom"
import { ArrowRight, ArrowLeft } from "lucide-react"
import "../index.css"

declare global {
  interface Window {
    VANTA: any;
  }
}

export default function Preview() {
  const navigate = useNavigate()

  const [selectedLocation, setSelectedLocation] = useState<
    "landscape" | "portrait" | null
  >(null)

  const [vantaEffect, setVantaEffect] = useState<any>(null)
  const vantaRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!vantaEffect && vantaRef.current && window.VANTA) {
      setVantaEffect(
        window.VANTA.DOTS({
          el: vantaRef.current,
          mouseControls: true,
          touchControls: true,
          gyroControls: false,
          minHeight: 200.00,
          minWidth: 200.00,
          scale: 1.00,
          scaleMobile: 1.00,
          color: 0xff6a00,
          color2: 0xff6a00,
          backgroundColor: 0xffffff
        })
      )
    }
    return () => {
      if (vantaEffect) vantaEffect.destroy()
    }
  }, [vantaEffect])

  return (
    <div className="relative min-h-screen bg-white overflow-hidden">
      {/* Vanta DOTS Background */}
      <div ref={vantaRef} className="absolute inset-0 z-0"></div>

      {/* Main Content */}
      <div className="relative z-10 flex flex-col pt-10 px-4 md:px-0 min-h-screen">
      
      {/* Header for Standalone View */}
      <div className="max-w-5xl mx-auto w-full mb-12 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 tracking-tight">Pilih Mode Tampilan</h1>
          <p className="text-gray-500 mt-1 text-sm">Silakan pilih orientasi layar untuk melanjutkan ke preview agenda.</p>
        </div>
        
        <button 
          onClick={() => navigate("/")}
          className="flex items-center gap-2 text-sm font-semibold text-gray-400 hover:text-[#ff6b00] transition-all group"
        >
          <ArrowLeft size={18} className="transition-transform group-hover:-translate-x-1" />
          <span>Kembali ke Beranda</span>
        </button>
      </div>

      {/* Cards */}
      <div className="flex flex-col md:flex-row justify-center items-stretch gap-8 max-w-5xl mx-auto w-full mb-12">

        {/* Landscape */}
        <button
          onClick={() => setSelectedLocation("landscape")}
          className={`group flex-1 relative rounded-xl p-8 text-left transition-all duration-300 border-2 overflow-hidden
          aspect-[4/3] md:aspect-auto md:h-80 flex flex-col justify-end
          ${
            selectedLocation === "landscape"
              ? "bg-orange-500 border-orange-500 text-white shadow-[0_0_20px_rgba(249,115,22,0.6)] scale-[1.02]"
              : "bg-white border-orange-400 text-gray-900 hover:border-orange-500 hover:shadow-[0_0_15px_rgba(249,115,22,0.4)] hover:-translate-y-1"
          }`}
        >
          <div className="relative z-10 mt-auto transition-transform duration-300 group-hover:translate-x-1">
            <h3
              className={`text-4xl md:text-5xl font-extrabold mb-2 tracking-tight ${
                selectedLocation === "landscape"
                  ? "text-white"
                  : "text-gray-900"
              }`}
            >
              Landscape
            </h3>

            <p
              className={`text-base font-medium ${
                selectedLocation === "landscape"
                  ? "text-orange-50"
                  : "text-gray-500"
              }`}
            >
              Layar Horizontal
            </p>
          </div>
        </button>

        {/* Portrait */}
        <button
          onClick={() => setSelectedLocation("portrait")}
          className={`group flex-1 relative rounded-xl p-8 text-left transition-all duration-300 border-2 overflow-hidden
          aspect-[4/3] md:aspect-auto md:h-80 flex flex-col justify-end
          ${
            selectedLocation === "portrait"
              ? "bg-orange-500 border-orange-500 text-white shadow-[0_0_20px_rgba(249,115,22,0.6)] scale-[1.02]"
              : "bg-white border-orange-400 text-gray-900 hover:border-orange-500 hover:shadow-[0_0_15px_rgba(249,115,22,0.4)] hover:-translate-y-1"
          }`}
        >
          <div className="relative z-10 mt-auto transition-transform duration-300 group-hover:translate-x-1">
            <h3
              className={`text-4xl md:text-5xl font-extrabold mb-2 tracking-tight ${
                selectedLocation === "portrait"
                  ? "text-white"
                  : "text-gray-900"
              }`}
            >
              Portrait
            </h3>

            <p
              className={`text-base font-medium ${
                selectedLocation === "portrait"
                  ? "text-orange-50"
                  : "text-gray-500"
              }`}
            >
              Layar Vertikal
            </p>
          </div>
        </button>

      </div>

      {/* Button */}
      <div className="max-w-5xl mx-auto w-full flex justify-end pb-8">
        <button
          onClick={() => {
            if (selectedLocation === "landscape") {
              navigate("/preview-horizontal")
            } else if (selectedLocation === "portrait") {
              navigate("/preview-vertikal")
            }
          }}
          disabled={!selectedLocation}
          className={`flex items-center gap-2 px-8 py-3 rounded-lg font-semibold transition-all duration-200 shadow-sm
          ${
            selectedLocation
              ? "bg-orange-500 text-white hover:bg-orange-600 shadow-orange-500/30"
              : "bg-gray-200 text-gray-400 cursor-not-allowed"
          }`}
        >
          Lanjut
          <ArrowRight size={18} />
        </button>
      </div>

      </div>
    </div>
  )
}