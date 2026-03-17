interface Props {
  show: boolean
  message: string
}

export default function Toast({ show, message }: Props) {

  if (!show) return null

  return (
    <div className="
      fixed
      bottom-6
      right-6
      z-[9999]
      bg-green-500
      text-white
      px-5
      py-3
      rounded-lg
      shadow-lg
      flex
      items-center
      gap-2
      animate-[slideUp_.35s_ease]
    ">

      <span className="text-lg">✓</span>

      <p className="text-sm font-semibold">
        {message}
      </p>

    </div>
  )
}