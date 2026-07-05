import { useEffect } from "react";

export default function RedirectToApp(){

    const MODE = import.meta.env.VITE_MODE

    useEffect(()=>{
        MODE === 'development' ?
            window.location.href = 'http://app.dev.thediecaster.com:5173'
            :
            window.location.href = 'https://app.thediecaster.com'
    },[])
    
    return null;
}