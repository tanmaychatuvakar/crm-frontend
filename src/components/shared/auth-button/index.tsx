import { css } from "@/utils"
import { FaArrowRight } from "react-icons/fa6"
import { TailSpin } from "react-loader-spinner"
import { AuthButtonProps } from "./props"

export const AuthButton:React.FC<AuthButtonProps> = ({isLoading, className, ...rest})=>{
    return (
        <button {...rest} className={css("font-medium inline-flex items-center justify-between w-full bg-[#6BB8F2] border border-[#6BB8F2] text-white py-2.5 px-5", className)}>
            <span>Log In</span>
            {isLoading ? <TailSpin color="white" width={20} height={20} /> : <span> <FaArrowRight size={16} /> </span>} 
        </button>
    )
}