import { createContext, useState, useEffect } from "react";
import Loading from "../components/Loading";
import Swal from "sweetalert2";
import toast from "react-hot-toast";

const API_BASEURL = import.meta.env.VITE_API_BASEURL;
const APP_FRONT_URL = import.meta.env.VITE_APP_FRONT_URL

export const AppContext = createContext()

export function AppContextProvider ({children}){
    const placeholder = "https://user-collected-cars-images-bucket.s3.us-east-2.amazonaws.com/public/placeholder.webp"
    const profilePlaceholder = "https://user-collected-cars-images-bucket.s3.us-east-2.amazonaws.com/public/user.webp"
    const [currenciesList, setCurrenciesList] = useState([])
    const [scaleList, setScaleList] = useState(['1/4', '1/5', '1/6', '1/8', '1/10', '1/12', '1/18', '1/24', '1/32', '1/36', '1/43', '1/48', '1/50', '1/55', '1/60', '1/61', '1/64', '1/70', '1/72', '1/76', '1/87', '1/100', '1/120', '1/148', '1/160', '1/200']) 
    const [loggedUserId, setLoggedUserId] = useState(null)
    const [loggedUserEmail, setLoggedUserEmail] = useState(null)
    const [loggedUserName, setLoggedUserName] = useState(null)
    const [loggedUserFirstName, setLoggedUserFirstName] = useState(null)
    const [loggedUserLastName, setLoggedUserLastName] = useState(null)
    const [loggedUserProfilePicture, setLoggedUserProfilePicture] = useState(null)
    const [loggedUserRole, setLoggedUserRole] = useState(null)
    const [loggedUserMustResetPass, setLoggedUserMustResetPass] = useState(false)
    const [loggedUserLanguage, setLoggedUserLanguage] = useState (null)
    const [loggedUserCurrency, setLoggedUserCurrency] = useState (null)
    const [userCarCount, setUserCarCount] = useState(0)
    const [userCarsValue, setUserCarsValue] = useState([])
    const [userCollections, setUserCollections] = useState([])
    const [recentlyAddedCars, setRecentlyAddedCars] = useState([])
    const [loading, setLoading] = useState(true);
    const [userCollectedCars, setUserCollectedCars] = useState([])
    const [loggedUserGoogleId, setLoggedUserGoogleId] = useState(null)
    const lang = navigator.language.split('-')[0]
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
        setLoggedUserProfilePicture(null);
        setLoggedUserRole(null);
        setLoggedUserMustResetPass(null);
        setUserCarCount(0);
        setUserCarsValue([]);
        setRecentlyAddedCars([]);
        setUserCollections([]);
        setUserCollectedCars([]);
        setLoggedUserGoogleId(null);
        setSelectedFilters({
            availableManufacturers : [],
            availableCarMakes : [],
            availableScales : [],
            query:""
        })
    }
    
    const handleLogin = async()=>{
        const t = toast.loading("Logging in...", {duration : 15000})
        const url = `${API_BASEURL}/api/sessions/whoIsOnline`
        const opts = {method: 'POST', credentials: 'include'}
        const response = await fetch(url, opts)
        const responseData = await response.json()
        if(responseData.userId && !responseData.language){
            const update = {
                language : lang
            }
            const url = `${API_BASEURL}/api/users/${responseData.userId}/settings/language`
            const opts = {
                method: 'PUT',
                headers: { "Content-Type": "application/json" },
                body : JSON.stringify(update)
            }
            fetch(url, opts)
        }
        const languageUpdate = {
                language : lang
            }
        const languageUpdateUrl = `${API_BASEURL}/api/globalStats/updateLanguageStats`;
        const languageUpdateOpts = {
            method: 'PUT',
            headers: { "Content-Type": "application/json" },
            body : JSON.stringify(languageUpdate)
        }
        fetch(languageUpdateUrl, languageUpdateOpts)
        setLoggedUserLanguage(responseData.language || lang)
        setLoggedUserCurrency(responseData.mainCurrency)
        setLoggedUserId(responseData.userId)
        setLoggedUserName(responseData.userName)
        setLoggedUserProfilePicture(responseData.userProfilePicture)
        setLoggedUserRole(responseData.role)
        setLoggedUserGoogleId(responseData.userGoogleId)
        setUserCarCount(responseData.userCarCount)
        setUserCarsValue(responseData.amountByCurrency)
        const recentCarsResponse = await fetch(`${API_BASEURL}/api/cars?userId=${responseData.userId}&onlyRecent=true`)
        const recentCarsResponseData = await recentCarsResponse.json()
        setRecentlyAddedCars(recentCarsResponseData.data)
        toast.success(`Welcome back ${responseData.userName}!`, {duration: 2000, id: t})
        fetch(`${API_BASEURL}/api/users/activity/ping`, {
            method: "POST",
            credentials: "include"
        })
        window.location.href=APP_FRONT_URL;
    }

    const updateRecentlyAddedCars=async()=>{
        if(loggedUserId){
            const recentCarsResponse = await fetch(`${API_BASEURL}/api/cars?userId=${loggedUserId}&onlyRecent=true`)
            const recentCarsResponseData = await recentCarsResponse.json()
            setRecentlyAddedCars(recentCarsResponseData.data)
        }
    }

    const handleLogOut = async(askFirst=false)=>{
        const url = `${API_BASEURL}/api/sessions/logout`
        const opts = { method : 'POST', credentials: 'include'}
        let result;
        let response;
        if(askFirst===true){
            result = await Swal.fire({
                title: "Are you sure you want to logout?",
                showDenyButton: true,
                showCancelButton: false,
                confirmButtonText: "Logout",
                denyButtonText: `Cancel`
            })
            if(!result.isConfirmed){
                return
            }
        }
        response = await fetch(url, opts)
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
                if(responseData.userId && !responseData.language){
                    const update = {
                        language : lang
                    }
                    const url = `${API_BASEURL}/api/users/${responseData.userId}/settings/language`
                    const opts = {
                        method: 'PUT',
                        headers: { "Content-Type": "application/json" },
                        body : JSON.stringify(update)
                    }
                    fetch(url, opts)
                }
                const languageUpdate = {
                    language : lang
                }
                const languageUpdateUrl = `${API_BASEURL}/api/globalStats/updateLanguageStats`;
                const languageUpdateOpts = {
                    method: 'PUT',
                    headers: { "Content-Type": "application/json" },
                    body : JSON.stringify(languageUpdate)
                }
                fetch(languageUpdateUrl, languageUpdateOpts)
                setLoggedUserLanguage(responseData.language || lang)
                setLoggedUserCurrency(responseData.mainCurrency)
                setLoggedUserId(responseData.userId)
                setLoggedUserMustResetPass(responseData.mustResetPass)
                setLoggedUserName(responseData.userName)
                setLoggedUserProfilePicture(responseData.userProfilePicture)
                setLoggedUserRole(responseData.role)
                setLoggedUserGoogleId(responseData.userGoogleId)
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
        //Google login/register 
        const params = new URLSearchParams(window.location.search);
        const loggedByGoogle = params.get("loggedBy") === "google";

        if (loggedByGoogle) {
            fetch(`${API_BASEURL}/api/users/activity/ping`, {
                method: "POST",
                credentials: "include"
            });
            const newUrl = window.location.origin + window.location.pathname;
            window.history.replaceState({}, '', newUrl);
        }

        if(loggedUserId){
            fetch(`${API_BASEURL}/api/users/activity/ping`, {
                method: "POST",
                credentials: "include"
            })
        }
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
            loggedUserFirstName,
            loggedUserLastName,
            loggedUserLanguage,
            loggedUserRole,
            setLoggedUserId, 
            setLoggedUserName,
            loggedUserCurrency,
            setLoggedUserProfilePicture, 
            setLoggedUserFirstName, 
            setLoggedUserLastName,
            setLoggedUserLanguage,
            setLoggedUserCurrency,
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
            updateRecentlyAddedCars,
            loggedUserEmail,
            setLoggedUserEmail,
            loggedUserGoogleId,
            placeholder,
            profilePlaceholder,
        }}
        >
            {children}
        </AppContext.Provider>
    )
}