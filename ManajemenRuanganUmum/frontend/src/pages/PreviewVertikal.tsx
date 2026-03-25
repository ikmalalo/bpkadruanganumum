import { useState, useEffect, useMemo } from "react"
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

export default function PreviewVertikal() {
  const navigate = useNavigate()
  const [time, setTime] = useState(new Date())
  const [allAgendas, setAllAgendas] = useState<AgendaItem[]>([])
  const [allCertificates, setAllCertificates] = useState<CertificateItem[]>([])
  const [loading, setLoading] = useState(true)

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

  const itemsPerPageCount = 2
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

    // Add Certificates
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
    <div className="bg-[#f3f4f6] h-screen relative overflow-hidden flex flex-col">
      <div className="fixed top-0 left-0 w-20 h-20 z-50 group flex items-start justify-start p-3">
        <button onClick={() => navigate('/preview')} className="bg-white p-2 rounded-full shadow-2xl border border-gray-100 text-orange-500 transition-all duration-300 opacity-0 group-hover:opacity-100 scale-75 group-hover:scale-100 active:scale-90">
          <ArrowLeft size={18} strokeWidth={3} />
        </button>
      </div>

      <div className="flex-1 p-3 md:p-4 flex flex-col w-full max-w-full mx-auto overflow-hidden">
        <div className="flex flex-col items-center mb-3 text-center">
          <img src={logo} alt="Logo" className="h-10 mb-2 object-contain" />
          <div className="flex flex-col items-center">
            <div className="flex items-baseline gap-1.5">
              <span className="text-2xl md:text-3xl font-black text-gray-800">{format(time, "HH:mm")}</span>
              <span className="text-base md:text-lg font-bold text-orange-500">WITA</span>
            </div>
            <span className="text-xs md:text-sm font-bold text-orange-500 uppercase tracking-widest leading-none">
              {format(time, "EEEE, dd MMMM yyyy", { locale: id })}
            </span>
          </div>
        </div>

        <div className="w-full h-1.5 rounded-full overflow-hidden flex mb-3 shadow-inner bg-gray-200">
          <div className="bg-orange-500 h-full transition-all duration-100 ease-linear" style={{ width: `${progress}%` }}></div>
        </div>

        <div className="flex flex-col items-center mb-3 text-center">
          <h1 className="text-base md:text-lg font-black text-gray-800 tracking-tight uppercase leading-tight mb-2 min-h-[1.5em]">{pageTitle}</h1>
          <div className="flex gap-1">
            {pages.map((_, i) => (
              <div key={i} className={`w-1.5 h-1.5 rounded-full transition-all duration-300 ${i === currentPage ? "bg-orange-500 scale-110" : "bg-gray-300"}`}></div>
            ))}
          </div>
        </div>

        <div className="flex-1 overflow-hidden">
          {currentSlide?.type === 'AGENDA' ? (
            <div className="flex flex-col gap-4 animate-in fade-in slide-in-from-bottom-4 duration-500">
              {currentSlide.data.map((item, idx) => (
                <div key={idx} className="bg-white rounded-2xl shadow-md border border-gray-100 overflow-hidden flex flex-col relative translate-y-0 hover:-translate-y-1 transition-transform">
                  <div className={`absolute top-4 right-4 px-4 py-1.5 rounded-full text-xs font-black text-white shadow-md z-10 ${item.status === "Berlangsung" ? "bg-[#10b981]" : "bg-[#3b82f6]"}`}>
                    {item.status}
                  </div>
                  <div className="bg-gray-50/50 p-4 border-b border-gray-100 flex items-center gap-4">
                    <div className="w-10 h-10 rounded-xl bg-orange-500 flex items-center justify-center text-white font-black text-lg shadow-orange-200 shadow-lg">{idx + 1}</div>
                    <div>
                      <div className="text-[10px] font-bold text-gray-400 uppercase tracking-wider leading-none">{item.hari}</div>
                      <div className="text-xs font-black text-gray-600 uppercase mt-0.5">{item.tanggal.split(', ')[1] || item.tanggal}</div>
                      <div className="text-base font-black text-orange-500 leading-none mt-1">{item.pukul}</div>
                    </div>
                  </div>
                  <div className="p-5 flex flex-col gap-4">
                    <div>
                      <div className="text-[10px] font-bold text-orange-500 uppercase tracking-widest mb-1">ACARA / AGENDA</div>
                      <h3 className="text-lg font-black text-gray-800 leading-tight uppercase line-clamp-3">{item.acara}</h3>
                    </div>
                    <div className="grid grid-cols-2 gap-4 mt-2">
                       <div>
                          <div className="text-[10px] font-bold text-orange-500 uppercase tracking-widest mb-1">TEMPAT</div>
                          <div className="text-sm font-black text-gray-700 uppercase">{item.tempat}</div>
                       </div>
                       <div>
                          <div className="text-[10px] font-bold text-orange-500 uppercase tracking-widest mb-1">PELAKSANA</div>
                          <div className="text-sm font-black text-gray-700 uppercase">{item.pelaksana}</div>
                       </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : currentSlide?.type === 'CERTIFICATE' ? (
            <div className="h-full flex flex-col gap-6 p-4 animate-in fade-in slide-in-from-bottom-4 duration-500">
               <div className="flex-1 flex items-center justify-center overflow-hidden">
                  <img src={currentSlide.data.foto} alt="Sertifikat" className="max-w-full max-h-full w-auto h-auto object-contain rounded-2xl shadow-2xl border-4 border-white" />
               </div>
               <div className="bg-white rounded-[2rem] p-8 shadow-xl border border-gray-100 text-center flex flex-col items-center">
                  <span className="px-4 py-1.5 bg-yellow-500 text-white text-xs font-black rounded-lg mb-4 uppercase tracking-widest shadow-lg shadow-yellow-100">Penghargaan</span>
                  <h2 className="text-3xl font-black text-gray-900 leading-tight uppercase mb-4">{currentSlide.data.nama_penerima}</h2>
                  <div className="w-12 h-1 bg-orange-500 rounded-full mb-4"></div>
                  <p className="text-xl font-bold text-orange-500 uppercase tracking-wider mb-2">{currentSlide.data.penghargaan}</p>
                  <p className="text-sm font-medium text-gray-400 uppercase">Terbit: <span className="font-black text-gray-600 ml-1">{currentSlide.data.tanggal}</span></p>
               </div>
            </div>
          ) : null}
        </div>
      </div>
    </div>
  )
}
