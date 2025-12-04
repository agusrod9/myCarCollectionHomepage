import { useState } from 'react'
import styles from './Login.module.css'
import { Link } from 'react-router'
import { useNavigate } from 'react-router-dom'
import validator from 'validator';

const API_BASEURL = import.meta.env.VITE_API_BASEURL;

export function Login ({onSuccess}){
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [loginError, setLoginError] = useState("")
    const navigate = useNavigate()
    const handleLoginBtnClick =async (e)=>{
        e.preventDefault()
        setLoginError("")
        if(email=="" || password==""){
            setLoginError("Please enter E-mail and Passsword.")
        }else{
            if(!validator.isEmail(email)){
                setLoginError("E-Mail is invalid.")
                return
            }
            const resp = await loginToApi(email,password, navigate)
            if(resp.message == "USER LOGGED"){
                setEmail("")
            }
            setPassword("")
        }
        
    }

    const handleGoogleLoginBtnClick = async(e)=>{
        e.preventDefault()
        setLoginError("")
        const url = `${API_BASEURL}sessions/google`
        window.location.assign(url);
    }

    async function loginToApi(email, password, navigate){
        const url = `${API_BASEURL}sessions/login`
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
                onSuccess()
            }
            
        }else{
            if(responseData.message?.includes("USER NOT FOUND")){
                setLoginError("User not found.")
                return
            }
            if(responseData.message?.includes("USER MUST VERIFY MAIL FIRST")){
                setLoginError("You need to verify your E-Mail to login.")
                return
            }
            if(responseData.message?.includes("USER NO LONGER ACTIVE")){
                setLoginError("Your account is no longer active.")
                return
            }
            if(responseData.message?.includes("USER MUST LOGIN USING GOOGLE")){
                setLoginError("Please login using Google.")
                return
            }
            if(responseData.message?.includes("INVALID CREDENTIALS")){
                setLoginError("Invalid email or password.")
                return
            }
            //setLoginError(responseData.message)
        }
        return responseData
        
    }

    const handleEmailChange =(e)=>{
        setLoginError("")
        setEmail(e.target.value)
    }

    const handlePasswordChange =(e)=>{
        setLoginError("")
        setPassword(e.target.value)
    }


    return(
        <section className={styles.loginSection}>
            <h2>Login</h2>
            <form className={styles.loginForm}>
                <label htmlFor="login-email-inp">E-mail</label>
                <input type="email" name="email" id="login-email-inp" placeholder="Type your E-mail" value={email} onChange={handleEmailChange}/>
                <label htmlFor="login-password-inp">Password</label>
                <input type="password" name='password' id='login-password-inp' placeholder='Type your password' value={password} onChange={handlePasswordChange} onKeyDown={(e)=>{
                    if(e.key=='Enter'){
                        handleLoginBtnClick(e)
                    }
                }}/>
                <p className={styles.loginErrorLabel}>{loginError}</p>
                <p className={styles.loginLink}><Link to='/resetPass'>Forgot your password?</Link></p>
            </form>

            <button className={styles.loginBtn} onClick={handleLoginBtnClick}>
                Login
            </button>

            <div className={styles.altLogins}>
                <p>Or Login using:</p>
                <button className={`${styles.altLoginBtn} ${styles.googleLogin}`} onClick={handleGoogleLoginBtnClick}/>
                <button className={`${styles.altLoginBtn} ${styles.facebookLogin}`} onClick={()=>{alert("Feature Coming Soon")}}/>
            </div>
            <div className={styles.logininksContainer}>
                <p className={styles.loginLink}>E-mail not verified? <span><Link to='/verify'>Verify</Link></span></p>
                <p className={styles.loginLink}>Don´t have an account? <span><Link to='/register'>Register</Link></span> </p>
            </div>
        </section>
    )
}