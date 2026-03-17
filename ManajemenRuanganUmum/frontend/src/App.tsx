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
import DashboardLayout from "./components/DashboardComponents/DashboardLayout"

export default function App() {
  return (
    <Routes>

      <Route path="/" element={<LoginPage />} />

      <Route path="/services" element={<ServiceSelect />} />

      <Route element={<DashboardLayout />}>
        <Route path="/rooms" element={<RoomDashboard />} />
        <Route path="/peminjaman" element={<Peminjaman />} />
        <Route path="/preview" element={<Preview />} />
        <Route path="/riwayat" element={<Riwayat />} />
        <Route path="/konfirmasipeminjaman" element={<KonfirmasiPeminjaman />} />
      </Route>

      <Route path="/preview-horizontal" element={<PreviewHorizontal />} />
      <Route path="/preview-vertikal" element={<PreviewVertikal />} />

    </Routes>
  )
}