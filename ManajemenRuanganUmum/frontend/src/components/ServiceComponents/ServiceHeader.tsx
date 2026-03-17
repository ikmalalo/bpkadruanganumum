import logo from "../../assets/images/logo.png"

export default function ServiceHeader() {
  return (
    <div className="mt-10 flex items-center gap-4">
      <img src={logo} className="w-100" />
    </div>
  )
}