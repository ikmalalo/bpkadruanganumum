import type { LucideIcon } from "lucide-react"

interface Props {
  title: string
  description: string
  Icon: LucideIcon
  badge: string
  badgeColor: string
  buttonText: string
  buttonIcon?: LucideIcon
  onClick?: () => void
  delay?: string
}

export default function HomeCard({ 
  title, 
  description, 
  Icon, 
  badge, 
  badgeColor, 
  buttonText, 
  buttonIcon: ButtonIcon,
  onClick,
  delay = "delay-0"
}: Props) {
  return (
    <div className={`bg-white rounded-3xl p-10 shadow-xl border border-gray-100 flex flex-col h-full relative overflow-hidden group hover:shadow-2xl hover:shadow-orange-500/10 transition-all duration-300 animate-in fade-in slide-in-from-bottom-10 fill-mode-both ${delay}`}>
      
      {/* Subtle Bottom Accent Line */}
      <div className="absolute bottom-0 left-0 right-0 h-1 bg-[#ff6b00]/10" />
      
      {/* Badge and Icon */}
      <div className="flex justify-between items-center mb-10 relative z-10 w-full">
        <span className={`${badgeColor} text-[10px] font-black tracking-[0.2em] px-4 py-1.5 rounded-full uppercase border border-black/5`}>
          {badge}
        </span>
        <div className="w-14 h-14 bg-gray-50 rounded-2xl border border-gray-100 flex items-center justify-center text-[#ff6b00] group-hover:scale-105 group-hover:rotate-3 transition-transform duration-300">
          <Icon size={26} strokeWidth={1.5} />
        </div>
      </div>

      {/* Content */}
      <div className="flex-grow mb-12 relative z-10 w-full">
        <h2 className="text-3xl font-black text-[#111827] mb-4 tracking-tight group-hover:text-[#ff6b00] transition-colors">
          {title}
        </h2>
        <div className="w-10 h-0.5 bg-[#ff6b00] mb-6 rounded-full opacity-40 group-hover:opacity-100 group-hover:w-16 transition-all duration-300" />
        <p className="text-gray-500 text-sm md:text-base leading-relaxed max-w-[320px] transition-colors group-hover:text-gray-900">
          {description}
        </p>
      </div>

      {/* Button */}
      <button 
        onClick={onClick}
        className="w-full bg-[#111827] hover:bg-[#ff6b00] text-white font-black py-5 px-8 rounded-xl flex items-center justify-center gap-4 transition-all duration-300 shadow-lg hover:shadow-orange-500/20 active:scale-95"
      >
        <span className="tracking-tight uppercase text-xs font-bold">{buttonText}</span>
        {ButtonIcon && <ButtonIcon size={18} />}
      </button>
      
    </div>
  )
}
