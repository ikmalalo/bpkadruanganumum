export default function ServiceFooter() {
  return (
    <div className="mt-auto w-full max-w-7xl mx-auto px-10 py-12 flex flex-col md:flex-row justify-between items-center border-t border-gray-100/50">
      <div className="mb-6 md:mb-0">
        <span className="text-gray-400 font-bold tracking-tight text-sm uppercase">
          BPKAD Kota Samarinda
        </span>
      </div>
      <div className="flex items-center gap-12">
        <button className="text-[11px] font-black tracking-[0.2em] text-orange-500 hover:text-orange-600 transition-colors uppercase">
          PANDUAN PENGGUNA
        </button>
        <div className="h-4 w-[1px] bg-gray-200 hidden md:block"></div>
        <button className="text-[11px] font-black tracking-[0.2em] text-orange-500 hover:text-orange-600 transition-colors uppercase">
          HUBUNGI KAMI
        </button>
      </div>
    </div>
  )
}