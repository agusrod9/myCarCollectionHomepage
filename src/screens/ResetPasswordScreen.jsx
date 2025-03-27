import { Header } from '../components/Header'
import './ResetPasswordScreen.css'
import { ResetPassForm } from '../components/ResetPassForm'
export function ResetPasswordScreen({loggedUserId}){
    return(
        <section className='ResetPasswordBody'>
            <Header loggedUserId={loggedUserId} />
            <div className='formContainer'>
                <ResetPassForm />
            </div>
        </section>
    )
}