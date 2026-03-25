import LoginForm from "../components/LoginComponents/LoginForm"
import LoginInfo from "../components/LoginComponents/LoginInfo"
import "../index.css"

export default function LoginPage() {
  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-white">

      {/* LEFT SIDE: FORM (Full on mobile, 50% on desktop) */}
      <div className="w-full md:w-1/2 flex items-center justify-center p-6 md:p-12 relative overflow-hidden bg-gradient-to-br from-gray-50 to-white">
        
        {/* Subtle decorative background element */}
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-orange-50 rounded-full blur-[100px] opacity-60"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-blue-50 rounded-full blur-[100px] opacity-60"></div>
        
        <div className="relative z-10 w-full flex justify-center">
          <LoginForm />
        </div>
      </div>

      {/* RIGHT SIDE: INFO (Hidden on mobile, 50% on desktop) */}
      <LoginInfo />

    </div>
  )
}