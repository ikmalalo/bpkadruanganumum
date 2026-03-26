import ServiceCard from "./ServiceCard"
import { useNavigate } from "react-router-dom"
import { User, ShieldCheck } from "lucide-react"

export default function ServiceContainer() {
  const navigate = useNavigate()

  return (
    <div className="flex flex-col md:flex-row items-stretch justify-center gap-8 md:gap-14 mt-16 md:mt-24 w-full max-w-7xl mx-auto px-6 pb-20">

      <div className="w-full md:w-[500px]">
        <ServiceCard
          tag="PUBLIK"
          title="Pengunjung"
          description="Akses informasi publik dan layanan umum tanpa perlu autentikasi khusus untuk melihat transparansi anggaran."
          icon={<User className="w-8 h-8" />}
          buttonText="Mulai Akses"
          onClick={() => navigate("/preview-horizontal")} // Assuming public goes to preview
        />
      </div>

      <div className="w-full md:w-[500px]">
        <ServiceCard
          tag="INTERNAL"
          title="Administrator"
          description="Login khusus staf internal BPKAD untuk mengelola data keuangan dan aset daerah kota Samarinda."
          icon={<ShieldCheck className="w-8 h-8" />}
          buttonText="Login Petugas"
          onClick={() => navigate("/login")}
        />
      </div>

    </div>
  )
}