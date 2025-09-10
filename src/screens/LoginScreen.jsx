import './LoginScreen.css'
import { Login } from "../components/Login";
import { useNavigate } from 'react-router-dom';
import { useContext } from 'react';
import { AppContext } from '../context/AppContext';



export function LoginScreen(){
    const navigate = useNavigate()
    const {setLoggedUserId, setLoggedUserName} = useContext(AppContext)
    const handleLoginSuccess = async()=>{
        const url = 'https://mycarcollectionapi.onrender.com/api/sessions/whoIsOnline'
        const opts = {method: 'POST', credentials: 'include'}
        const response = await fetch(url, opts)
        const responseData = await response.json()
        setLoggedUserId(responseData.userId)
        setLoggedUserName(responseData.userName)
        navigate('/')
    }
    return(
        <section className="LoginBody">
            <div className='formContainer'>
                <Login onSuccess={handleLoginSuccess}/>
            </div>
        </section>
    )
}