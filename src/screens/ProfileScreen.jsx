import { useContext, useEffect, useState } from 'react'
import './ProfileScreen.css'
import { AppContext } from '../context/AppContext'
import { Header } from '../components/Header'
import {ActionBtn} from '../components/ActionBtn'
import { Save, SquarePen } from 'lucide-react'

export function ProfileScreen({loggedUserId, loggedUserName, loggedUserProfilePicture}){

    const{loggedUserContactEmail, loggedUserFirstName, loggedUserLastName, setLoggedUserName, setLoggedUserProfilePicture, setLoggedUserFirstName, setLoggedUserLastName, setLoggedUserContactEmail, handleLogOut } = useContext(AppContext)

    const [isEditing, setIsEditing] = useState(false)
    const [firstName, setFirstName] = useState("")
    const [lastName, setLastName] = useState("")
    const [contactEmail, setContactEmail] = useState("")

    const handleEditOrSave = ()=>{
        const isEditinigInitialValue = isEditing
        setIsEditing(!isEditing)

        if(isEditinigInitialValue){
            
        }else{
            
        }
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
        }
        getLoggedUserInfo()
    },[])
    
    return(
        <section className='ProfileScreenBody'>
            <Header loggedUserId={loggedUserId} loggedUserName={loggedUserName} loggedUserProfilePicture= {loggedUserProfilePicture} handleLogOut={()=>{handleLogOut()}}/>
            <div className='userBriefDataContainer'>
                <img src={loggedUserProfilePicture || "https://avatar.iran.liara.run/public" } alt={`Profile picture of ${loggedUserName}`} />
                <p>{loggedUserName}</p>
            </div>
            <div className='userDataContainer'>
                <label>Name</label>
                <input type="text" name="" className={isEditing ? "editingFormInput" : "formInput"} value={firstName} disabled={!isEditing} onChange={(e)=>setFirstName(e.target.value)}/>
                <label>Last Name</label>
                <input type="text" name="" className={isEditing ? "editingFormInput" : "formInput"}  value={lastName} disabled={!isEditing} onChange={(e)=>setLastName(e.target.value)}/>
                <label>Contact E-Mail</label>
                <input type="text" name="" className={isEditing ? "editingFormInput" : "formInput"}  value={contactEmail} disabled={!isEditing} onChange={(e)=>setContactEmail(e.target.value)}/>
            </div>
            <ActionBtn id="saveOrEdit" icon={isEditing ? <Save /> : <SquarePen />} label={isEditing ? "Save" : "Edit"} onClick={handleEditOrSave}/>
        </section>
    )
}