import './HomeScreen.css'
import { Link } from 'react-router'

export function HomeScreen({loggedUserId}){
    return(
        <section className='HomeBody'>
            <h1>Home of {loggedUserId}</h1>
            <ul>
                <li><Link to="/newCar">Add New Car</Link></li>
                <li><Link to="/resetPass">Reset Password</Link></li>
                <li><Link to="/profile">Profile</Link></li>
            </ul>
        </section>
    )
}