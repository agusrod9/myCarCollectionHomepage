import './LoginScreen.css'
import { Login } from "../components/Login";
import { Header } from '../components/Header';



export function LoginScreen(){
    const handleLoginSuccess = ()=>{
        window.location.href='/' //---> RESOLVER ESSTE PROBLEMA, NO ESTA FUNCIONANDO LA NAVEGACION, POR ESO FUERZO A QUE NAVEGUE ASI -> ESTA MAL
    }
    return(
        <section className="LoginBody">
            <div className='formContainer'>
                <Login onSuccess={handleLoginSuccess}/>
            </div>
        </section>
    )
}