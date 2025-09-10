import './HomeScreen.css'
import { Header } from '../components/Header.jsx'
import { DashBoard } from '../components/DashBoard.jsx'
import { useContext } from 'react'
import { AppContext } from '../context/AppContext.jsx'

export function HomeScreen({loggedUserId, loggedUserName, loggedUserProfilePicture}){
    const {setLoggedUserId, setLoggedUserName, handleLogOut} = useContext(AppContext)

    
    return(
        <section className='homeBody'>
            <Header loggedUserId={loggedUserId} loggedUserName={loggedUserName} loggedUserProfilePicture= {loggedUserProfilePicture} handleLogOut={()=>{handleLogOut()}}/>
            <div className='main'>
                <DashBoard />
            </div>
        </section>
    )
}