import styles from './ResetPasswordScreen.module.css'
import { ResetPassForm } from '../components/ResetPassForm'
import usePageTitle from '../hooks/usePageTitle'
import BackHomeNav from '../components/BackHomeNav'
export function ResetPasswordScreen(){
    usePageTitle("New password")
    return(
        <section className={styles.root}>
            <BackHomeNav />
            <ResetPassForm />
        </section>
    )
}