import './LoginScreen.css'
import { Login } from "../components/Login";
import { useContext } from 'react';
import { AppContext } from '../context/AppContext';
import usePageTitle from '../hooks/usePageTitle';


export function LoginScreen(){
    const {handleLogin} = useContext(AppContext)
    usePageTitle("Login")
        
    return(
        <section className="LoginBody">
            <div className='formContainer'>
                <Login onSuccess={handleLogin}/>
            </div>
        </section>
    )
}