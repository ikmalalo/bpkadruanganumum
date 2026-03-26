import HomeCard from "./HomeCard"
import { useNavigate } from "react-router-dom"
import { User, ShieldCheck, Lock, ArrowRight } from "lucide-react"

export default function HomeContainer() {
  const navigate = useNavigate()

  return (
    <div className="flex flex-col md:flex-row flex-wrap justify-center gap-10 mt-16 w-full max-w-6xl mx-auto px-4 pb-20">

      <div className="w-full md:w-[480px]">
        <HomeCard
          badge="Publik"
          badgeColor="bg-orange-100 text-[#ff6b00]"
          title="Pengunjung"
          description="Akses informasi publik dan layanan umum tanpa perlu autentikasi khusus untuk melihat transparansi anggaran."
          Icon={User}
          buttonText="Mulai Akses"
          buttonIcon={ArrowRight}
          onClick={() => navigate("/rooms")}
        />
      </div>

      <div className="w-full md:w-[480px]">
        <HomeCard
          badge="Internal"
          badgeColor="bg-orange-100 text-[#ff6b00]"
          title="Administrator"
          description="Login khusus staf internal BPKAD untuk mengelola data keuangan dan aset daerah kota Samarinda."
          Icon={ShieldCheck}
          buttonText="Login Petugas"
          buttonIcon={Lock}
          onClick={() => navigate("/login")}
        />
      </div>

    </div>
  )
}
