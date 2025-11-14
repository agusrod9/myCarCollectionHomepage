import { useContext, useEffect, useRef, useState } from 'react'
import styles from './ProfileScreen.module.css'
import { AppContext } from '../context/AppContext'
import { Header } from '../components/Header'
import {ActionBtn} from '../components/ActionBtn'
import { BadgeAlert, BadgeCheck, CircleX, Edit, Save, SquarePen } from 'lucide-react'
import Loading from '../components/Loading'
import { toDo } from '../utils/toDo'
import { uploadSingleImage } from '../utils/images.utils'

const API_BASEURL = import.meta.env.VITE_API_BASEURL;

export function ProfileScreen({loggedUserId, loggedUserName, loggedUserProfilePicture}){
    const{loggedUserContactEmail, loggedUserFirstName, loggedUserLastName, setLoggedUserName, setLoggedUserProfilePicture, setLoggedUserFirstName, setLoggedUserLastName, setLoggedUserContactEmail, handleLogOut } = useContext(AppContext)
    const [loading, setLoading] = useState(true)
    const [isEditingData, setIsEditingData] = useState(false)
    const [isEditingUserName, setIsEditingUserName] = useState(false)
    const [firstName, setFirstName] = useState("")
    const [lastName, setLastName] = useState("")
    const [contactEmail, setContactEmail] = useState("")
    const [userName, setUserName] = useState(loggedUserName)
    const [editableUserName, setEditableUserName] = useState(userName)
    const [userNameOKtoSave, setUserNameOKtoSave] = useState(false)
    const typeTimeoutRef = useRef(null)
    const fileInputRef = useRef(null);

    const handleEditOrSaveUserData = ()=>{
        const isEditinigInitialValue = isEditingData
        setIsEditingData(!isEditingData)

        if(isEditinigInitialValue){
            
        }else{
            
        }
    }

    const handleSelectProfilePicture = ()=>{
        fileInputRef.current.click()
    }

    const handleFileChange = async(e)=>{
        const file = e.target.files[0];
        if (file){
            const profileImgUrl = await uploadSingleImage(loggedUserId, "profilePicture", file)
            if(profileImgUrl){
                const url = `${API_BASEURL}/api/users/${loggedUserId}`;
                const opts = {
                    method : "PUT",
                    headers : {'Content-Type' : 'application/json'},
                    body : JSON.stringify({profilePicture : profileImgUrl})
                }
                const response = await fetch(url, opts)
                if(response.status==200){
                    setLoggedUserProfilePicture(profileImgUrl)
                    toDo("image updated!")
                }
            }
        }
    }

    const handleEditUserName = ()=>{
        setIsEditingUserName (!isEditingUserName)
    }

    const handleCancelEditUserName = ()=>{
        setEditableUserName(userName)
        setIsEditingUserName(false)
        setUserNameOKtoSave(false)
    }

    const handleSaveUserName = async()=>{
        setIsEditingUserName(!isEditingUserName)
        setLoggedUserName(editableUserName)
        setUserName(editableUserName)
        const url = `${API_BASEURL}/api/users/${loggedUserId}`;
        const opts = {
            method : "PUT",
            headers : {'Content-Type' : 'application/json'},
            body : JSON.stringify({nickName : editableUserName})
        }
        const response = await fetch(url, opts)
        if(response.status==200){
            toDo("Username updated!")
        }
        
    }

    const handleUserNameChange = (e)=>{
        setEditableUserName(e.target.value)
        if(e.target.value===userName){
            setUserNameOKtoSave(false)
            return
        }
        if(typeTimeoutRef.current){
            clearTimeout(typeTimeoutRef.current)
        }
        typeTimeoutRef.current = setTimeout(async() => {
            if(e.target.value.length!=0){
                const response = await fetch(`${API_BASEURL}/api/users/checkNick?nick=${e.target.value}`)
                const responseData = await response.json()
                setUserNameOKtoSave(responseData.available)
            }
        }, 500);
    }

    useEffect(()=>{
        async function getLoggedUserInfo(){
            const url = `${API_BASEURL}/api/sessions/onlineUserData`
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
        <section className={styles.ProfileScreenBody}>
            <Header loggedUserId={loggedUserId} loggedUserName={loggedUserName} loggedUserProfilePicture= {loggedUserProfilePicture} handleLogOut={()=>{handleLogOut()}}/>
            <div className={styles.userBriefDataContainer}>
                <div className={styles.profilePictureOverlayContainer} onClick={handleSelectProfilePicture}>
                    <div className={styles.profilePictureOverlay}>
                        <input 
                            type="file"
                            ref={fileInputRef}
                            accept='image/*'
                            onChange={handleFileChange}
                            className={styles.fileInput} 
                        />
                        <p>Change profile picture</p>
                    </div>
                </div>
                <img src={loggedUserProfilePicture} alt={`Profile picture of ${loggedUserName}`} className={styles.profilePicture}/>
                <div className={styles.userNameInputContainer}>
                    <input type='text' name="" className={isEditingUserName ? `${styles.userNameInput} ${styles.editingMode}` : styles.userNameInput} value={editableUserName} disabled={!isEditingUserName} onChange={(e)=>handleUserNameChange(e)}/>
                    {isEditingUserName ? userNameOKtoSave ? <BadgeCheck color='green'/> : <BadgeAlert color='red'/> : null}
                </div>
                <div className={styles.userNameSaveAndCancelContainer}>
                    {isEditingUserName ? <Save className={userNameOKtoSave ? `${styles.userNameIcon} ${styles.saveBtnActive}` : `${styles.userNameIcon} ${styles.saveBtnDisabled}`} onClick={handleSaveUserName}/> : <Edit className={styles.userNameIcon} onClick={handleEditUserName}/>}
                    {isEditingUserName ? <CircleX className={styles.cancelBtn} onClick={handleCancelEditUserName}/> : null}
                </div>
            </div>
            <div className={styles.userDataContainer}>
                <label>Name</label>
                <input type="text" name="" className={isEditingData ? `${styles.formInput} ${styles.editingMode}` : styles.formInput} value={firstName} disabled={!isEditingData} onChange={(e)=>setFirstName(e.target.value)}/>
                <label>Last Name</label>
                <input type="text" name="" className={isEditingData ? `${styles.formInput} ${styles.editingMode}` : styles.formInput}  value={lastName} disabled={!isEditingData} onChange={(e)=>setLastName(e.target.value)}/>
                <label>Contact E-Mail</label>
                <input type="text" name="" className={isEditingData ? `${styles.formInput} ${styles.editingMode}` : styles.formInput}  value={contactEmail} disabled={!isEditingData} onChange={(e)=>setContactEmail(e.target.value)}/>
            </div>
            <ActionBtn extraClass={styles.saveOrEdit} icon={isEditingData ? <Save /> : <SquarePen />} label={isEditingData ? "Save" : "Edit"} onClick={handleEditOrSaveUserData}/>
        </section>
    )
}