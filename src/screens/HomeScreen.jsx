import './HomeScreen.css'
import { Link } from 'react-router'
import { Header } from '../components/Header.jsx'
import { useEffect, useState } from 'react'

export function HomeScreen({loggedUserId}){
    const [loggedUsername, setLoggedUsername] = useState(null)

    useEffect(()=>{
        async function getLoggedUsername() {
            try {
                const url = 'https://mycarcollectionapi.onrender.com/api/sessions/whoIsOnline'
                const opts = {method: 'POST', credentials: 'include'}
                const response = await fetch(url, opts)
                const responseData = await response.json()
                const userName = responseData.userName
                setLoggedUsername(userName)
            } catch (error) {
                
            }
        }
        getLoggedUsername()
    }, [])

    return(
        <section className='HomeBody'>
            <Header loggedUserId={loggedUserId}/>
            <h1>Home of {loggedUsername}</h1>
            <ul>
                <li><Link to="/newCar">Add New Car</Link></li>
                <li><Link to="/resetPass">Reset Password</Link></li>
                <li><Link to="/profile">Profile</Link></li>
            </ul>
        </section>
    )
}