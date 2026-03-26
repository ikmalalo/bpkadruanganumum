export default function ServiceHeader() {
  return (
    <div className="flex flex-col items-center text-center mt-12 md:mt-24 px-4 overflow-hidden">
      <p className="text-[10px] md:text-sm tracking-[0.3em] text-gray-500 uppercase font-bold mb-4 drop-shadow-sm">
        SELAMAT DATANG DI PORTAL RESMI
      </p>
      <h1 className="text-3xl md:text-7xl font-black text-gray-900 mb-6 tracking-tight leading-tight">
        Pilih <span className="text-orange-500">Akses Layanan</span> Anda
      </h1>
      <p className="text-sm md:text-xl text-gray-400 max-w-2xl leading-relaxed font-medium">
        Silakan pilih kategori pengguna untuk melanjutkan akses ke sistem<br className="hidden md:block" /> 
        informasi dan pelayanan publik pemerintah kota Samarinda.
      </p>
    </div>
  )
}