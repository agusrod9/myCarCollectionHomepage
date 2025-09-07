import { Header } from '../components/Header'
import './ProfileScreen.css'

export function ProfileScreen({loggedUserId, loggedUserName}){
    return(
        <section className='ProfileScreenBody'>
            <Header loggedUserId={loggedUserId} />
            <h1>Profile Screen of {loggedUserName}</h1>
        </section>
    )
}