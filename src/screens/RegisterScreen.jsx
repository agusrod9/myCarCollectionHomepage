import styles from './RegisterScreen.module.css'
import {Register} from '../components/Register.jsx'
import usePageTitle from '../hooks/usePageTitle.js'
import BackHomeNav from '../components/BackHomeNav.jsx';

export function RegisterScreen(){
    usePageTitle("Register")
    
    return(
        <section className={styles.root}>
            <Register />
            <BackHomeNav />
        </section>
    )
}