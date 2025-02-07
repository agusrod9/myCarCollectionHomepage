import './LoginScreen.css'
import { Login } from "../components/Login";
import { useNavigate } from 'react-router';



export function LoginScreen(){
    const navigate = useNavigate()
    const handleLoginSuccess = ()=>{
        console.log("Login existoso, navegando")
        //window.location.href='/'
        navigate("/")
    }
    return(
        <section className="LoginBody">
            <Login onSuccess={handleLoginSuccess}/>
        </section>
    )
}