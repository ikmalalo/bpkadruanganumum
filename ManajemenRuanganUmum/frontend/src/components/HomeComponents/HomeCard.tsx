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
}

export default function HomeCard({ 
  title, 
  description, 
  Icon, 
  badge, 
  badgeColor, 
  buttonText, 
  buttonIcon: ButtonIcon,
  onClick 
}: Props) {
  return (
    <div className="bg-white rounded-[2.5rem] p-10 shadow-[0_20px_60px_-15px_rgba(0,0,0,0.08)] border border-gray-50 flex flex-col h-full relative overflow-hidden group hover:shadow-[0_40px_80px_-20px_rgba(0,0,0,0.12)] transition-all duration-500">
      
      {/* Badge and Icon */}
      <div className="flex justify-between items-start mb-8">
        <span className={`${badgeColor} text-[10px] font-black tracking-widest px-4 py-1.5 rounded-full uppercase`}>
          {badge}
        </span>
        <div className="w-16 h-16 bg-gray-50 rounded-2xl flex items-center justify-center text-[#ff6b00]">
          <Icon size={32} strokeWidth={1.5} />
        </div>
      </div>

      {/* Content */}
      <div className="flex-grow mb-10">
        <h2 className="text-4xl font-light text-[#1e1e1e] opacity-90 mb-4 tracking-tight">
          {title}
        </h2>
        <p className="text-[#1e1e1e] opacity-40 text-sm leading-relaxed max-w-[280px]">
          {description}
        </p>
      </div>

      {/* Button */}
      <button 
        onClick={onClick}
        className="w-full bg-[#ff6b00] hover:bg-[#e66000] text-white font-bold py-5 px-8 rounded-full flex items-center justify-center gap-3 transition-all duration-300 shadow-[0_10px_30px_-5px_rgba(255,107,0,0.3)] hover:scale-[1.02] active:scale-[0.98]"
      >
        <span>{buttonText}</span>
        {ButtonIcon && <ButtonIcon size={20} />}
      </button>
      
    </div>
  )
}
