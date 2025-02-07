import './LoginScreen.css'
import { Login } from "../components/Login";
import { useNavigate } from 'react-router-dom';



export function LoginScreen(){
    const nav = useNavigate()
    const handleLoginSuccess = ()=>{
        console.log("Login existoso, navegando")
        //nav('/') not working idkw
    }
    return(
        <section className="LoginBody">
            <Login onSuccess={handleLoginSuccess}/>
        </section>
    )
}