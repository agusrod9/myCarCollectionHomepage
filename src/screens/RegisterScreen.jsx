import './RegisterScreen.css'
import {Register} from '../components/Register.jsx'

export function RegisterScreen(){
    return(
        <section className='RegisterBody'>
            <div className='formContainer'>
                <Register />
            </div>
        </section>
    )
}