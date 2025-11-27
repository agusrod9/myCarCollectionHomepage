import { useEffect } from "react";

//interval = 119000 -> algo menos de 2 minutos
const API_BASEURL = import.meta.env.VITE_API_BASEURL;

export default function useActivityPing(intervalMs = 119000){
    useEffect(()=>{
        const interval = setInterval(() => {
            fetch(`${API_BASEURL}/api/users/activity/ping`, {
                method: "POST",
                credentials: "include"
            }).then((res)=>{
                if(res.status===401){
                    clearInterval(interval);
                }
            }).catch(()=>{/*EVITO REVIENTE SI DA ERROR SOLAMENTE*/})
        }, intervalMs);
        return () => clearInterval(interval);
    },[intervalMs])
}