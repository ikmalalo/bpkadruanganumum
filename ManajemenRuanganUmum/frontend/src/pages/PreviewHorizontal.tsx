import { useState, useEffect, useMemo, useRef } from "react"

declare global {
  interface Window {
    VANTA: any;
  }
}
import logo from "../assets/images/logo.png"
import { format } from "date-fns"
import { id } from "date-fns/locale"
import { ArrowLeft } from "lucide-react"
import { useNavigate } from "react-router-dom"
import { apiUrl } from "../lib/api"

interface AgendaItem {
  id: number
  hari: string
  tanggal: string
  tempat: string
  pukul: string
  acara: string
  pelaksana: string
  dihadiri?: string
  status: "Berlangsung" | "Terjadwal"
  type: "BPKAD" | "PEMKOT"
}

interface CertificateItem {
  id: number
  nama_penerima: string
  penghargaan: string
  tanggal: string
  foto: string // base64
}

type SlideItem = { type: 'AGENDA'; data: AgendaItem[]; category: 'BPKAD' | 'PEMKOT' } | { type: 'CERTIFICATE'; data: CertificateItem }

export default function PreviewHorizontal() {
  const navigate = useNavigate()
  const [time, setTime] = useState(new Date())
  const [allAgendas, setAllAgendas] = useState<AgendaItem[]>([])
  const [allCertificates, setAllCertificates] = useState<CertificateItem[]>([])
  const [loading, setLoading] = useState(true)

  const vantaRef = useRef<HTMLDivElement>(null)
  const [vantaEffect, setVantaEffect] = useState<any>(null)

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

  const fetchData = async () => {
    try {
      const [respAgendas, respCerts] = await Promise.all([
        fetch(apiUrl('/api/agendas')),
        fetch(apiUrl('/api/certificates'))
      ])
      const agendas = await respAgendas.json()
      const certs = await respCerts.json()
      setAllAgendas(agendas)
      setAllCertificates(certs)
      setLoading(false)
    } catch (error) {
      console.error('Error fetching data:', error)
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchData()
    const refreshInterval = setInterval(fetchData, 30000)
    return () => clearInterval(refreshInterval)
  }, [])

  const itemsPerPageCount = 3
  const SLIDE_DURATION = 10000

  const pages = useMemo(() => {
    const slides: SlideItem[] = []
    
    // Group Agendas
    const bpkad = allAgendas.filter(item => item.type === "BPKAD")
    const pemkot = allAgendas.filter(item => item.type === "PEMKOT")

    const chunk = (arr: AgendaItem[], size: number, category: 'BPKAD' | 'PEMKOT') => {
      for (let i = 0; i < arr.length; i += size) {
        slides.push({ type: 'AGENDA', data: arr.slice(i, i + size), category })
      }
    }

    chunk(bpkad, itemsPerPageCount, 'BPKAD')
    chunk(pemkot, itemsPerPageCount, 'PEMKOT')

    // Add Certificates as individual slides
    allCertificates.forEach(cert => {
      slides.push({ type: 'CERTIFICATE', data: cert })
    })

    return slides
  }, [allAgendas, allCertificates])

  const [currentPage, setCurrentPage] = useState(0)
  const [progress, setProgress] = useState(0)

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000)
    return () => clearInterval(timer)
  }, [])

  useEffect(() => {
    if (pages.length === 0) return
    const interval = 50
    const step = (interval / SLIDE_DURATION) * 100
    const timer = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          setCurrentPage((oldPage) => (oldPage + 1) % pages.length)
          return 0
        }
        return prev + step
      })
    }, interval)
    return () => clearInterval(timer)
  }, [pages.length])

  const handlePageClick = (index: number) => {
    setCurrentPage(index);
    setProgress(0); // Reset progress when manually changing page
  };

  const currentSlide = pages[currentPage]

  const pageTitle = useMemo(() => {
    if (!currentSlide) return "AGENDA RUANG RAPAT"
    if (currentSlide.type === 'AGENDA') return `AGENDA RUANG RAPAT ${currentSlide.category}`
    return "PENGHARGAAN & SERTIFIKAT"
  }, [currentSlide])

  if (loading && allAgendas.length === 0) {
    return (
      <div className="h-screen w-full flex items-center justify-center bg-gray-50 flex-col gap-4">
        <div className="w-12 h-12 border-4 border-orange-500 border-t-transparent rounded-full animate-spin"></div>
        <p className="text-gray-500 font-bold animate-pulse uppercase tracking-widest text-sm">Menghubungkan ke Database...</p>
      </div>
    )
  }

  return (
    <div className="bg-white h-screen relative overflow-hidden flex flex-col">
      {/* Vanta DOTS Background */}
      <div ref={vantaRef} className="absolute inset-0 z-0"></div>
      <div className="relative z-10 h-full flex flex-col">
      <div className="fixed top-0 left-0 w-20 h-20 z-50 group flex items-start justify-start p-3">
        <button onClick={() => navigate('/preview')} className="bg-white p-2 rounded-full shadow-2xl border border-gray-100 text-orange-500 transition-all duration-300 opacity-0 group-hover:opacity-100 scale-75 group-hover:scale-100 active:scale-90">
          <ArrowLeft size={18} strokeWidth={3} />
        </button>
      </div>

        <div className="flex-1 p-3 md:p-5 flex flex-col w-full max-w-[1920px] mx-auto overflow-hidden">
        <div className="flex justify-between items-center mb-2 pl-8 md:pl-0">
          <div className="flex flex-col">
            <div className="flex items-baseline gap-2">
              <span className="text-4xl md:text-5xl font-black text-gray-800 leading-none">{format(time, "HH:mm")}</span>
              <span className="text-xl md:text-2xl font-bold text-orange-500">WITA</span>
            </div>
            <span className="text-base md:text-lg font-bold text-orange-500 uppercase tracking-widest leading-none mt-1">
              {format(time, "EEEE, dd MMMM yyyy", { locale: id })}
            </span>
          </div>
          <img src={logo} alt="Logo" className="h-14 md:h-16 object-contain" />
        </div>

        <div className="w-full h-1.5 rounded-full overflow-hidden flex mb-3 shadow-inner bg-gray-200">
          <div className="bg-orange-500 h-full transition-all duration-100 ease-linear" style={{ width: `${progress}%` }}></div>
        </div>

        <div className="flex items-center justify-between mb-2">
          <h1 className="text-xl md:text-2xl font-black text-gray-800 tracking-tight uppercase leading-none">{pageTitle}</h1>
          <div className="flex gap-2">
            {pages.map((_, i) => (
              <div 
                key={i} 
                onClick={() => handlePageClick(i)}
                className={`w-2.5 h-2.5 rounded-full transition-all duration-300 cursor-pointer hover:scale-150 ${i === currentPage ? "bg-orange-500 scale-125 shadow-lg shadow-orange-200" : "bg-gray-300 shadow-sm"}`}
              ></div>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-[1.2rem] shadow-xl overflow-hidden border border-gray-100 w-full flex-1 flex flex-col relative">
          {currentSlide?.type === 'AGENDA' ? (
            <table className="w-full border-collapse flex-1 flex flex-col items-stretch">
              <thead>
                <tr className="bg-orange-500 text-white flex w-full">
                  <th className="py-2 px-2 text-center text-sm font-black w-16 flex items-center justify-center">NO</th>
                  <th className="py-2 px-4 text-left text-sm font-black flex-1 flex items-center">HARI / TANGGAL</th>
                  <th className="py-2 px-4 text-left text-sm font-black flex-1 flex items-center">TEMPAT</th>
                  <th className="py-2 px-4 text-center text-sm font-black w-32 flex items-center justify-center">PUKUL</th>
                  <th className="py-2 px-6 text-left text-sm font-black flex-[2] flex items-center">ACARA</th>
                  <th className="py-2 px-4 text-left text-sm font-black flex-1 flex items-center">PELAKSANA</th>
                  <th className="py-2 px-4 text-center text-sm font-black w-32 flex items-center justify-center">STATUS</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 flex-1 flex flex-col w-full overflow-hidden">
                {currentSlide.data.map((item, idx) => (
                  <tr key={idx} className="hover:bg-orange-50/40 transition-all duration-300 flex w-full flex-1 items-stretch min-h-0 animate-in fade-in slide-in-from-right-4">
                    <td className="px-2 text-base font-black text-gray-400 text-center w-16 flex items-center justify-center">{idx + 1}</td>
                    <td className="px-4 flex-1 flex flex-col justify-center min-w-0">
                      <span className="text-sm font-black text-gray-800 uppercase leading-none mb-1">{item.hari}</span>
                      <span className="text-[11px] font-bold text-gray-400 uppercase tracking-wider">{item.tanggal.split(', ')[1] || item.tanggal}</span>
                    </td>
                    <td className="px-4 flex-1 flex items-center min-w-0 font-black text-sm text-gray-800 uppercase">{item.tempat}</td>
                    <td className="px-4 w-32 flex items-center justify-center"><span className="text-base font-black text-orange-500 bg-orange-50 px-2.5 py-1 rounded-md">{item.pukul}</span></td>
                    <td className="px-6 flex-[2] flex items-center min-w-0 font-black text-sm text-gray-800 uppercase leading-tight">{item.acara}</td>
                    <td className="px-4 flex-1 flex items-center min-w-0 font-black text-[13px] text-gray-800 uppercase">{item.pelaksana}</td>
                    <td className="px-4 w-32 flex items-center justify-center">
                      <span className={`inline-block w-32 py-2 rounded-xl text-sm font-black text-white text-center ${item.status === 'Berlangsung' ? 'bg-[#10b981]' : 'bg-[#3b82f6]'}`}>{item.status}</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : currentSlide?.type === 'CERTIFICATE' ? (
            <div className="flex-1 flex items-center justify-center bg-white overflow-hidden p-10">
                <img 
                  src={currentSlide.data.foto} 
                  alt="Sertifikat" 
                  style={{ maxHeight: '72vh', maxWidth: '85vw' }}
                  className="w-auto h-auto object-contain border-[12px] border-white rounded-lg" 
                />
            </div>
          ) : null}
        </div>
        </div>
      </div>
    </div>
  )
}
