export default function HomeHeader() {
  return (
    <div className="mt-16 text-center max-w-2xl px-4">
      <p className="text-xs md:text-sm font-bold tracking-widest text-[#1e1e1e] opacity-80 mb-2 uppercase text-center w-full">
        Selamat Datang di Portal Resmi
      </p>
      
      <h1 className="text-4xl md:text-5xl font-extrabold text-[#111827] mb-6 tracking-tight">
        Pilih <span className="text-[#ff6b00]">Akses Layanan</span> Anda
      </h1>
      
      <p className="text-sm md:text-base text-gray-500 leading-relaxed max-w-xl mx-auto">
        Silakan pilih kategori pengguna untuk melanjutkan akses ke sistem 
        informasi dan pelayanan publik pemerintah kota Samarinda.
      </p>
    </div>
  )
}
