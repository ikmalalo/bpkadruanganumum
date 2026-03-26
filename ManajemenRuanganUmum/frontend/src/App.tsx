import { Routes, Route } from "react-router-dom"
import LoginPage from "./pages/LoginPage"
import ServiceSelect from "./pages/ServiceSelect"
import RoomDashboard from "./pages/RoomDashboard"
import Peminjaman from "./pages/Peminjaman"
import KonfirmasiPeminjaman from "./pages/KonfirmasiPeminjaman"
import Preview from "./pages/Preview"
import PreviewHorizontal from "./pages/PreviewHorizontal"
import PreviewVertikal from "./pages/PreviewVertikal"
import Riwayat from "./pages/Riwayat"
import UploadSertifikat from "./pages/UploadSertifikat"
import LoadingScreen from "./components/LoadingScreen"
import DashboardLayout from "./components/DashboardComponents/DashboardLayout"
import { useState, useEffect } from "react"

export default function App() {
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false)
    }, 3000)

    return () => clearTimeout(timer)
  }, [])

  if (loading) {
    return <LoadingScreen />
  }

  return (
    <Routes>
      <Route path="/" element={<ServiceSelect />} />
      <Route path="/login" element={<LoginPage />} />
      <Route element={<DashboardLayout />}>
        <Route path="/rooms" element={<RoomDashboard />} />
        <Route path="/peminjaman" element={<Peminjaman />} />
        <Route path="/preview" element={<Preview />} />
        <Route path="/riwayat" element={<Riwayat />} />
        <Route path="/upload-sertifikat" element={<UploadSertifikat />} />
        <Route path="/konfirmasipeminjaman" element={<KonfirmasiPeminjaman />} />
      </Route>
      <Route path="/preview-horizontal" element={<PreviewHorizontal />} />
      <Route path="/preview-vertikal" element={<PreviewVertikal />} />
    </Routes>
  )
}