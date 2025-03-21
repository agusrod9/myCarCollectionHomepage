import { useState } from 'react'
import './Login.css'
import { Link } from 'react-router'
import { useNavigate } from 'react-router-dom'


export function Login ({onSuccess}){
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const navigate = useNavigate()
    const handleLoginBtnClick =async (e)=>{
        e.preventDefault()
        if(email=="" || password==""){
            alert("Faltan datos")
        }else{
            await loginToApi(email,password, navigate)
            setEmail("")
            setPassword("")
        }
        
    }

    const handleGoogleLoginBtnClick = async(e)=>{
        e.preventDefault()
        const url = `https://mycarcollectionapi.onrender.com/api/sessions/google`
        window.location.assign(url);
    }

    async function loginToApi(email, password, navigate){
        const url = `https://mycarcollectionapi.onrender.com/api/sessions/login`
        const data = {email , password}
        const opts = {
            method : 'POST',
            headers : {'Content-Type' : 'application/json'},
            credentials : 'include',
            body : JSON.stringify(data)
        }
        const response = await fetch(url,opts)
        const responseData = await response.json()
        if(response.status==200){
            if(responseData.mustResetPass == true){
                navigate('/resetPass')
                return
            }
            if(onSuccess){
                onSuccess()
            }
            
        }
        return responseData
        
    }

    const handleEmailChange =(e)=>{
        setEmail(e.target.value)
    }

    const handlePasswordChange =(e)=>{
        setPassword(e.target.value)
    }


    return(
        <section className="login-section">
            <h2>Login</h2>
            <form className="login-form">
                <label htmlFor="login-email-inp">E-mail</label>
                <input type="email" name="email" id="login-email-inp" placeholder="Ingresa tu E-mail" value={email} onChange={handleEmailChange}/>
                <label htmlFor="login-password-inp">Contraseña</label>
                <input type="password" name='password' id='login-password-inp' placeholder='Ingresa tu contraseña' value={password} onChange={handlePasswordChange} />
                <button id='login-btn' onClick={handleLoginBtnClick}>
                    Ingresar
                </button>
            </form>
            <p><Link to='/resetPass'>Forgot your password?</Link></p>
            <p>Don´t have an account? <span><Link to='/register'>Register</Link></span> </p>
            <button id='googleLogin-btn' onClick={handleGoogleLoginBtnClick}>
                Ingresar con google
            </button>
            <Link to='/verify'>Verificar Mail</Link>
        </section>
    )
}