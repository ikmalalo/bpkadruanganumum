import type { ReactNode } from "react"
import { ArrowRight } from "lucide-react"

interface Props {
  tag: string
  title: string
  description: string
  icon: ReactNode
  buttonText: string
  onClick?: () => void
}

export default function ServiceCard({ tag, title, description, icon, buttonText, onClick }: Props) {
  return (
    <div className="bg-white rounded-[40px] p-8 md:p-10 shadow-[0_20px_60px_-15px_rgba(0,0,0,0.05)] border border-gray-50 flex flex-col h-full transition-all duration-500 hover:shadow-[0_40px_80px_-20px_rgba(0,0,0,0.08)] hover:-translate-y-2 group">
      
      <div className="flex justify-between items-start mb-6">
        <span className="bg-orange-100 text-orange-600 text-[10px] font-black tracking-[0.2em] px-4 py-1.5 rounded-full uppercase">
          {tag}
        </span>
        <div className="w-12 h-12 bg-gray-50 rounded-2xl flex items-center justify-center text-orange-500 group-hover:bg-orange-500 group-hover:text-white transition-colors duration-500 shadow-sm">
          {icon}
        </div>
      </div>

      <div className="flex-grow">
        <h2 className="text-2xl md:text-3xl font-light text-gray-800 mb-4 tracking-tight">
          {title}
        </h2>
        <p className="text-gray-400 text-sm md:text-lg leading-relaxed mb-4 max-w-[280px]">
          {description}
        </p>
      </div>

      <button
        onClick={onClick}
        className="w-full bg-orange-500 hover:bg-orange-600 text-white font-bold py-5 px-8 rounded-3xl flex items-center justify-center gap-3 transition-all duration-300 shadow-[0_10px_30px_-5px_rgba(249,115,22,0.4)] hover:shadow-[0_15px_40px_-5px_rgba(249,115,22,0.5)] active:scale-[0.98]"
      >
        <span className="text-lg">{buttonText}</span>
        {buttonText.includes("Login") ? <span className="opacity-80">🔒</span> : <ArrowRight className="w-5 h-5" />}
      </button>

    </div>
  )
}