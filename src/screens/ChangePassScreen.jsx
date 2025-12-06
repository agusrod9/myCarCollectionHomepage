import styles from './ChangePassScreen.module.css';
import { Header } from '../components/Header'
import { ChangePassForm } from '../components/ChangePassForm.jsx'
import usePageTitle from '../hooks/usePageTitle.js';

export function ChangePassScreen(){
    usePageTitle("New password")
    return(
        <section className={styles.root}>
            <ChangePassForm />
        </section>
    )
}