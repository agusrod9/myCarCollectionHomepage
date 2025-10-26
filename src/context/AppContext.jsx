import { createContext, useState, useEffect } from "react";
import Loading from "../components/Loading";

export const AppContext = createContext()

export function AppContextProvider ({children}){

    const [loggedUserId, setLoggedUserId] = useState(null)
    const [loggedUserName, setLoggedUserName] = useState(null)
    const [loggedUserFirstName, setLoggedUserFirstName] = useState(null)
    const [loggedUserLastName, setLoggedUserLastName] = useState(null)
    const [loggedUserContactEmail, setLoggedUserContactEmail] = useState(null)
    const [loggedUserProfilePicture, setLoggedUserProfilePicture] = useState(null)
    const [loggedUserRole, setLoggedUserRole] = useState(null)
    const [loggedUserMustResetPass, setLoggedUserMustResetPass] = useState(false)
    const [userCarCount, setUserCarCount] = useState(null)
    const [userCarsValue, setUserCarsValue] = useState(null)
    const [recentlyAddedCars, setRecentlyAddedCars] = useState([])
    const [loading, setLoading] = useState(true);
    const [scaleList, setScaleList] = useState(['1/4', '1/5', '1/6', '1/8', '1/10', '1/12', '1/18', '1/24', '1/32', '1/36', '1/43', '1/48', '1/50', '1/55', '1/60', '1/61', '1/64', '1/70', '1/72', '1/76', '1/87', '1/100', '1/120', '1/148', '1/160', '1/200']) 
    const [userCollections, setUserCollections] = useState(null)


    const handleLogin = async()=>{
        const url = 'https://mycarcollectionapi.onrender.com/api/sessions/whoIsOnline'
        const opts = {method: 'POST', credentials: 'include'}
        const response = await fetch(url, opts)
        const responseData = await response.json()
        setLoggedUserId(responseData.userId)
        setLoggedUserName(responseData.userName)
        setLoggedUserProfilePicture(responseData.userProfilePicture)
        setUserCarCount(responseData.userCarCount)
        setUserCarsValue(responseData.userCarsTotalAmount)
        const recentCarsResponse = await fetch(`https://mycarcollectionapi.onrender.com/api/cars?userId=${responseData.userId}&onlyRecent=t`)
        const recentCarsResponseData = await recentCarsResponse.json()
        setRecentlyAddedCars(recentCarsResponseData.data)
        
        navigate('/')
    }

    const handleLogOut = async ()=>{
            const url = 'https://mycarcollectionapi.onrender.com/api/sessions/logout'
            const opts = { method : 'POST', credentials: 'include'}
            await fetch(url, opts)
            setLoggedUserId(null)
            setLoggedUserName(null)
            setLoggedUserContactEmail(null)
            setLoggedUserFirstName(null)
            setLoggedUserLastName(null)
            setLoggedUserProfilePicture(null)
            navigate('/')
        }

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
                    setLoggedUserId(responseData.userId)
                    setLoggedUserName(responseData.userName)
                    setLoggedUserProfilePicture(responseData.userProfilePicture)
                    setUserCarCount(responseData.userCarCount)
                    setUserCarsValue(responseData.userCarsTotalAmount)
                    const recentCarsResponse = await fetch(`https://mycarcollectionapi.onrender.com/api/cars?userId=${responseData.userId}&onlyRecent=t`)
                    const recentCarsResponseData = await recentCarsResponse.json()
                    setRecentlyAddedCars(recentCarsResponseData.data)
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
            loggedUserId,
            loggedUserName, 
            loggedUserProfilePicture, 
            loggedUserContactEmail, 
            loggedUserFirstName,
            loggedUserLastName,
            setLoggedUserId, 
            setLoggedUserName, 
            setLoggedUserProfilePicture, 
            setLoggedUserFirstName, 
            setLoggedUserLastName, 
            setLoggedUserContactEmail,
            handleLogin, 
            handleLogOut,
            setUserCarCount,
            userCarCount,
            setUserCarsValue,
            userCarsValue,
            recentlyAddedCars,
            setRecentlyAddedCars,
            scaleList,
            userCollections,
            setUserCollections
        }}
        >
            {children}
        </AppContext.Provider>
    )
}