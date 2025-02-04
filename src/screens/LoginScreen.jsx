import './LoginScreen.css'
import { Login } from "../components/Login";
import { useNavigate } from 'react-router';



export function LoginScreen(){
    const navigate = useNavigate()
    return(
        <section className="LoginBody">
            <Login onSuccess={()=>{navigate('/')}} />
        </section>
    )
}