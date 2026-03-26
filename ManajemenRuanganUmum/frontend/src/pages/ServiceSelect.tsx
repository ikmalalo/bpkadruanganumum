import ServiceHeader from "../components/ServiceComponents/ServiceHeader"
import ServiceContainer from "../components/ServiceComponents/ServiceContainer"
import ServiceFooter from "../components/ServiceComponents/ServiceFooter"
import "../index.css"

export default function ServiceSelect() {
  return (
    <div className="min-h-screen bg-white flex flex-col items-center px-6 md:px-0 relative overflow-hidden">
      {/* Subtle Background Elements */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[600px] bg-gradient-to-b from-orange-50/20 to-transparent rounded-full blur-3xl -z-10 animate-pulse"></div>
      
      <div className="flex-grow flex flex-col items-center w-full">
        <ServiceHeader />
        <ServiceContainer />
      </div>

      <ServiceFooter />

      {/* Subtle Bottom Accent */}
      <div className="absolute bottom-0 left-0 w-full h-[6px] bg-gradient-to-r from-orange-100 via-orange-500 to-orange-100 opacity-20"></div>
    </div>
  )
}