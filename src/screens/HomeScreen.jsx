import './HomeScreen.css'
import { Link } from 'react-router'
import { Header } from '../components/Header.jsx'
import { DashBoard } from '../components/DashBoard.jsx'

export function HomeScreen({loggedUserId, loggedUserName}){

    return(
        <section className='homeBody'>
            <Header loggedUserId={loggedUserId}/>
            <h1>Welcome back {loggedUserName}!</h1>
            <div className='main'>
                <DashBoard />
            </div>
        </section>
    )
}