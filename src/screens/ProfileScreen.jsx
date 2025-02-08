import { Header } from '../components/Header'
import './ProfileScreen.css'

export function ProfileScreen({loggedUserId}){
    return(
        <section className='ProfileScreenBody'>
            <Header loggedUserId={loggedUserId} />
            <h1>Profile Screen of {loggedUserId}</h1>
        </section>
    )
}