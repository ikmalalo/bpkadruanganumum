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
    <div className={`bg-white rounded-3xl p-6 md:p-8 lg:p-10 shadow-xl border border-gray-100 flex flex-col h-full relative overflow-hidden group hover:shadow-2xl hover:shadow-orange-500/10 transition-all duration-300 animate-in fade-in slide-in-from-bottom-10 fill-mode-both ${delay}`}>
      
      {/* Subtle Bottom Accent Line */}
      <div className="absolute bottom-0 left-0 right-0 h-1 bg-[#ff6b00]/10" />
      
      {/* Badge and Icon */}
      <div className="flex justify-between items-center mb-6 md:mb-8 relative z-10 w-full">
        <span className={`${badgeColor} text-[8px] md:text-[10px] font-black tracking-[0.2em] px-3 py-1 md:px-4 md:py-1.5 rounded-full uppercase border border-black/5`}>
          {badge}
        </span>
        <div className="w-10 h-10 md:w-12 md:h-12 lg:w-14 lg:h-14 bg-gray-50 rounded-xl border border-gray-100 flex items-center justify-center text-[#ff6b00] group-hover:scale-105 group-hover:rotate-3 transition-transform duration-300">
          <Icon size={20} className="md:size-[24px]" strokeWidth={1.5} />
        </div>
      </div>

      {/* Content */}
      <div className="flex-grow mb-8 md:mb-10 relative z-10 w-full">
        <h2 className="text-xl md:text-2xl lg:text-3xl font-black text-[#111827] mb-3 tracking-tight group-hover:text-[#ff6b00] transition-colors leading-tight">
          {title}
        </h2>
        <div className="w-8 h-0.5 bg-[#ff6b00] mb-4 rounded-full opacity-40 group-hover:opacity-100 group-hover:w-12 transition-all duration-300" />
        <p className="text-gray-500 text-xs md:text-sm lg:text-base leading-relaxed max-w-[280px] transition-colors group-hover:text-gray-900 line-clamp-2 md:line-clamp-none">
          {description}
        </p>
      </div>

      {/* Button */}
      <button 
        onClick={onClick}
        className="w-full bg-[#111827] hover:bg-[#ff6b00] text-white font-black py-4 md:py-5 px-6 rounded-xl flex items-center justify-center gap-3 transition-all duration-300 shadow-lg hover:shadow-orange-500/20 active:scale-95"
      >
        <span className="tracking-tight uppercase text-[9px] md:text-xs font-bold">{buttonText}</span>
        {ButtonIcon && <ButtonIcon size={16} />}
      </button>
      
    </div>
  )
}
