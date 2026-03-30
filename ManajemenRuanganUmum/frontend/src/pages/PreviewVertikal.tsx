import { useState, useEffect, useMemo, useRef } from "react"
import { useLocation } from "react-router-dom"

declare global {
  interface Window {
    VANTA: any;
    __SLIDE_COUNT__: number;
  }
}
import logo from "../assets/images/logo.png"
import { format } from "date-fns"
import { id } from "date-fns/locale"
import { ArrowLeft, ChevronLeft, ChevronRight, Video, Loader2, Download } from "lucide-react"
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

type SlideItem = { type: 'AGENDA'; data: AgendaItem[]; category: 'BPKAD' | 'PEMKOT' }

export default function PreviewVertikal() {
  const navigate = useNavigate()
  const location = useLocation()
  const isPuppet = new URLSearchParams(location.search).get('puppet') === '1'
  const isVisitor = sessionStorage.getItem('isVisitor') === 'true'
  const [time, setTime] = useState(new Date())
  const [allAgendas, setAllAgendas] = useState<AgendaItem[]>([])
  const [loading, setLoading] = useState(true)
  const [isRecording, setIsRecording] = useState(false)
  const [recordDone, setRecordDone] = useState(false)

  const vantaRef = useRef<HTMLDivElement>(null)
  const [vantaEffect, setVantaEffect] = useState<any>(null)

  useEffect(() => {
    if (!vantaEffect && vantaRef.current && window.VANTA) {
      try {
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
      } catch (error) {
        console.warn("Vanta.js failed to initialize:", error);
      }
    }
    return () => {
      if (vantaEffect) vantaEffect.destroy()
    }
  }, [vantaEffect])

  const fetchData = async () => {
    try {
      const resp = await fetch(apiUrl('/api/agendas'))
      const agendas = await resp.json()
      setAllAgendas(agendas)
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
  const SLIDE_DURATION = 15000

  const pages = useMemo(() => {
    const slides: SlideItem[] = []

    const bpkad = allAgendas.filter(item => item.type === "BPKAD")
    const pemkot = allAgendas.filter(item => item.type === "PEMKOT")

    const chunk = (arr: AgendaItem[], size: number, category: 'BPKAD' | 'PEMKOT') => {
      for (let i = 0; i < arr.length; i += size) {
        slides.push({ type: 'AGENDA', data: arr.slice(i, i + size), category })
      }
    }

    chunk(bpkad, itemsPerPageCount, 'BPKAD')
    chunk(pemkot, itemsPerPageCount, 'PEMKOT')

    return slides
  }, [allAgendas])

  // Expose slide count to window so Puppeteer can read it
  useEffect(() => {
    window.__SLIDE_COUNT__ = pages.length
  }, [pages.length])

  const [currentPage, setCurrentPage] = useState(0)
  const [progress, setProgress] = useState(0)
  const [touchStart, setTouchStart] = useState<number | null>(null)
  const [touchCurrent, setTouchCurrent] = useState<number | null>(null)
  const MIN_SWIPE_DISTANCE = 120

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
    setProgress(0);
  };

  const handleRecord = async () => {
    setIsRecording(true)
    setRecordDone(false)
    try {
      const frontendUrl = window.location.origin + '/preview-vertikal'
      // Tembak backend Railway (cloud) agar tidak usah jalan lokal
      const recordUrl = `${apiUrl('/api/record/portrait')}?url=${encodeURIComponent(frontendUrl)}&slideDuration=${SLIDE_DURATION}`

      const response = await fetch(recordUrl)
      if (!response.ok) {
        let errMsg = 'Unknown error'
        try { const err = await response.json(); errMsg = err.error || errMsg } catch {}
        alert('Gagal merekam: ' + errMsg)
        setIsRecording(false)
        return
      }

      // Terima video MP4 dari Cloud sebagai file dan simpan ke Downloads user
      const blob = await response.blob()
      const downloadUrl = window.URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = downloadUrl
      a.download = `Preview-Portrait-9-16.mp4`
      document.body.appendChild(a)
      a.click()
      a.remove()
      window.URL.revokeObjectURL(downloadUrl)

      setRecordDone(true)
      setTimeout(() => setRecordDone(false), 4000)
    } catch (e: any) {
      alert('Error: ' + e.message + '\n\nPerekaman butuh proses berat di server (sekitar 30-40 detik). Mohon ulangi jika gagal.')
    } finally {
      setIsRecording(false)
    }
  }

  const onTouchStart = (e: React.TouchEvent) => {
    setTouchStart(e.targetTouches[0].clientX)
    setTouchCurrent(e.targetTouches[0].clientX)
  }

  const onTouchMove = (e: React.TouchEvent) => {
    setTouchCurrent(e.targetTouches[0].clientX)
  }

  const onTouchEnd = (e: React.TouchEvent) => {
    if (!touchStart) return
    const touchEnd = e.changedTouches[0].clientX
    const distance = touchStart - touchEnd
    const isLeftSwipe = distance > MIN_SWIPE_DISTANCE
    const isRightSwipe = distance < -MIN_SWIPE_DISTANCE

    if (isLeftSwipe) {
      // Next Page
      setCurrentPage((prev) => (prev + 1) % pages.length)
      setProgress(0)
    } else if (isRightSwipe) {
      // Prev Page
      setCurrentPage((prev) => (prev - 1 + pages.length) % pages.length)
      setProgress(0)
    }

    setTouchStart(null)
    setTouchCurrent(null)
  }

  const currentSlide = pages[currentPage]

  const pageTitle = useMemo(() => {
    if (!currentSlide) return "AGENDA RUANG RAPAT"
    return `AGENDA RUANG RAPAT ${currentSlide.category}`
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
    <div 
      className="bg-white h-screen relative overflow-hidden flex flex-col"
      onTouchStart={onTouchStart}
      onTouchMove={onTouchMove}
      onTouchEnd={onTouchEnd}
    >
      {/* Vanta DOTS Background */}
      <div ref={vantaRef} className="absolute inset-0 z-0"></div>
      <div className="relative z-10 h-full flex flex-col">

      {/* Back button — hidden in puppet mode */}
      {!isPuppet && (
        <div className="fixed top-0 left-0 w-20 h-20 z-50 group flex items-start justify-start p-3">
          <button onClick={() => isVisitor ? navigate('/') : navigate('/preview')} className="bg-white p-2 rounded-full shadow-2xl border border-gray-100 text-orange-500 transition-all duration-300 opacity-0 group-hover:opacity-100 scale-75 group-hover:scale-100 active:scale-90">
            <ArrowLeft size={18} strokeWidth={3} />
          </button>
        </div>
      )}

      {/* Record button — hidden in puppet mode */}
      {!isPuppet && (
        <div className="fixed top-3 right-3 z-50">
          <button
            id="btn-record-portrait"
            onClick={handleRecord}
            disabled={isRecording || pages.length === 0}
            title="Rekam semua halaman sebagai MP4 Portrait 9:16"
            className={`flex items-center gap-2 px-4 py-2 rounded-full text-xs font-bold shadow-xl border transition-all duration-300
              ${
                recordDone
                  ? 'bg-green-500 border-green-400 text-white shadow-green-300/50 scale-95'
                  : isRecording
                  ? 'bg-orange-100 border-orange-300 text-orange-500 cursor-wait'
                  : pages.length === 0
                  ? 'bg-gray-100 border-gray-200 text-gray-400 cursor-not-allowed'
                  : 'bg-white border-orange-300 text-orange-500 hover:bg-orange-500 hover:text-white hover:border-orange-500 hover:shadow-orange-300/50'
              }`
            }
          >
            {isRecording ? (
              <><Loader2 size={14} className="animate-spin" /><span>Merekam...</span></>
            ) : recordDone ? (
              <><Download size={14} /><span>Tersimpan!</span></>
            ) : (
              <><Video size={14} /><span>Rekam MP4</span></>
            )}
          </button>
        </div>
      )}

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
              <div 
                key={i} 
                data-slide-dot={i}
                onClick={() => handlePageClick(i)}
                className={`w-1.5 h-1.5 rounded-full transition-all duration-300 cursor-pointer hover:scale-150 ${i === currentPage ? "bg-orange-500 scale-110 shadow-lg shadow-orange-200" : "bg-gray-300 shadow-sm"}`}
              ></div>
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
          ) : null}
        </div>
      </div>

      {/* Swipe Feedback Overlay (Dynamic Pull Only) */}
      {touchStart !== null && touchCurrent !== null ? (
        <div className="fixed inset-0 pointer-events-none flex items-center justify-center z-[100]">
          {/* Pulling Feedback */}
          {touchStart - touchCurrent > 20 && (
            <div 
              className="fixed right-0 bg-orange-500/10 text-orange-500 p-4 rounded-l-3xl backdrop-blur-sm transition-all duration-75 flex items-center justify-center border-l-2 border-y-2 border-orange-500/20"
              style={{ 
                opacity: Math.min((touchStart - touchCurrent) / 200, 0.8),
                transform: `translateX(${Math.max(40 - (touchStart - touchCurrent) / 4, 0)}px)`
              }}
            >
              <ChevronRight size={60} strokeWidth={4} />
            </div>
          )}
          {touchCurrent - touchStart > 20 && (
            <div 
              className="fixed left-0 bg-orange-500/10 text-orange-500 p-4 rounded-r-3xl backdrop-blur-sm transition-all duration-75 flex items-center justify-center border-r-2 border-y-2 border-orange-500/20"
              style={{ 
                opacity: Math.min((touchCurrent - touchStart) / 200, 0.8),
                transform: `translateX(${Math.min(-40 + (touchCurrent - touchStart) / 4, 0)}px)`
              }}
            >
              <ChevronLeft size={60} strokeWidth={4} />
            </div>
          )}
        </div>
      ) : null}
      </div>
    </div>
  )
}
