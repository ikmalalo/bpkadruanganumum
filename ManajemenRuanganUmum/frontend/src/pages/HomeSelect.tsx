import HomeHeader from "../components/HomeComponents/HomeHeader"
import HomeContainer from "../components/HomeComponents/HomeContainer"
import HomeFooter from "../components/HomeComponents/HomeFooter"
import HomeBackground from "../components/HomeComponents/HomeBackground"
import "../index.css"

export default function HomeSelect() {
  return (
    <div className="min-h-screen bg-white flex flex-col items-center relative overflow-hidden">
      
      {/* Premium Animated Background */}
      <HomeBackground />

      {/* Main Content with Entrance Animation */}
      <div className="relative z-10 w-full flex flex-col items-center animate-in fade-in slide-in-from-bottom-8 duration-1000 ease-out fill-mode-forwards">
        <HomeHeader />
        <HomeContainer />
        <HomeFooter />
      </div>

    </div>
  )
}
