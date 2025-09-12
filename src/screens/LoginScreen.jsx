import './LoginScreen.css'
import { Login } from "../components/Login";
import { useContext } from 'react';
import { AppContext } from '../context/AppContext';


export function LoginScreen(){
    const {handleLogin} = useContext(AppContext)
        
    return(
        <section className="LoginBody">
            <div className='formContainer'>
                <Login onSuccess={handleLogin}/>
            </div>
        </section>
    )
}