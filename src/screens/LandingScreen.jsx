import './LandingScreen.css'
import { Link } from 'react-router'


export function LandingScreen(){
    return(
        <section className='LandingBody'>
            <h1>Landing Page</h1>
            <Link to='/login' >Login</Link>
        </section>
    )
}