import styles from './ChangePassScreen.module.css';
import { ChangePassForm } from '../components/ChangePassForm.jsx'
import usePageTitle from '../hooks/usePageTitle.js';
import BackHomeNav from '../components/BackHomeNav.jsx';

export function ChangePassScreen(){
    usePageTitle("New password")
    return(
        <section className={styles.root}>
            <BackHomeNav />
            <ChangePassForm />
        </section>
    )
}