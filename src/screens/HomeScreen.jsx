import './HomeScreen.css'
import { Header } from '../components/Header.jsx'
import { DashBoard } from '../components/DashBoard.jsx'
import { useContext } from 'react'
import { AppContext } from '../context/AppContext.jsx'

export function HomeScreen({loggedUserId, loggedUserName}){
    const {setLoggedUserId, setLoggedUserName} = useContext(AppContext)

    const handleLogOut = async ()=>{
        const url = 'https://mycarcollectionapi.onrender.com/api/sessions/logout'
        const opts = { method : 'POST', credentials: 'include'}
        await fetch(url, opts)
        setLoggedUserId(null)
        setLoggedUserName(null)
        navigate('/')
    }
    return(
        <section className='homeBody'>
            <Header loggedUserId={loggedUserId} loggedUserName={loggedUserName} handleLogOut={()=>{handleLogOut()}}/>
            <div className='main'>
                <DashBoard />
            </div>
        </section>
    )
}