import ContactForm from '../components/ContactForm';
import styles from './ContactScreen.module.css';
import BackHomeNav from '../components/BackHomeNav';
import { Header } from '../components/Header';
import { useContext } from 'react';
import { AppContext } from '../context/AppContext';

export default function ContactScreen(){
    const{loggedUserId, loggedUserName, loggedUserProfilePicture, handleLogOut} = useContext(AppContext)
    return(
        <section className={styles.contactBody}>
            {loggedUserId ?
                <Header loggedUserId={loggedUserId} loggedUserName={loggedUserName} loggedUserProfilePicture= {loggedUserProfilePicture} handleLogOut={()=>{handleLogOut(true)}}/>
                :
                null
            }
            <h1 className={styles.contactTitle}>Contact</h1>
            <ContactForm />
            {loggedUserId ?
                null
                :
                <BackHomeNav />
            }
        </section>
    )
}