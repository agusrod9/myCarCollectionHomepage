import { useEffect } from "react";
//interval = 119000 -> algo menos de 2 minutos
const API_BASEURL = import.meta.env.VITE_API_BASEURL;
export default function useActivityPing(intervalMs = 119000){
    useEffect(()=>{
        const interval = setInterval(() => {
            fetch(`${API_BASEURL}/api/activity/ping`, {
                method: "POST",
                credentials: "include"
            })
        }, intervalMs);
    },[intervalMs])
}