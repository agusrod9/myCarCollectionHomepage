import { useContext, useState } from 'react'
import './Login.css'
import { Link } from 'react-router'
import { useNavigate } from 'react-router-dom'
import { AppContext } from '../context/AppContext'


export function Login ({onSuccess}){
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [loginError, setLoginError] = useState("")
    const navigate = useNavigate()
    const {setLoggedUserId} = useContext(AppContext)
    const handleLoginBtnClick =async (e)=>{
        e.preventDefault()
        setLoginError("")
        if(email=="" || password==""){
            setLoginError("Missing mandatory fields.")
        }else{
            await loginToApi(email,password, navigate)
            setEmail("")
            setPassword("")
        }
        
    }

    const handleGoogleLoginBtnClick = async(e)=>{
        e.preventDefault()
        setLoginError("")
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
                navigate('/changePass')
                return
            }
            if(onSuccess){
                setLoggedUserId('67dadf9ce155a59a2a232584')
                onSuccess()
            }
            
        }else{
            setLoginError(responseData.message)
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
                <div></div>
                <input type="email" name="email" id="login-email-inp" placeholder="Type your E-mail" value={email} onChange={handleEmailChange}/>
                <label htmlFor="login-password-inp">Password</label>
                <input type="password" name='password' id='login-password-inp' placeholder='Type your password' value={password} onChange={handlePasswordChange} />
                <p id='loginErrorLabel'>{loginError}</p>
                <p className='loginLink'><Link to='/resetPass'>Forgot your password?</Link></p>
            </form>

            <button id='login-btn' onClick={handleLoginBtnClick}>
                Login
            </button>

            <div className='altLogins'>
                <p>Or Login using:</p>
                <button className="altLoginBtn" id='googleLogin' onClick={handleGoogleLoginBtnClick}/>
                <button className= "altLoginBtn" id='facebookLogin' onClick={()=>{alert("Feature Coming Soon")}}/>
            </div>
            <div className='login-linksContainer'>
                <p className='loginLink'>E-mail not verified? <span><Link to='/verify'>Verify</Link></span></p>
                <p className='loginLink'>Don´t have an account? <span><Link to='/register'>Register</Link></span> </p>
            </div>
        </section>
    )
}