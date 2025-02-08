import { Header } from '../components/Header'
import './ResetPasswordScreen.css'

export function ResetPasswordScreen({loggedUserId}){
    return(
        <section className='ResetPasswordBody'>
            <Header loggedUserId={loggedUserId} />
            <h1>Reset Password</h1>
        </section>
    )
}