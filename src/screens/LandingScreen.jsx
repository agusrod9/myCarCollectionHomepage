import styles from './LandingScreen.module.css'
import { Link } from 'react-router'


export function LandingScreen(){
    return(
        <section className={styles.LandingBody}>
            <h1>Landing Page</h1>
            <Link to='/login' >Login</Link>
        </section>
    )
}