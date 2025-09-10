import { useContext, useEffect } from 'react'
import './ProfileScreen.css'
import { AppContext } from '../context/AppContext'
import { Header } from '../components/Header'

export function ProfileScreen({loggedUserId, loggedUserName, loggedUserProfilePicture}){

    const{loggedUserContactEmail, loggedUserFirstName, loggedUserLastName, logged, setLoggedUserName, setLoggedUserProfilePicture, setLoggedUserFirstName, setLoggedUserLastName, setLoggedUserContactEmail, handleLogOut } = useContext(AppContext)


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
            console.log(loggedUser);
            
            setLoggedUserFirstName(loggedUser.firstName)
            setLoggedUserLastName(loggedUser.lastName)
            setLoggedUserContactEmail(loggedUser.contactEmail)
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
                <input type="text" name="" id="" value={loggedUserFirstName} />
                <label>Last Name</label>
                <input type="text" name="" id="" value={loggedUserLastName} />
                <label>Contact E-Mail</label>
                <input type="text" name="" id="" value={loggedUserContactEmail} />
            </div>
        </section>
    )
}