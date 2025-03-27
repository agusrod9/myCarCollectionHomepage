import './ChangePassScreen.css';
import { Header } from '../components/Header'
import { ChangePassForm } from '../components/ChangePassForm.jsx'

export function ChangePassScreen({loggedUserId}){
    return(
        <section className='ChangePassBody'>
            <Header loggedUserId={loggedUserId} />
            <div className='formContainer'>
                <ChangePassForm />
            </div>
        </section>
    )
}