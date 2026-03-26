import HomeHeader from "../components/HomeComponents/HomeHeader"
import HomeContainer from "../components/HomeComponents/HomeContainer"
import HomeFooter from "../components/HomeComponents/HomeFooter"
import "../index.css"

export default function HomeSelect() {
  return (
    <div className="min-h-screen bg-white flex flex-col items-center relative overflow-hidden">
      
      {/* Decorative background gradient */}
      <div className="absolute bottom-0 left-0 right-0 h-[30vh] bg-gradient-to-t from-orange-50/50 to-transparent pointer-events-none" />

      <HomeHeader />

      <HomeContainer />

      <HomeFooter />

    </div>
  )
}
