import './LoginScreen.css'
import { Login } from "../components/Login";
//import { useNavigate } from 'react-router';



export function LoginScreen(){
    //const navigate = useNavigate()
    const handleLoginSuccess = ()=>{
        console.log("Login existoso, navegando")
        window.location.href='/' //---> RESOLVER ESSTE PROBLEMA, NO ESTA FUNCIONANDO LA NAVEGACION, POR ESO FUERZO A QUE NAVEGUE ASI -> ESTA MAL
        //navigate("/")
    }
    return(
        <section className="LoginBody">
            <Login onSuccess={handleLoginSuccess}/>
        </section>
    )
}