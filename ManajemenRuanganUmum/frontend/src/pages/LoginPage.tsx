import LoginForm from "../components/LoginComponents/LoginForm"
import LoginInfo from "../components/LoginComponents/LoginInfo"
import "../index.css"

export default function LoginPage() {
  return (
    <div className="min-h-screen flex">

      <div className="w-1/2 flex items-center justify-center bg-gray-100">
        <LoginForm />
      </div>

      <LoginInfo />

    </div>
  )
}