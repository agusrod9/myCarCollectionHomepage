import { useContext, useEffect, useRef, useState } from 'react'
import styles from './ProfileScreen.module.css'
import { AppContext } from '../context/AppContext'
import { Header } from '../components/Header'
import {ActionBtn} from '../components/ActionBtn'
import { BadgeAlert, BadgeCheck, CircleX, Edit, Save, SquarePen, Ban } from 'lucide-react'
import Loading from '../components/Loading'
import { uploadSingleImage, convertToWebp } from '../utils/images.utils'
import { validateNickFormat } from '../utils/nicknames.util'
import toast from 'react-hot-toast'
import Swal from 'sweetalert2'
import validator from 'validator'
import usePageTitle from '../hooks/usePageTitle'
import { capitalize } from '../utils/textUtils.js'

const API_BASEURL = import.meta.env.VITE_API_BASEURL;

export function ProfileScreen({loggedUserId, loggedUserName, loggedUserProfilePicture}){
    const{loggedUserEmail, setLoggedUserEmail, loggedUserFirstName, loggedUserLastName, setLoggedUserName, setLoggedUserProfilePicture, setLoggedUserFirstName, setLoggedUserLastName, handleLogOut, loggedUserGoogleId, profilePlaceholder } = useContext(AppContext)
    const [loading, setLoading] = useState(true)
    const [isEditingData, setIsEditingData] = useState(false)
    const [isEditingUserName, setIsEditingUserName] = useState(false)
    const [firstName, setFirstName] = useState("")
    const [lastName, setLastName] = useState("")
    const [email, setEmail] = useState(loggedUserEmail)
    const [userName, setUserName] = useState(loggedUserName)
    const [editableUserName, setEditableUserName] = useState(userName)
    const [userNameOKtoSave, setUserNameOKtoSave] = useState(false)
    const [displayUserNameCorrectFormat ,setDisplayUserNameCorrectFormat] = useState(false)
    const [updateDataError, setUpdateDataError] = useState({})
    const typeTimeoutRef = useRef(null)
    const fileInputRef = useRef(null);
    const initialValuesRef = useRef({
        firstName: "",
        lastName: "",
        email: ""
    })

    usePageTitle(`${loggedUserName}´s Profile`)

    const handleEditOrSaveUserData = async()=>{
        const initialIsEditing = isEditingData;
        let changedEmailFlag = false;
        setIsEditingData(!isEditingData)
        if (!initialIsEditing) {
            initialValuesRef.current = {
                firstName,
                lastName,
                email
            };
            return;
        }
        const initial = initialValuesRef.current;
        if(firstName===initial.firstName && lastName===initial.lastName && email===initial.email){
            toast("No changes to save", {icon: "⚠️"})
            return
        }
        const updatedValues = {}

        firstName!==initial.firstName ? (updatedValues.firstName = firstName) : null
        lastName!==initial.lastName  ? (updatedValues.lastName = lastName) : null
        email!==initial.email && !loggedUserGoogleId ? (updatedValues.email = email) : null
        
        if(updatedValues.email){
            const result = await Swal.fire({
                title: "Are you sure you want to change your E-Mail?",
                text: "If you change your E-Mail, you will be logged out and next time you Login, you will need to verify your new E-Mail",
                showDenyButton: true,
                showCancelButton: false,
                confirmButtonText: "Change",
                denyButtonText: `Cancel`
            })

            if(!result.isConfirmed){
                delete updatedValues.email;
            }else{
                const result2 = await Swal.fire({
                    title: "Confirm new E-Mail address",
                    html: `Is <b>${email}</b> correct?`,
                    showDenyButton: true,
                    showCancelButton: false,
                    confirmButtonText: "Yes",
                    denyButtonText: `Cancel`
                })
                if(result2.isConfirmed){
                    changedEmailFlag = true;
                }else{
                    delete updatedValues.email;
                }
            }
        }
        if(Object.keys(updatedValues).length===0){
            toast("No changes to save", {icon: "⚠️"})
            setFirstName(initialValuesRef.current.firstName)
            setLastName(initialValuesRef.current.lastName)
            setEmail(initialValuesRef.current.email)
            return
        }
        
        const t = toast.loading("Saving user data...", {duration:10000})
        const url = `${API_BASEURL}users/${loggedUserId}`;
        const opts = {
            method : "PUT",
            headers : {'Content-Type' : 'application/json'},
            body : JSON.stringify({...updatedValues, previousEmail : initialValuesRef.current.email})
        }
        const response = await fetch(url, opts)
        if(response.status==200){
            if(changedEmailFlag){
                const url = `${API_BASEURL}sessions/getVerificationCode?email=${updatedValues.email}`
                const opts = {
                    method : "POST"
                }
                const response = await fetch(url,opts)
                const responseData = await response.json()
                if(response.status!=200){
                    //ROLLBACK de los cambios anteriores?
                    toast.error(responseData.message)
                    return
                }
                toast(`Check ${email} for verification code`, {id: t, duration : 6000, icon: "⚠️"})
                let counter = 6;
                    const countdownToast = toast(`You are being logged out in (${counter})`, {
                        duration: 1000*10, position: "top-right", icon: "⏳"
                    });

                    const interval = setInterval(() => {
                        counter--;
                        if (counter <= 0) {
                            clearInterval(interval);
                            toast.dismiss(countdownToast);
                            handleLogOut();
                        } else {
                            toast(`You are being logged out in (${counter})`, {id: countdownToast},);
                        }
                    }, 1000);
                return;
            }
            toast.success("User data updated!", {id: t, duration : 2000})
        }else{
            toast.error("Error saving data", {id: t, duration : 2000})
        }
    }

    const handleCancelEditing = ()=>{
        setUpdateDataError({})
        setFirstName(initialValuesRef.current.firstName)
        setLastName(initialValuesRef.current.lastName)
        setEmail(initialValuesRef.current.email)
        setIsEditingData(!isEditingData)
    }

    const handleSelectProfilePicture = ()=>{
        fileInputRef.current.click()
    }

    const handleFileChange = async(e)=>{
        const t = toast.loading("Uploading profile picture...", {duration: 10000})
        const file = e.target.files[0];
        if (file){
            const convertedFile = await convertToWebp(file)
            const profileImgUrl = await uploadSingleImage(loggedUserId, "profilePicture", convertedFile)
            if(profileImgUrl){
                const url = `${API_BASEURL}users/${loggedUserId}`;
                const opts = {
                    method : "PUT",
                    headers : {'Content-Type' : 'application/json'},
                    body : JSON.stringify({profilePicture : profileImgUrl})
                }
                const response = await fetch(url, opts)
                if(response.status==200){
                    setLoggedUserProfilePicture(prev=>{
                        const imgToDelete = prev.split("https://user-collected-cars-images-bucket.s3.us-east-2.amazonaws.com/")[1];
                        const url = `${API_BASEURL}aws/?id=${imgToDelete}`
                        const opts = {
                            method : 'DELETE'
                        }
                        fetch(url,opts)
                        return profileImgUrl
                })
                    toast.success("Profile picture uploaded!", {id : t, duration: 2000})
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
        setDisplayUserNameCorrectFormat(false)
    }

    const handleSaveUserName = async()=>{
        const t = toast.loading("Updating username...", {duration: 10000})
        setIsEditingUserName(!isEditingUserName)
        setLoggedUserName(editableUserName)
        setUserName(editableUserName)
        const url = `${API_BASEURL}users/${loggedUserId}`;
        const opts = {
            method : "PUT",
            headers : {'Content-Type' : 'application/json'},
            body : JSON.stringify({nickName : editableUserName})
        }
        const response = await fetch(url, opts)
        if(response.status==200){
            toast.success("Username updated!", {id: t, duration : 2000})
        }
        
    }

    const handleUserNameChange = (e)=>{
        setEditableUserName(e.target.value)
        setDisplayUserNameCorrectFormat(false)
        setUserNameOKtoSave(false)
        if(e.target.value===userName){
            setUserNameOKtoSave(false)
            return
        }
        if(typeTimeoutRef.current){
            clearTimeout(typeTimeoutRef.current)
        }
        
        
        typeTimeoutRef.current = setTimeout(async() => {
            if(e.target.value.length!=0){
                if(validateNickFormat(e.target.value)){
                    const response = await fetch(`${API_BASEURL}users/checkNick?nick=${e.target.value}`)
                    const responseData = await response.json()
                    setUserNameOKtoSave(responseData.data)
                }else{
                    setDisplayUserNameCorrectFormat(true)
                    setUserNameOKtoSave(false)
                }
            }
        }, 500);
    }

    useEffect(()=>{
        async function getLoggedUserInfo(){
            const url = `${API_BASEURL}sessions/onlineUserData`
            const opts = {
                    method : "POST",
                    credentials : 'include'
            }
            const response = await fetch(url,opts)
            const responseData = await response.json()
            const loggedUser = responseData.data
            
            setLoggedUserFirstName(loggedUser.firstName)
            setLoggedUserLastName(loggedUser.lastName)
            setLoggedUserEmail(loggedUser.email)
            setFirstName(loggedUser.firstName)
            setLastName(loggedUser.lastName)
            setEmail(loggedUser.email)
            setLoading(!loading)
        }
        if(!loggedUserFirstName || !loggedUserLastName || !loggedUserEmail){
            getLoggedUserInfo()
        }else{
            setFirstName(loggedUserFirstName)
            setLastName(loggedUserLastName)
            setEmail(loggedUserEmail)
            setLoading(!loading)
        }
    },[])

    useEffect(()=>{
        if(!firstName || !lastName || !email){
            return
        }
        //\p{L} → cualquier letra de cualquier idioma (á, ñ, ç, ü, etc.)
        //\p{M} → marcas de acentos combinados
        //'     → apóstrofos (como O'Neill)
        //-     → guiones (como Jean-Luc)
        //espacio → nombres compuestos
        //No permite números ni símbolos raros
        const nameRegex = /^[\p{L}\p{M}.'\- ]+$/u;
        const newErrors = {
            email: !validator.isEmail(email),
            firstName: firstName.length < 3 || firstName.length >50 || !nameRegex.test(firstName),
            lastName: lastName.length < 3 || lastName.length >50 || !nameRegex.test(lastName)
        };
        setUpdateDataError(newErrors);
    },[firstName, lastName, email])

    if(loading){
        return <Loading />
    }
    
    return(
        <section className={styles.root}>
            <Header loggedUserId={loggedUserId} loggedUserName={loggedUserName} loggedUserProfilePicture= {loggedUserProfilePicture} handleLogOut={()=>{handleLogOut(true)}}/>
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
                <img src={loggedUserProfilePicture || profilePlaceholder} alt={`Profile picture of ${loggedUserName}`} className={styles.profilePicture}/>
                <div className={styles.userNameInputContainer}>
                    <input type='text' name="" className={isEditingUserName ? `${styles.userNameInput} ${styles.editingMode}` : styles.userNameInput} value={editableUserName} disabled={!isEditingUserName} onChange={(e)=>handleUserNameChange(e)}/>
                    {isEditingUserName ? userNameOKtoSave ? <BadgeCheck color='green'/> : <BadgeAlert color='red'/> : null}
                </div>
                <div className={styles.userNameSaveAndCancelContainer}>
                    {isEditingUserName ? <Save className={userNameOKtoSave ? `${styles.userNameIcon} ${styles.saveBtnActive}` : `${styles.userNameIcon} ${styles.saveBtnDisabled}`} onClick={handleSaveUserName}/> : <Edit className={styles.userNameIcon} onClick={handleEditUserName}/>}
                    {isEditingUserName ? <CircleX className={styles.cancelBtn} onClick={handleCancelEditUserName}/> : null}
                </div>
                <div className={styles.correctUserNameFormatContainer}>
                    {isEditingUserName ? displayUserNameCorrectFormat ? <p className={styles.correctUserNameFormatInfo}>Only lowercase letters, numbers, dots (.), hyphens (-) and underscores (_) are allowed.</p> : null : null}
                </div>
            </div>
            <div className={styles.userDataContainer}>
                <label>Name</label>
                <input type="text" name="" className={isEditingData ? `${styles.formInput} ${styles.editingMode}` : styles.formInput} value={firstName} disabled={!isEditingData} onChange={(e)=>setFirstName(capitalize(e.target.value, true))}/>
                <div className={styles.formInputError}>
                    {updateDataError.firstName ? firstName.length<3 ? <p>Name is too short</p> : firstName.length>50 ? <p>Name is too long</p> : <p>Invalid characters in Name</p> : null}
                </div>
                <label>Last Name</label>
                <input type="text" name="" className={isEditingData ? `${styles.formInput} ${styles.editingMode}` : styles.formInput}  value={lastName} disabled={!isEditingData} onChange={(e)=>setLastName(capitalize(e.target.value, true))}/>
                <div className={styles.formInputError}>
                    {updateDataError.lastName ? lastName.length<3 ? <p>Last name is too short</p> : lastName.length>50 ? <p>Last name is too long</p> : <p>Invalid characters in Last Name</p>  : null}
                </div>
                {
                    !loggedUserGoogleId
                    ?
                    <>
                        <label>E-Mail</label>
                        <input type="text" name="" className={isEditingData ? `${styles.formInput} ${styles.editingMode}` : styles.formInput}  value={email} disabled={!isEditingData} onChange={(e)=>setEmail(e.target.value)}/>
                        <div className={styles.formInputError}>
                            {updateDataError.email ? <p>E-Mail is invalid</p> : null}
                        </div>
                    </>
                    :
                    null
                }
            </div>
            <div className={styles.saveAndCancelContainer}>
                {
                    isEditingData
                    ?
                    <ActionBtn extraClass={styles.cancelEditing} icon={<Ban />} label={"Cancel"} onClick={handleCancelEditing} />
                    :
                    null
                }
                <ActionBtn extraClass={styles.saveOrEdit} icon={isEditingData ? <Save /> : <SquarePen />} label={isEditingData ? "Save" : "Edit"} onClick={handleEditOrSaveUserData} disabled={isEditingData && (updateDataError.firstName || updateDataError.lastName || updateDataError.email || (firstName === loggedUserFirstName && lastName === loggedUserLastName && email === loggedUserEmail))}/>
            </div>
        </section>
    )
}