import ServiceCard from "./ServiceCard"
import { useNavigate } from "react-router-dom"

export default function ServiceContainer() {

  const navigate = useNavigate()

  return (
    <div className="flex gap-10 mt-16">

      <div className="w-[420px]">
        <ServiceCard
          title="Peminjaman Ruangan"
          description="Sistem pengelola jadwal dan reservasi fasilitas ruangan."
          icon="🏛"
          color="bg-blue-100 text-blue-600"
          onClick={() => navigate("/rooms")}
        />
      </div>

      <div className="w-[420px]">
        <ServiceCard
          title="Kenaikan Gaji"
          description="Sistem informasi penggajian pegawai BPKAD."
          icon="$"
          color="bg-green-100 text-green-600"
          onClick={() => navigate("/payroll")}
        />
      </div>

    </div>
  )
}