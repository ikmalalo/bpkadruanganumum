import "../index.css"
import { useState, useRef } from "react"
import { useNavigate } from "react-router-dom"
import { format } from "date-fns"
import { id } from "date-fns/locale"
import { 
  Award, 
  User, 
  Image as ImageIcon, 
  ArrowLeft, 
  Upload,
  CheckCircle2,
  Calendar
} from "lucide-react"

import SectionHeader from "../components/PeminjamanComponents/SectionHeader"
import FormField from "../components/PeminjamanComponents/FormField"
import RadioCard from "../components/PeminjamanComponents/RadioCard"

const inputClass = "w-full px-3 py-2 border border-gray-300 rounded-lg text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-orange-400 transition"

export default function UploadSertifikat() {
  const navigate = useNavigate()
  const [form, setForm] = useState({
    namaPenerima: "",
    penghargaan: "ASN TERBAIK",
    foto: null as File | null
  })

  const [preview, setPreview] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleChange = (field: string, value: any) => {
    setForm(prev => ({ ...prev, [field]: value }))
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setForm(prev => ({ ...prev, foto: file }))
      const reader = new FileReader()
      reader.onloadend = () => {
        setPreview(reader.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  const handleSubmit = () => {
    // For now, just show a success message or navigate
    alert("Sertifikat berhasil diupload (Simulasi)")
    navigate("/riwayat")
  }

  return (
    <div className="flex flex-col pt-4">
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 px-8 py-7 space-y-8">
        
        {/* INFORMASI PENERIMA */}
        <section>
          <SectionHeader 
            icon={<User className="w-5 h-5" />} 
            title="Informasi Penerima" 
            divider={false} 
          />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <FormField label="Nama Penerima">
              <input 
                type="text" 
                className={inputClass}
                placeholder="Masukkan nama lengkap penerima"
                value={form.namaPenerima}
                onChange={(e) => handleChange("namaPenerima", e.target.value)}
              />
            </FormField>
            <FormField label="Tanggal Upload">
              <div className="relative">
                <input 
                  type="text" 
                  className={`${inputClass} bg-gray-50 cursor-not-allowed`}
                  value={format(new Date(), "dd MMMM yyyy", { locale: id })}
                  disabled
                />
                <Calendar size={16} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400" />
              </div>
            </FormField>
          </div>
        </section>

        {/* PENPENGHARGAAN */}
        <section>
          <SectionHeader 
            icon={<Award className="w-5 h-5" />} 
            title="Kategori Penghargaan" 
          />
          <div className="flex flex-col md:flex-row gap-3 mt-4">
            <RadioCard 
              label="ASN TERBAIK"
              description="Penghargaan untuk Aparatur Sipil Negara"
              selected={form.penghargaan === "ASN TERBAIK"}
              onClick={() => handleChange("penghargaan", "ASN TERBAIK")}
            />
            <RadioCard 
              label="PPPK Paruh Waktu Terbaik"
              description="Penghargaan untuk PPPK Paruh Waktu"
              selected={form.penghargaan === "PPPK Paruh Waktu Terbaik"}
              onClick={() => handleChange("penghargaan", "PPPK Paruh Waktu Terbaik")}
            />
          </div>
        </section>

        {/* LAMPIRAN FOTO */}
        <section>
          <SectionHeader 
            icon={<ImageIcon className="w-5 h-5" />} 
            title="Lampiran Foto Sertifikat" 
          />
          <div className="mt-4">
            <div 
              onClick={() => fileInputRef.current?.click()}
              className="border-2 border-dashed border-gray-300 rounded-xl p-8 flex flex-col items-center justify-center cursor-pointer hover:border-orange-400 hover:bg-orange-50 transition-all group"
            >
              <input 
                type="file" 
                ref={fileInputRef}
                className="hidden"
                accept="image/*"
                onChange={handleFileChange}
              />
              
              {preview ? (
                <div className="relative w-full max-w-md">
                  <img src={preview} alt="Preview" className="w-full h-auto rounded-lg shadow-md" />
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity rounded-lg">
                    <p className="text-white font-bold text-sm">Ganti Foto</p>
                  </div>
                </div>
              ) : (
                <div className="text-center">
                  <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:bg-orange-100 transition-colors">
                    <Upload className="text-gray-400 group-hover:text-orange-500 w-8 h-8" />
                  </div>
                  <p className="text-sm font-bold text-gray-700">Klik untuk Upload Foto</p>
                  <p className="text-xs text-gray-400 mt-1">PNG, JPG atau JPEG (Max. 5MB)</p>
                </div>
              )}
            </div>
          </div>
        </section>

        {/* ACTIONS */}
        <div className="flex justify-between pt-6 border-t border-gray-100">
          <button 
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 px-5 py-2 border-2 border-gray-200 text-gray-500 font-bold rounded-lg hover:bg-gray-50 transition"
          >
            <ArrowLeft size={18} />
            Batal
          </button>
          <button 
            onClick={handleSubmit}
            disabled={!form.namaPenerima || !form.foto}
            className={`
              flex items-center gap-2 px-8 py-2 font-bold rounded-lg shadow-lg transition-all
              ${(!form.namaPenerima || !form.foto) 
                ? "bg-gray-300 text-gray-500 cursor-not-allowed" 
                : "bg-orange-500 text-white hover:bg-orange-600 hover:scale-[1.02]"}
            `}
          >
            Simpan Sertifikat
            <CheckCircle2 size={18} />
          </button>
        </div>

      </div>
    </div>
  )
}
