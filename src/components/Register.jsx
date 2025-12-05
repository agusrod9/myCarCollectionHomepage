import styles from './Register.module.css'
import { useState } from "react"
import { Link, useNavigate } from 'react-router'
import validator from 'validator'
import toast from 'react-hot-toast'
import { capitalize } from '../utils/textUtils.js'
import PasswordInput from './PasswordInput.jsx'

const API_BASEURL = import.meta.env.VITE_API_BASEURL;

export function Register(){
    const navigate = useNavigate()
    const [email, setEmail] = useState("")
    const [name, setName] = useState("")
    const [lastName, setLastName] = useState("")
    const [password, setPassword] = useState("")
    const [password2, setPassword2] = useState("")
    const [registerError, setRegisterError] = useState("")
    const lang = navigator.language.split('-')[0]

    const handleRegisterBtnClick =async (e)=>{
        e.preventDefault()
        setRegisterError("")
        if(email=="" || password=="" || password2=="" ||name=="" || lastName==""){
            return setRegisterError("Missing mandatory fields.")
        }

        if(!validator.isEmail(email)){
            return setRegisterError("E-Mail is invalid.")
        }

        if(password!=password2){
            return setRegisterError("Passwords don´t match.")
        }
        await registerToApi(name, lastName, email, password)
    }

    const handleGoogleLoginBtnClick = async(e)=>{
        e.preventDefault()
        setRegisterError("")
        const url = `${API_BASEURL}sessions/google`
        window.location.assign(url);
    }

    async function registerToApi(name, lastName, mail, pass){
        const t = toast.loading("Creating your account...", {duration : 20000})
        const url = `${API_BASEURL}sessions/register`
        const fetchData = {
            firstName : name,
            lastName : lastName,
            email : mail ,
            password : pass,
            settings : {
                language : lang
            }
        }
        const opts = {
            method : "POST",
            headers : {'Content-Type' : 'application/json'},
            credentials : 'include',
            body : JSON.stringify(fetchData)
        }
        const response = await fetch(url,opts)
        const responseData = await response.json()

        if(response.status != 201){
            if(responseData.message?.includes("USER ALREADY REGISTERED WITH GOOGLE")){
                setRegisterError("This E-mail is already associated with a Google login.")
                return
            }
            if(responseData.message?.includes("USER ALREADY REGISTERED")){
                setRegisterError("This E-mail is already registered. Please log in instead.")
                return
            }
            toast.error(`Couldn't create your account`, {duration : 2500, id:t})
        }else{
            toast.success(`Welcome aboard, ${name}! Check your inbox.`, {duration : 5000, id:t})
            setName("")
            setLastName("")
            setEmail("")
            setPassword("")
            setPassword2("")
            setRegisterError("")
            navigate("/verify")
        }

        return responseData
        
    }

    const handleEmailChange =(e)=>{
        setEmail(e.target.value)
    }

    const handlePasswordChange =(e)=>{
        setPassword(e.target.value)
    }

    const handlePassword2Change =(e)=>{
        setPassword2(e.target.value)
    }

    const handleNameChange=(e)=>{
        setName(capitalize(e.target.value))
    }

    const handleLastNameChange=(e)=>{
        setLastName(capitalize(e.target.value))
    }

    return(
        <section className={styles.registerSection}>
            <h2>Register</h2>
            <form className={styles.registerForm}>
                <label htmlFor="register-name-inp">Name</label>
                <input type="text" name="name" id="register-name-inp" placeholder="Type your name" value={name} onChange={handleNameChange}/>
                <label htmlFor="register-name-inp">Last Name</label>
                <input type="text" name="lastName" id="register-lastName-inp" placeholder="Type your Last Name" value={lastName} onChange={handleLastNameChange}/>
                <label htmlFor="register-email-inp">E-mail</label>
                <input type="email" name="email" id="register-email-inp" placeholder="Type your E-mail" value={email} onChange={handleEmailChange}/>
                <label htmlFor="register-password-inp">Password</label>
                <PasswordInput placeholder='Choose your password' value={password} onChange={handlePasswordChange}/>
                <label htmlFor="register-password2-inp">Confirm Password</label>
                <PasswordInput placeholder='Re-Enter your password' value={password2} onChange={handlePassword2Change} onKeyDown={(e)=>{
                    if(e.key=='Enter'){
                        handleRegisterBtnClick(e)
                    }
                }}/>
                <p className={styles.registerErrorLabel}>{registerError}</p>
            </form>

            <button className={styles.registerBtn} onClick={handleRegisterBtnClick}>
                Register
            </button>

            <div className='altLogins'>
                <p>Or Sign up using:</p>
                <button className={`${styles.altLoginBtn} ${styles.googleLogin}`} onClick={handleGoogleLoginBtnClick}/>
                <button className={`${styles.altLoginBtn} ${styles.facebookLogin}`} onClick={()=>{alert("Feature Coming Soon")}}/>
            </div>
            <div className={styles.loginLinksContainer}>
                <p className={styles.loginLink}>E-mail not verified? <span><Link to='/verify'>Verify</Link></span></p>
                <p className={styles.loginLink}>Already have an account? <span><Link to='/login' >Login</Link></span> </p>
            </div>
        </section>
    )
}