import ContactForm from '../components/ContactForm';
import styles from './ContactScreen.module.css';

export default function ContactScreen(){
    return(
        <section className={styles.contactBody}>
            <h1 className={styles.contactTitle}>Contact</h1>
            <ContactForm />
        </section>
    )
}