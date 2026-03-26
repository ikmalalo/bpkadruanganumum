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
    <div className={`bg-white/80 backdrop-blur-xl rounded-[3rem] p-10 shadow-[0_20px_60px_-15px_rgba(0,0,0,0.08)] border border-white/50 flex flex-col h-full relative overflow-hidden group hover:shadow-[0_40px_100px_-20px_rgba(255,107,0,0.15)] transition-all duration-700 animate-in fade-in slide-in-from-bottom-12 fill-mode-both ${delay}`}>
      
      {/* Hover Background Accent */}
      <div className="absolute top-0 right-0 w-32 h-32 bg-orange-500/5 rounded-full blur-3xl group-hover:bg-orange-500/10 transition-colors duration-700" />
      
      {/* Badge and Icon */}
      <div className="flex justify-between items-start mb-10 relative z-10">
        <span className={`${badgeColor} text-[10px] font-black tracking-widest px-5 py-2 rounded-full uppercase shadow-sm`}>
          {badge}
        </span>
        <div className="w-20 h-20 bg-white rounded-[2rem] shadow-sm border border-gray-50 flex items-center justify-center text-[#ff6b00] group-hover:scale-110 group-hover:rotate-6 transition-all duration-500 ease-out">
          <Icon size={36} strokeWidth={1.5} className="group-hover:animate-bounce-subtle" />
        </div>
      </div>

      {/* Content */}
      <div className="flex-grow mb-12 relative z-10">
        <h2 className="text-4xl md:text-5xl font-extrabold text-[#1e1e1e] mb-5 tracking-tight group-hover:text-[#ff6b00] transition-colors duration-500">
          {title}
        </h2>
        <p className="text-[#1e1e1e] opacity-40 text-sm md:text-base leading-relaxed max-w-[300px] group-hover:opacity-60 transition-opacity duration-500">
          {description}
        </p>
      </div>

      {/* Button */}
      <button 
        onClick={onClick}
        className="w-full bg-[#ff6b00] hover:bg-[#111827] text-white font-black py-6 px-8 rounded-2xl flex items-center justify-center gap-4 transition-all duration-500 shadow-[0_15px_35px_-5px_rgba(255,107,0,0.4)] hover:shadow-gray-900/40 hover:-translate-y-1 relative z-10 overflow-hidden"
      >
        <span className="tracking-tight">{buttonText}</span>
        {ButtonIcon && <ButtonIcon size={22} className="group-hover:translate-x-1 transition-transform" />}
      </button>
      
    </div>
  )
}
