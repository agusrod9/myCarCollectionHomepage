import ContactForm from '../components/ContactForm';
import styles from './ContactScreen.module.css';
import BackHomeNav from '../components/BackHomeNav';

export default function ContactScreen(){

    return(
        <section className={styles.contactBody}>
            <h1 className={styles.contactTitle}>Contact</h1>
            <ContactForm />
            <BackHomeNav />
        </section>
    )
}