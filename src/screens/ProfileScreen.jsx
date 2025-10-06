import { useContext, useEffect, useRef, useState } from 'react'
import './ProfileScreen.css'
import { AppContext } from '../context/AppContext'
import { Header } from '../components/Header'
import {ActionBtn} from '../components/ActionBtn'
import { Edit, Save, SquarePen } from 'lucide-react'
import Loading from '../components/Loading'

export function ProfileScreen({loggedUserId, loggedUserName, loggedUserProfilePicture}){

    const{loggedUserContactEmail, loggedUserFirstName, loggedUserLastName, setLoggedUserName, setLoggedUserProfilePicture, setLoggedUserFirstName, setLoggedUserLastName, setLoggedUserContactEmail, handleLogOut } = useContext(AppContext)
    const [loading, setLoading] = useState(true)
    const [isEditingData, setIsEditingData] = useState(false)
    const [isEditingUserName, setIsEditingUserName] = useState(false)
    const [firstName, setFirstName] = useState("")
    const [lastName, setLastName] = useState("")
    const [contactEmail, setContactEmail] = useState("")
    const [userName, setUserName] = useState(loggedUserName)
    const [userNameOKtoSave, setUserNameOKtoSave] = useState(false)
    const typeTimeoutRef = useRef(null)

    const handleEditOrSaveUserData = ()=>{
        const isEditinigInitialValue = isEditingData
        setIsEditingData(!isEditingData)

        if(isEditinigInitialValue){
            
        }else{
            
        }
    }

    const handleEditUserName = ()=>{
        setIsEditingUserName (!isEditingUserName)
    }

    const handleSaveUserName = ()=>{
        setIsEditingUserName(!isEditingUserName)
        
    }

    const handleUserNameChange = (e)=>{
        setUserName(e.target.value)

        if(typeTimeoutRef.current){
            clearTimeout(typeTimeoutRef.current)
        }

        typeTimeoutRef.current = setTimeout(() => {
            if(e.target.value.length!=0){
                setUserNameOKtoSave(true)
            }
        }, 1000);
    }

    useEffect(()=>{
        async function getLoggedUserInfo(){
            const url = 'https://mycarcollectionapi.onrender.com/api/sessions/onlineUserData'
            const opts = {
                    method : "POST",
                    credentials : 'include'
            }
            const response = await fetch(url,opts)
            const responseData = await response.json()
            const loggedUser = responseData.userData
            
            setLoggedUserFirstName(loggedUser.firstName)
            setLoggedUserLastName(loggedUser.lastName)
            setLoggedUserContactEmail(loggedUser.contactEmail)
            setFirstName(loggedUser.firstName)
            setLastName(loggedUser.lastName)
            setContactEmail(loggedUser.contactEmail)
            setLoading(!loading)
        }
        if(!loggedUserFirstName && !loggedUserLastName && !loggedUserContactEmail){
            getLoggedUserInfo()
        }else{
            setFirstName(loggedUserFirstName)
            setLastName(loggedUserLastName)
            setContactEmail(loggedUserContactEmail)
            setLoading(!loading)
        }
    },[])

    if(loading){
        return <Loading />
    }
    
    return(
        <section className='ProfileScreenBody'>
            <Header loggedUserId={loggedUserId} loggedUserName={loggedUserName} loggedUserProfilePicture= {loggedUserProfilePicture} handleLogOut={()=>{handleLogOut()}}/>
            <div className='userBriefDataContainer'>
                <div className='profilePictureOverlayContainer'>
                    <div className='profilePictureOverlay'>
                        <p>Change profile picture</p>
                    </div>
                </div>
                <img src={loggedUserProfilePicture || "https://avatar.iran.liara.run/public" } alt={`Profile picture of ${loggedUserName}`} />
                <input type='text' name="" className={isEditingUserName ? "userNameInput editingMode" : "userNameInput"} value={userName} disabled={!isEditingUserName} onChange={(e)=>handleUserNameChange(e)}/>
                {isEditingUserName ? <Save className='userNameIcon' onClick={handleSaveUserName}/> : <Edit className='userNameIcon'onClick={handleEditUserName}/>}
            </div>
            <div className='userDataContainer'>
                <label>Name</label>
                <input type="text" name="" className={isEditingData ? "formInput editingMode" : "formInput"} value={firstName} disabled={!isEditingData} onChange={(e)=>setFirstName(e.target.value)}/>
                <label>Last Name</label>
                <input type="text" name="" className={isEditingData ? "formInput editingMode" : "formInput"}  value={lastName} disabled={!isEditingData} onChange={(e)=>setLastName(e.target.value)}/>
                <label>Contact E-Mail</label>
                <input type="text" name="" className={isEditingData ? "formInput editingMode" : "formInput"}  value={contactEmail} disabled={!isEditingData} onChange={(e)=>setContactEmail(e.target.value)}/>
            </div>
            <ActionBtn id="saveOrEdit" icon={isEditingData ? <Save /> : <SquarePen />} label={isEditingData ? "Save" : "Edit"} onClick={handleEditOrSaveUserData}/>
        </section>
    )
}