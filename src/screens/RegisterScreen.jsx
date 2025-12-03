import './RegisterScreen.css'
import {Register} from '../components/Register.jsx'
import usePageTitle from '../hooks/usePageTitle.js'

export function RegisterScreen(){
    usePageTitle("Register")
    return(
        <section className='RegisterBody'>
            <div className='formContainer'>
                <Register />
            </div>
        </section>
    )
}