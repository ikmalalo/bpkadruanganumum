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
    <div className={`bg-white/90 backdrop-blur-2xl rounded-[2.5rem] p-12 shadow-[0_20px_80px_-20px_rgba(0,0,0,0.1)] border border-white/60 flex flex-col h-full relative overflow-hidden group hover:shadow-[0_45px_110px_-25px_rgba(255,107,0,0.2)] transition-all duration-700 animate-in fade-in slide-in-from-bottom-12 fill-mode-both ${delay}`}>
      
      {/* Subtle Top Shine/Highlight */}
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/80 to-transparent pointer-events-none" />
      
      {/* Badge and Icon */}
      <div className="flex justify-between items-center mb-12 relative z-10">
        <span className={`${badgeColor} text-[10px] font-black tracking-[0.2em] px-5 py-2 rounded-full uppercase shadow-sm border border-black/5`}>
          {badge}
        </span>
        <div className="w-16 h-16 bg-gray-50/50 rounded-2xl border border-gray-100 flex items-center justify-center text-[#ff6b00] group-hover:scale-110 group-hover:rotate-6 transition-all duration-500 ease-out shadow-inner">
          <Icon size={30} strokeWidth={1.5} className="group-hover:animate-bounce-subtle" />
        </div>
      </div>

      {/* Content */}
      <div className="flex-grow mb-14 relative z-10 w-full">
        <h2 className="text-3xl md:text-4xl font-black text-[#111827] mb-5 tracking-tight group-hover:text-[#ff6b00] transition-colors duration-500 leading-tight">
          {title}
        </h2>
        <div className="w-12 h-1 bg-[#ff6b00] mb-6 rounded-full opacity-30 group-hover:opacity-100 group-hover:w-20 transition-all duration-500" />
        <p className="text-[#111827] opacity-40 text-sm md:text-base leading-relaxed max-w-[320px] group-hover:opacity-60 transition-opacity duration-500 group-hover:text-black">
          {description}
        </p>
      </div>

      {/* Button */}
      <button 
        onClick={onClick}
        className="w-full bg-[#111827] hover:bg-[#ff6b00] text-white font-black py-6 px-8 rounded-2xl flex items-center justify-center gap-4 transition-all duration-500 shadow-xl hover:shadow-orange-500/30 hover:-translate-y-1 relative z-10 group/btn"
      >
        <span className="tracking-tight uppercase text-xs">{buttonText}</span>
        {ButtonIcon && <ButtonIcon size={20} className="group-hover/btn:translate-x-1 transition-transform" />}
      </button>
      
    </div>
  )
}
