import './HomeScreen.css'
import { Link } from 'react-router'
import { Header } from '../components/Header.jsx'
import { DashBoard } from '../components/DashBoard.jsx'
import { useContext, useEffect, useState } from 'react'

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
        <section className='homeBody'>
            <Header loggedUserId={loggedUserId}/>
            <h1>Bienvenido {loggedUsername}!</h1>
            <div className='main'>
                <DashBoard />
            </div>
        </section>
    )
}