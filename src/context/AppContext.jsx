import { createContext, useState, useEffect } from "react";
import Loading from "../components/Loading";

export const AppContext = createContext()

export function AppContextProvider ({children}){

    const [loggedUserId, setLoggedUserId] = useState(null)
    const [loggedUserName, setLoggedUserName] = useState(null)
    const [loggedUserMustResetPass, setLoggedUserMustResetPass] = useState(false)
    const [loading, setLoading] = useState(true);
    useEffect(()=>{
            async function getLoggedUserId(){
            try {
                const isonline = await fetch('https://mycarcollectionapi.onrender.com/api/sessions/online', {method: 'POST', credentials:'include'})
                if(isonline.status==200){
                    const userIdUrl = 'https://mycarcollectionapi.onrender.com/api/sessions/whoIsOnline'
                    const opts = {method: 'POST', credentials: 'include'}
                    const response = await fetch(userIdUrl, opts)
                    const responseData = await response.json()
                    setLoggedUserMustResetPass(responseData.mustResetPass)
                    
                    if(loggedUserMustResetPass){ 
                        //aca sweetalert con link
                    }else{
                        setLoggedUserId(responseData.userId)
                        setLoggedUserName(responseData.userName)
    
                    }
                }            
            }
            catch (error) {
                setLoggedUserId(null)
            } finally{
                setLoading(false)
            }
            }
            getLoggedUserId()
        },[])

        if(loading){
            return <Loading />
        }

    return(
        <AppContext.Provider value={{
            loggedUserId, setLoggedUserId, loggedUserName, setLoggedUserName
        }}
        >
            {children}
        </AppContext.Provider>
    )
}