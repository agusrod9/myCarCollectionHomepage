import './RegisterScreen.css'
import {Register} from '../components/Register.jsx'
import { Header } from '../components/Header.jsx'

export function RegisterScreen(){
    return(
        <section className='RegisterBody'>
            <Header />
            <div className='formContainer'>
                <Register />
            </div>
        </section>
    )
}