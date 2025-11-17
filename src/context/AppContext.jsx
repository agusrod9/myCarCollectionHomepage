import { createContext, useState, useEffect } from "react";
import Loading from "../components/Loading";

const API_BASEURL = import.meta.env.VITE_API_BASEURL;

export const AppContext = createContext()

export function AppContextProvider ({children}){
    const [currenciesList, setCurrenciesList] = useState([])
    const [scaleList, setScaleList] = useState(['1/4', '1/5', '1/6', '1/8', '1/10', '1/12', '1/18', '1/24', '1/32', '1/36', '1/43', '1/48', '1/50', '1/55', '1/60', '1/61', '1/64', '1/70', '1/72', '1/76', '1/87', '1/100', '1/120', '1/148', '1/160', '1/200']) 
    const [loggedUserId, setLoggedUserId] = useState(null)
    const [loggedUserName, setLoggedUserName] = useState(null)
    const [loggedUserFirstName, setLoggedUserFirstName] = useState(null)
    const [loggedUserLastName, setLoggedUserLastName] = useState(null)
    const [loggedUserContactEmail, setLoggedUserContactEmail] = useState(null)
    const [loggedUserProfilePicture, setLoggedUserProfilePicture] = useState(null)
    const [loggedUserRole, setLoggedUserRole] = useState(null)
    const [loggedUserMustResetPass, setLoggedUserMustResetPass] = useState(false)
    const [userCarCount, setUserCarCount] = useState(0)
    const [userCarsValue, setUserCarsValue] = useState([])
    const [userCollections, setUserCollections] = useState([])
    const [recentlyAddedCars, setRecentlyAddedCars] = useState([])
    const [loading, setLoading] = useState(true);
    const [userCollectedCars, setUserCollectedCars] = useState([])
    const [selectedFilters, setSelectedFilters] = useState({
        availableManufacturers : [],
        availableCarMakes : [],
        availableScales : [],
        query:""
    })

    const clearContext =()=>{
        setLoggedUserId(null);
        setLoggedUserName(null);
        setLoggedUserFirstName(null);
        setLoggedUserLastName(null);
        setLoggedUserContactEmail(null);
        setLoggedUserProfilePicture(null);
        setLoggedUserRole(null);
        setLoggedUserMustResetPass(null);
        setUserCarCount(0);
        setUserCarsValue([]);
        setRecentlyAddedCars([]);
        setUserCollections([]);
        setUserCollectedCars([]);
        setSelectedFilters({
            availableManufacturers : [],
            availableCarMakes : [],
            availableScales : [],
            query:""
        })
    }

    const handleLogin = async()=>{
        const url = `${API_BASEURL}/api/sessions/whoIsOnline`
        const opts = {method: 'POST', credentials: 'include'}
        const response = await fetch(url, opts)
        const responseData = await response.json()
        setLoggedUserId(responseData.userId)
        setLoggedUserName(responseData.userName)
        setLoggedUserProfilePicture(responseData.userProfilePicture)
        setLoggedUserRole(responseData.role)
        setUserCarCount(responseData.userCarCount)
        setUserCarsValue(responseData.amountByCurrency)
        const recentCarsResponse = await fetch(`${API_BASEURL}/api/cars?userId=${responseData.userId}&onlyRecent=t`)
        const recentCarsResponseData = await recentCarsResponse.json()
        setRecentlyAddedCars(recentCarsResponseData.data)
        
        navigate('/')
    }

    const updateRecentlyAddedCars=async()=>{
        if(loggedUserId){
            const recentCarsResponse = await fetch(`${API_BASEURL}/api/cars?userId=${loggedUserId}&onlyRecent=t`)
            const recentCarsResponseData = await recentCarsResponse.json()
            setRecentlyAddedCars(recentCarsResponseData.data)
        }
    }

    const handleLogOut = async ()=>{
            const url = `${API_BASEURL}/api/sessions/logout`
            const opts = { method : 'POST', credentials: 'include'}
            const response = await fetch(url, opts)
            if(response.status==200){
                clearContext()
                navigate('/')
            }
        }

    useEffect(()=>{
            async function getLoggedUserId(){
            try {
                const isonline = await fetch(`${API_BASEURL}/api/sessions/online`, {method: 'POST', credentials:'include'})
                if(isonline.status==200){
                    const userIdUrl = `${API_BASEURL}/api/sessions/whoIsOnline`
                    const opts = {method: 'POST', credentials: 'include'}
                    const response = await fetch(userIdUrl, opts)
                    const responseData = await response.json()
                    setLoggedUserId(responseData.userId)
                    setLoggedUserMustResetPass(responseData.mustResetPass)
                    setLoggedUserName(responseData.userName)
                    setLoggedUserProfilePicture(responseData.userProfilePicture)
                    setLoggedUserRole(responseData.role)
                    setUserCarCount(responseData.userCarCount)
                    setUserCarsValue(responseData.amountByCurrency)
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
        
        useEffect(()=>{
            updateRecentlyAddedCars()
        },[loggedUserId, userCollectedCars])

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
            loggedUserRole,
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
            setUserCollections,
            userCollectedCars,
            setUserCollectedCars,
            selectedFilters,
            setSelectedFilters,
            currenciesList,
            setCurrenciesList,
            updateRecentlyAddedCars
        }}
        >
            {children}
        </AppContext.Provider>
    )
}