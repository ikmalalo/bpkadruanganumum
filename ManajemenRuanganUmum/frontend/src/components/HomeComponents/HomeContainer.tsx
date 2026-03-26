import HomeCard from "./HomeCard"
import { useNavigate } from "react-router-dom"
import { User, ShieldCheck, Lock, ArrowRight } from "lucide-react"

export default function HomeContainer() {
  const navigate = useNavigate()

  return (
    <div className="flex flex-col md:flex-row flex-wrap justify-center gap-10 mt-16 w-full max-w-7xl mx-auto px-6 pb-20">

      <div className="w-full md:w-[500px] h-full flex items-stretch">
        <HomeCard
          badge="Akses Publik"
          badgeColor="bg-blue-50 text-blue-600"
          title="Pengunjung"
          description="Akses cepat untuk melihat agenda dan jadwal penggunaan ruangan rapat secara real-time melalui panel informasi."
          Icon={User}
          buttonText="Mulai Akses"
          buttonIcon={ArrowRight}
          onClick={() => navigate("/preview")}
          delay="delay-[800ms]"
        />
      </div>

      <div className="w-full md:w-[500px] h-full flex items-stretch">
        <HomeCard
          badge="Internal Staf"
          badgeColor="bg-orange-50 text-orange-600"
          title="Administrator"
          description="Masuk ke dashboard manajemen BPKAD untuk mengelola reservasi, jadwal, dan inventaris ruangan."
          Icon={ShieldCheck}
          buttonText="Login Sistem"
          buttonIcon={Lock}
          onClick={() => navigate("/login")}
          delay="delay-[1000ms]"
        />
      </div>

    </div>
  )
}
