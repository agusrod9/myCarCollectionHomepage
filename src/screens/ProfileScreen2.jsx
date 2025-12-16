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
import { BadgeAlert, BadgeCheck, Edit, Save, Copy } from 'lucide-react'
import { CountriesSelect } from '../components/CountriesSelect'
import { SocialLinkCard } from '../components/SocialLinkCard'
import { SocialLinkModal } from '../components/SocialLinksModal'


export function ProfileScreen2(){
    const API_BASEURL = import.meta.env.VITE_API_BASEURL;
    const FRONT_URL = import.meta.env.VITE_FRONT_URL
    const {
        loggedUserId, 
        loggedUserName,
        setLoggedUserName,
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
        setLoggedUserBio,
        loggedUserDateOfBirth,
        setLoggedUserDateOfBirth,
        loggedUserGender,
        setLoggedUserGender,
        loggedUserCountry,
        setLoggedUserCountry,
        loggedUserCollectorSince,
        setLoggedUserCollectorSince,
        loggedUserSocialLinks,
        setLoggedUserSocialLinks
        
    } = useContext(AppContext)
    const [loading, setLoading] = useState(true)
    const [socialLinkModalOpen, setSocialLinkModalOpen] = useState(false)
    const [linkToBeEdited, setLinkToBeEdited] = useState(null)
    const [editableUserInfo, setEditableUserInfo] = useState({
        firstName : loggedUserFirstName || "",
        lastName : loggedUserLastName || "",
        email : loggedUserEmail || "",
        role : loggedUserRole || "",
        level : loggedUserLevel || "",
        followersCount : loggedUserFollowesCount || "",
        bio : loggedUserBio || "",
        nickName : loggedUserName || "",
        gender : loggedUserGender || "",
        dateOfBirth : loggedUserDateOfBirth || "",
        country : loggedUserCountry || "",
        collectorSince : loggedUserCollectorSince || "",
        socialLinks : loggedUserSocialLinks || []
    })
    const [userNameOKtoSave, setUserNameOKtoSave] = useState(false)
    const [displayUserNameCorrectFormat ,setDisplayUserNameCorrectFormat] = useState(false)
    const [isEditingUserInfo, setIsEditingUserInfo] = useState(false)
    const [isEditingPersonalInfo, setIsEditingPersonalInfo] = useState(false)
    const [updateDataError, setUpdateDataError] = useState({})
    const [dobDay, setDobDay] = useState(0)
    const [dobMonth, setDobMonth] = useState(0)
    const [dobYear, setDobYear] = useState(0)
    const fileInputRef = useRef(null);
    const typeTimeoutRef = useRef(null)
    const initialUserInfoRef = useRef({
        nickName: "",
        collectorSince : "",
        bio: ""
    })
    const initialPersonalInfoRef = useRef({
        firstName: "",
        lastName: "",
        gender: "",
        dateOfBirth: "",
        country : ""
    })

    usePageTitle(`${loggedUserName}´s Profile`)

    async function updateUser(updatedValues){
        const url = `${API_BASEURL}users/${loggedUserId}`;
        const opts = {
            method : "PUT",
            headers : {'Content-Type' : 'application/json'},
            body : JSON.stringify(updatedValues)
        }
        const response = await fetch(url, opts)
        return response
    }

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

    const handleCollectorSinceChange = (e)=>{
        setEditableUserInfo(prev=>({
            ...prev,
            collectorSince : e.target.value
        }))
    }

    const handleEditUserInfo=()=>{
        setIsEditingUserInfo(true)
        initialUserInfoRef.current = {
            nickName : editableUserInfo.nickName,
            collectorSince : editableUserInfo.collectorSince,
            bio : editableUserInfo.bio
        }
    }

    const handleSaveUserInfo=async()=>{
        
        const initial = initialUserInfoRef.current;
        if(
            editableUserInfo.nickName === initial.nickName &&
            editableUserInfo.collectorSince === initial.collectorSince &&
            editableUserInfo.bio === initial.bio
        ){
            toast("No changes to save", {icon: "⚠️"})
            return
        }

        const updatedValues = {};
        editableUserInfo.nickName !== initial.nickName ? (updatedValues.nickName = editableUserInfo.nickName) : null
        editableUserInfo.collectorSince !== initial.collectorSince ? (updatedValues.collectorSince = editableUserInfo.collectorSince) : null
        editableUserInfo.bio !== initial.bio ? (updatedValues.bio = editableUserInfo.bio) : null

        if(Object.keys(updatedValues).length===0){
            toast("No changes to save", {icon: "⚠️"});
            setEditableUserInfo(prev=>({
                ...prev,
                nickName : initial.nickName,
                collectorSince : initial.collectorSince,
                bio : initial.bio
            }))
        }

        const t = toast.loading("Saving user data...", {duration:10000})
        const url = `${API_BASEURL}users/${loggedUserId}`;
        const opts = {
            method : "PUT",
            headers : {'Content-Type' : 'application/json'},
            body : JSON.stringify(updatedValues)
        }
        const response = await fetch(url, opts)
        if(response.status===200){
            if(updatedValues.nickName){
                setLoggedUserName(updatedValues.nickName)
            }
            if(updatedValues.collectorSince){
                setLoggedUserCollectorSince(updatedValues.collectorSince)
            }
            if(updatedValues.bio){
                setLoggedUserBio(updatedValues.bio)
            }
            toast.success("User data updated!", {id: t, duration : 2000})
        }else{
            toast.error("Error saving data", {id: t, duration : 2000})
        }
        setIsEditingUserInfo(false)
    }

    const handleEditPersonalInfo=()=>{
        setIsEditingPersonalInfo(true)
        initialPersonalInfoRef.current = {
            firstName : editableUserInfo.firstName,
            lastName : editableUserInfo.lastName,
            gender : editableUserInfo.gender,
            dateOfBirth : editableUserInfo.dateOfBirth,
            country : editableUserInfo.country
        }
    }

    const handleSavePersonalInfo=async()=>{
        
        const initial = initialPersonalInfoRef.current;
        let formattedDob = null;

        if(dobDay && dobMonth && dobYear){
            const localDate = new Date(dobYear, dobMonth - 1, dobDay);
            if (
                localDate.getFullYear() !== Number(dobYear) ||
                localDate.getMonth() !== Number(dobMonth - 1) ||
                localDate.getDate() !== Number(dobDay)
            ) {
                toast.error("Invalid date of birth");
                return;
            }

            formattedDob = `${dobYear}-${String(dobMonth).padStart(2, "0")}-${String(dobDay).padStart(2, "0")}`;
        }
        
        if(
            editableUserInfo.firstName === initial.firstName &&
            editableUserInfo.lastName === initial.lastName &&
            editableUserInfo.gender === initial.gender &&
            editableUserInfo.country === initial.country &&
            formattedDob === initial.dateOfBirth.slice(0, 10)
        ){
            toast("No changes to save", {icon: "⚠️"})
            return
        }

        const updatedValues = {};
        editableUserInfo.firstName !== initial.firstName ? (updatedValues.firstName = editableUserInfo.firstName) : null
        editableUserInfo.lastName !== initial.lastName ? (updatedValues.lastName = editableUserInfo.lastName) : null
        editableUserInfo.gender !== initial.gender ? (updatedValues.gender = editableUserInfo.gender) : null
        editableUserInfo.country !== initial.country ? (updatedValues.country = editableUserInfo.country) : null
        formattedDob !== initial.dateOfBirth ? (updatedValues.dateOfBirth = formattedDob) : null

        if(Object.keys(updatedValues).length===0){
            toast("No changes to save", {icon: "⚠️"});
            setEditableUserInfo(prev=>({
                ...prev,
                firstName : initial.firstName,
                lastName : initial.lastName,
                gender : initial.gender,
                dateOfBirth : initial.dateOfBirth,
                country : initial.country
            }))
        }

        const t = toast.loading("Saving user data...", {duration:10000})
        try {
            const response = await updateUser(updatedValues)
            
            if(response.status===200){
                if(updatedValues.firstName){
                    setLoggedUserFirstName(updatedValues.firstName)
                }
                if(updatedValues.lastName){
                    setLoggedUserLastName(updatedValues.lastName)
                }
                if(updatedValues.gender){
                    setLoggedUserGender(updatedValues.gender)
                }
                if(updatedValues.dateOfBirth){
                    setLoggedUserDateOfBirth(updatedValues.dateOfBirth)
                }
                if(updatedValues.country){
                    setLoggedUserCountry(updatedValues.country)
                }
                toast.success("User data updated!", {id: t, duration : 2000})
            }else{
                toast.error("Error saving data", {id: t, duration : 2000})
            }
            setIsEditingPersonalInfo(false)
        } catch (error) {
            toast.error("Error saving data", { id: t, duration: 2000 });
        }
    }

    const handleCopyUrl = async()=>{
        const url = `${FRONT_URL}/collector/${loggedUserName}`;
        await navigator.clipboard.writeText(url)
        toast.success("Link copied!", {duration: 2000})
    }

    const handleAddSocialLink =()=>{
        if(loggedUserRole==='FREE'){
            if(editableUserInfo.socialLinks.length){
                toast("Upgrade to Basic to add more social links", {duration: 3000})
            }else{
                setSocialLinkModalOpen(true)
            }
        }

        if(loggedUserRole==='BASIC'){
            if(editableUserInfo.socialLinks.length<3){
                setSocialLinkModalOpen(true)
            }else{
                toast("More links coming soon for Premium plans", {duration: 3000})
            }
        }

        if(loggedUserRole==='PREMIUM'){
            if(editableUserInfo.socialLinks.length<6){
                setSocialLinkModalOpen(true)
            }else{
                toast("Upgrade to Pro to add more social links", {duration: 3000})
            }
        }

        if(loggedUserRole==='PRO'){
            if(editableUserInfo.socialLinks.length<10){
                setSocialLinkModalOpen(true)
            }else{
                toast("Maximum of 10 social links reached", {duration: 3000})
            }
        }

    }
    const handleSocialLinkModalOnSave =async(data, mode)=>{
        const t = toast.loading("Updating social links...", {duration : 5000})
        let socialLinks = loggedUserSocialLinks
        if(mode==='edit'){
            const updatedSocialLinks = loggedUserSocialLinks.map(link=>{
                if(link._id===data._id){
                    return{
                        ...link,
                        ...data
                    }
                }
                return link
            })
            socialLinks = updatedSocialLinks
        }else{
            socialLinks = [
                ...loggedUserSocialLinks,
                {
                    platform : data.platform,
                    alias : data.alias,
                    url : data.url,
                    label : data.label
                }
            ]
        }
        const response = await updateUser({socialLinks})
        if(response.status===200){
            const responseData = await response.json()
            setLoggedUserSocialLinks(responseData.data.socialLinks)
            setEditableUserInfo(prev=>({
                ...prev,
                socialLinks : responseData.data.socialLinks
            }))
            toast.success("Social links updated!", {duration : 2000, id: t})
            setSocialLinkModalOpen(false)
            setLinkToBeEdited(null)
        }else{
            toast.error("Error updating social links, try again", {duration : 2000, id: t})
        }
    }

    const handleSocialLinkModalOnCancel =()=>{
        setSocialLinkModalOpen(false)
        setLinkToBeEdited(null)
    }
    console.log(loggedUserSocialLinks)
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
            setLoggedUserGender(loggedUser.gender)
            setLoggedUserDateOfBirth(loggedUser.dateOfBirth)
            setLoggedUserCountry(loggedUser.country)
            setLoggedUserCollectorSince(loggedUser.collectorSince)
            setLoggedUserSocialLinks(loggedUser.socialLinks || [])
            setEditableUserInfo(prev=>(
                {
                    ...prev,
                    firstName : loggedUser.firstName,
                    lastName : loggedUser.lastName,
                    email : loggedUser.email,
                    role : loggedUser.role,
                    level : loggedUser.level,
                    followersCount : loggedUser.followersCount,
                    bio : loggedUser.bio || "",
                    gender : loggedUser.gender || "",
                    dateOfBirth : loggedUser.dateOfBirth,
                    country : loggedUser.country || "",
                    collectorSince : loggedUser.collectorSince || "",
                    socialLinks : loggedUser.socialLinks || []
                }
            ))
            if(loggedUser.dateOfBirth){
                const date = new Date(loggedUser.dateOfBirth);

                setDobDay(date.getUTCDate())
                setDobMonth(date.getUTCMonth()+1) //getMonth es 0-11
                setDobYear(date.getUTCFullYear())
            }else{
                setDobDay("")
                setDobMonth("")
                setDobYear("")
            }
            setLoading(false)
        }
        if(
            !loggedUserFirstName ||
            !loggedUserLastName ||
            !loggedUserEmail ||
            !loggedUserRole ||
            !loggedUserLevel ||
            !loggedUserFollowesCount ||
            !loggedUserBio ||
            !loggedUserGender ||
            !loggedUserDateOfBirth ||
            !loggedUserCountry ||
            !loggedUserCollectorSince ||
            !loggedUserSocialLinks
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
                bio : loggedUserBio || "",
                nickName : loggedUserName,
                gender : loggedUserGender || "",
                dateOfBirth : loggedUserDateOfBirth,
                country : loggedUserCountry,
                collectorSince : loggedUserCollectorSince,
                socialLinks : loggedUserSocialLinks
            }))
            if(loggedUserDateOfBirth){
                const date = new Date(loggedUserDateOfBirth);

                setDobDay(date.getUTCDate())
                setDobMonth(date.getUTCMonth()+1) //getMonth es 0-11
                setDobYear(date.getUTCFullYear())
            }else{
                setDobDay("")
                setDobMonth("")
                setDobYear("")
            }
            setLoading(false)
        }
    },[])
    console.log(loggedUserSocialLinks)
    useEffect(()=>{
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
                            </div>
                        </div>
                        <p>{`${loggedUserFirstName} ${loggedUserLastName}`}</p>
                        <label htmlFor="collectorSince">Collector since</label>
                        <input 
                            type="number"
                            value={editableUserInfo.collectorSince}
                            disabled={!isEditingUserInfo}
                            onChange={handleCollectorSinceChange}
                        />
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
                        <a href={`${FRONT_URL}/collector/${loggedUserName}`}>
                            {`thediecaster.com/collector/${loggedUserName}`}
                        </a>
                        <Copy
                            className={styles.copyUrlBtn}
                            onClick={handleCopyUrl}
                        />
                    </div>
                </div>

                <div className={styles.personalInfo}>
                    {isEditingPersonalInfo ? <Save onClick={handleSavePersonalInfo}/> :<Edit onClick={handleEditPersonalInfo}/>}
                    <p className={styles.sectionTitle}>About you</p>
                    <label htmlFor="firstName">Name</label>
                    <input 
                        id='firstName'
                        type="text"
                        value={editableUserInfo.firstName}
                        disabled={!isEditingPersonalInfo}
                        onChange={(e)=>setEditableUserInfo(prev=>({...prev, firstName : e.target.value}))}
                    />
                    <div className={styles.formInputError}>
                        {updateDataError.firstName ? editableUserInfo.firstName.length<3 ? <p>Name is too short</p> : editableUserInfo.firstName.length>50 ? <p>Name is too long</p> : <p>Invalid characters in Name</p> : <p/>}
                    </div>
                    <label htmlFor="lastName">Last name</label>
                    <input 
                        id='lastName'
                        type="text"
                        value={editableUserInfo.lastName}
                        disabled={!isEditingPersonalInfo}
                        onChange={(e)=>setEditableUserInfo(prev=>({...prev, lastName : e.target.value}))}
                    />
                    <div className={styles.formInputError}>
                        {updateDataError.lastName ? editableUserInfo.lastName .length<3 ? <p>Last name is too short</p> : editableUserInfo.lastName .length>50 ? <p>Last name is too long</p> : <p>Invalid characters in Last Name</p>  : <p/>}
                    </div>
                    <label htmlFor="gender">Gender</label>
                    <select 
                        name="gender" 
                        id="gender" 
                        value={editableUserInfo.gender}
                        disabled={!isEditingPersonalInfo}
                        onChange={(e)=>{
                            setEditableUserInfo(prev=>({
                                ...prev,
                                gender : e.target.value
                            }))
                        }}
                    >
                        <option value=""></option>
                        <option value="male">Male</option>
                        <option value="female">Female</option>
                    </select>
                    <label>Date of Birth</label>
                    <div className={styles.dobContainer}>
                        <input 
                            id='dobDay'
                            type="number"
                            value={dobDay}
                            disabled={!isEditingPersonalInfo}
                            onChange={(e)=>setDobDay(Number(e.target.value))}
                        />
                        <input 
                            id='dobMonth'
                            type="number"
                            value={dobMonth}
                            disabled={!isEditingPersonalInfo}
                            onChange={(e)=>setDobMonth(Number(e.target.value))}
                        />
                        <input 
                            id='dobYear'
                            type="number"
                            value={dobYear}
                            disabled={!isEditingPersonalInfo}
                            onChange={(e)=>setDobYear(Number(e.target.value))}
                        />
                    </div>
                    <div className={styles.dobErrors}>
                        {updateDataError.dobDay ? <p>Invalid Day</p> : <p></p>}
                        {updateDataError.dobMonth ? <p>Invalid Month</p> : <p></p>}
                        {updateDataError.dobYear ? <p>Invalid Year</p> : <p></p>}
                    </div>
                    <CountriesSelect 
                        className={styles.countriesDropDown}
                        value={editableUserInfo.country}
                        disabled={!isEditingPersonalInfo}
                        onChange={(option)=>setEditableUserInfo(prev=>({
                            ...prev,
                            country : option.value
                        }))}
                    />
                </div>

                <div className={styles.social}>
                        <p className={styles.sectionTitle}>Social links</p>
                        {editableUserInfo.socialLinks.length ? editableUserInfo.socialLinks.map(link=>(
                            <SocialLinkCard link={link} setLinkToBeEdited={setLinkToBeEdited} setSocialLinkModalOpen={setSocialLinkModalOpen}/>
                        )) : null}
                        <button 
                            type='button'
                            className={styles.addSocialLinkBtn}
                            onClick={handleAddSocialLink}
                        >
                            Add social link
                        </button>
                </div>

                <div className={styles.bottomContainer}>
                    <div className={styles.userStats}>
                        <p className={styles.sectionTitle}>Stats</p>
                        
                    </div>

                    <div className={styles.accountInfo}>

                    </div>
                </div>
            </div>

            {socialLinkModalOpen?
                <SocialLinkModal
                    editData={linkToBeEdited} 
                    onSave={handleSocialLinkModalOnSave} 
                    onCancel={handleSocialLinkModalOnCancel}
                /> : 
                null
            }
        </section>
    )
}