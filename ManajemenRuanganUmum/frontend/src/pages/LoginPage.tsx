import LoginForm from "../components/LoginComponents/LoginForm"
import LoginInfo from "../components/LoginComponents/LoginInfo"
import "../index.css"

export default function LoginPage() {
  return (
    <div className="min-h-screen flex flex-col md:flex-row">

      <div className="w-full md:w-1/2 flex items-center justify-center bg-gray-100 p-6 md:p-0">
        <LoginForm />
      </div>

      <div className="hidden md:block">
        <LoginInfo />
      </div>

    </div>
  )
}