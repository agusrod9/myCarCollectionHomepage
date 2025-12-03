import { Header } from '../components/Header'
import './ResetPasswordScreen.css'
import { ResetPassForm } from '../components/ResetPassForm'
import usePageTitle from '../hooks/usePageTitle'
export function ResetPasswordScreen({loggedUserId}){
    usePageTitle("New password")
    return(
        <section className='ResetPasswordBody'>
            <div className='formContainer'>
                <ResetPassForm />
            </div>
        </section>
    )
}