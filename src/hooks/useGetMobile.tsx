import { useEffect, useState } from "react"

export const useGetMobile = () => {
    const [isMobile, setIsMobile] = useState(window.innerWidth < 768)
  
    useEffect(() => {
      function handleResize() {
        setIsMobile(window.innerWidth < 768)
      }
  
      window.addEventListener('resize', handleResize)
  
      // Clean up the event listener
      return () => {
        window.removeEventListener('resize', handleResize)
      }
    }, [])
  
    return {
      isMobile,
    }
  }