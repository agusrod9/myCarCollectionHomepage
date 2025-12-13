import { useState, useContext, useRef, useEffect } from 'react'
import { Header } from '../components/Header'
import styles from './ProfileScreen2.module.css'
import { AppContext } from '../context/AppContext'
import Loading from '../components/Loading'
import usePageTitle from '../hooks/usePageTitle'
import { uploadSingleImage, convertToWebp } from '../utils/images.utils'
import toast from 'react-hot-toast'
import { LevelBar } from '../components/LevelBar'
import { validateNickFormat } from '../utils/nicknames.util'
import { BadgeAlert, BadgeCheck, CircleX, Edit, Save } from 'lucide-react'


export function ProfileScreen2(){
    const API_BASEURL = import.meta.env.VITE_API_BASEURL;
    const {
        loggedUserId, 
        loggedUserName,
        loggedUserEmail,
        setLoggedUserEmail,
        loggedUserFirstName,
        setLoggedUserFirstName,
        loggedUserLastName,
        setLoggedUserLastName,
        loggedUserProfilePicture,
        setLoggedUserProfilePicture,
        loggedUserRole,
        setLoggedUserRole,
        loggedUserLevel,
        setLoggedUserLevel,
        handleLogOut,
        loggedUserFollowesCount,
        setLoggedUserFollowesCount,
        loggedUserBio,
        setLoggedUserBio
    } = useContext(AppContext)
    const [loading, setLoading] = useState(true)
    const [editableUserInfo, setEditableUserInfo] = useState({
        firstName : loggedUserFirstName || "",
        lastName : loggedUserLastName || "",
        email : loggedUserEmail || "",
        role : loggedUserRole || "",
        level : loggedUserLevel || "",
        followersCount : loggedUserFollowesCount || "",
        bio : loggedUserBio || "",
        nickName : loggedUserName || ""
    })
    const [userNameOKtoSave, setUserNameOKtoSave] = useState(false)
    const [displayUserNameCorrectFormat ,setDisplayUserNameCorrectFormat] = useState(false)
    const[isEditingUserInfo, setIsEditingUserInfo] = useState(false)
    const[isEditingPersonalInfo, setIsEditingPersonalInfo] = useState(false)
    const[isEditingSocialInfo, setIsEditingSocialInfo] = useState(false)
    const [updateDataError, setUpdateDataError] = useState({})
    const fileInputRef = useRef(null);
    const typeTimeoutRef = useRef(null)


    usePageTitle(`${loggedUserName}´s Profile`)

    const handleSelectProfilePicture = ()=>{
        fileInputRef.current.click()
    }

    const handleFileChange = async(e)=>{
        const file = e.target.files[0];
        if(!file) return;
        const t = toast.loading("Uploading profile picture...", {duration: 10000})
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

    const handleUserNameChange = (e)=>{
        setEditableUserInfo(prev=> ({...prev, nickName: e.target.value}))
        setDisplayUserNameCorrectFormat(false)
        setUserNameOKtoSave(false)
        if(e.target.value===editableUserInfo.nickName){
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

    const handleEditUserInfo=()=>{
        setIsEditingUserInfo(true)
    }

    const handleSaveUserInfo=()=>{
        setIsEditingUserInfo(false)
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
            setLoggedUserRole(loggedUser.role)
            setLoggedUserLevel(loggedUser.level)
            setLoggedUserFollowesCount(loggedUser.followersCount)
            setLoggedUserBio(loggedUser.bio)
            setEditableUserInfo(prev=>(
                {
                    ...prev,
                    firstName : loggedUser.firstName,
                    lastName : loggedUser.lastName,
                    email : loggedUser.email,
                    role : loggedUser.role,
                    level : loggedUser.level,
                    followersCount : loggedUser.followersCount,
                    bio : loggedUser.bio
                }
            ))
            setLoading(false)
        }
        if(
            !loggedUserFirstName ||
            !loggedUserLastName ||
            !loggedUserEmail ||
            !loggedUserRole ||
            !loggedUserLevel ||
            !loggedUserFollowesCount ||
            !loggedUserBio
        ){
            getLoggedUserInfo()
        }else{
            setEditableUserInfo(prev=>({
                ...prev,
                firstName : loggedUserFirstName,
                lastName : loggedUserLastName,
                email : loggedUserEmail,
                role : loggedUserRole,
                level : loggedUserLevel,
                followersCount : loggedUserFollowesCount,
                bio : loggedUserBio,
                nickName : loggedUserName

            }))
            setLoading(false)
        }
    },[])

    useEffect(()=>{
        console.log("entra")
        if(!editableUserInfo.firstName || !editableUserInfo.lastName){
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
            //email: !validator.isEmail(editableUserInfo.email),
            firstName: editableUserInfo.firstName.length < 3 || editableUserInfo.firstName.length >50 || !nameRegex.test(editableUserInfo.firstName),
            lastName: editableUserInfo.lastName.length < 3 || editableUserInfo.lastName.length >50 || !nameRegex.test(editableUserInfo.lastName)
        };
        setUpdateDataError(newErrors);
    },[editableUserInfo])
    
    if(loading){
        return <Loading />
    }

    return(
        <section className={styles.root}>
            <Header 
                loggedUserId={loggedUserId} 
                loggedUserName={loggedUserName} 
                loggedUserProfilePicture= {loggedUserProfilePicture} 
                handleLogOut={()=>{handleLogOut(true)}}
            />
            <div className={styles.pageContainer}>
                <div className={styles.banner}>
                    <div className={styles.pictureSectionContainer}>
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
                        <img 
                            src={loggedUserProfilePicture || profilePlaceholder} 
                            alt={`Profile picture of ${editableUserInfo.nickName}`} 
                            className={styles.profilePicture}
                        />
                    </div>
                    <div className={styles.userInfo}>
                        {isEditingUserInfo ? <Save onClick={handleSaveUserInfo}/> :<Edit onClick={handleEditUserInfo}/>}
                        <div className={styles.userNameInputContainer}>
                            <input 
                                type="text"
                                value={editableUserInfo.nickName}
                                disabled={!isEditingUserInfo}
                                onChange={handleUserNameChange}
                            />
                            {isEditingUserInfo ? userNameOKtoSave ? <BadgeCheck color='green'/> : <BadgeAlert color='red'/> : null}
                            <div className={styles.correctUserNameFormatContainer}>
                                {isEditingUserInfo ? displayUserNameCorrectFormat ? <p className={styles.correctUserNameFormatInfo}>Only lowercase letters, numbers, dots (.), hyphens (-) and underscores (_) are allowed.</p> : null : null}
                            </div></div>
                        <div className={styles.nameImputContainer}>
                            <input 
                                type="text"
                                value={editableUserInfo.firstName}
                                disabled={!isEditingUserInfo}
                                onChange={(e)=>setEditableUserInfo(prev=>({...prev, firstName : e.target.value}))}
                            />
                            <input 
                                type="text"
                                value={editableUserInfo.lastName}
                                disabled={!isEditingUserInfo}
                                onChange={(e)=>setEditableUserInfo(prev=>({...prev, lastName : e.target.value}))}
                            />
                        </div>
                        <div className={styles.formInputError}>
                            {updateDataError.firstName ? editableUserInfo.firstName.length<3 ? <p>Name is too short</p> : editableUserInfo.firstName.length>50 ? <p>Name is too long</p> : <p>Invalid characters in Name</p> : <p/>}
                            {updateDataError.lastName ? editableUserInfo.lastName .length<3 ? <p>Last name is too short</p> : editableUserInfo.lastName .length>50 ? <p>Last name is too long</p> : <p>Invalid characters in Last Name</p>  : <p/>}
                        </div>
                        <p>{`${editableUserInfo.role} •Level ${editableUserInfo.level}`}</p>
                        <LevelBar />
                        <div className={styles.badgesContainer}>
                            <img className={styles.badgeImg} src="https://files.idyllic.app/files/static/2714958?width=1080&optimizer=image" alt="badge" />
                            <img className={styles.badgeImg} src="https://files.idyllic.app/files/static/2714958?width=1080&optimizer=image" alt="badge" />
                            <img className={styles.badgeImg} src="https://files.idyllic.app/files/static/2714958?width=1080&optimizer=image" alt="badge" />
                            <img className={styles.badgeImg} src="https://files.idyllic.app/files/static/2714958?width=1080&optimizer=image" alt="badge" />
                            <img className={styles.badgeImg} src="https://files.idyllic.app/files/static/2714958?width=1080&optimizer=image" alt="badge" />
                            <a href={`/badges/${editableUserInfo.nickName}`}>Badges</a>
                        </div>
                        <p>{`${editableUserInfo.followersCount} Followers`}</p>
                        <input 
                            type="text"
                            value={editableUserInfo.bio}
                            className={styles.bio}
                            disabled={!isEditingUserInfo}
                            onChange={(e)=>setEditableUserInfo(prev=>({...prev, bio : e.target.value}))}
                        />
                    </div>
                    <div className={styles.userButtons}>

                    </div>
                </div>


                <div className={styles.personalInfo}>

                </div>


                <div className={styles.social}>

                </div>


                <div className={styles.bottomContainer}>
                    <div className={styles.userStats}>

                    </div>


                    <div className={styles.accountInfo}>

                    </div>
                </div>
            </div>

        </section>
    )
}