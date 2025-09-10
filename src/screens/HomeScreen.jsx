import './HomeScreen.css'
import { Header } from '../components/Header.jsx'
import { DashBoard } from '../components/DashBoard.jsx'

export function HomeScreen({loggedUserId, loggedUserName}){

    return(
        <section className='homeBody'>
            <Header loggedUserId={loggedUserId} loggedUserName={loggedUserName}/>
            <h1>Welcome back {loggedUserName}!</h1>
            <div className='main'>
                <DashBoard />
            </div>
        </section>
    )
}