import './Register.css'
import { useState } from "react"
import { Link, useNavigate } from 'react-router'
import validator from 'validator'
import toast from 'react-hot-toast'

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
            return setRegisterError("Invalid E-mail address")
        }

        if(password!=password2){
            return setRegisterError("Passwords don´t match.")
        }
        await registerToApi(name, lastName, email, password)
    }

    const handleGoogleLoginBtnClick = async(e)=>{
        e.preventDefault()
        setRegisterError("")
        const url = `${API_BASEURL}/api/sessions/google`
        window.location.assign(url);
    }

    async function registerToApi(name, lastName, mail, pass){
        const t = toast.loading("Creating your account...", {duration : 20000})
        const url = `${API_BASEURL}/api/sessions/register`
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
            setRegisterError(responseData.message)
            toast.error(`Couldn't create your account`, {duration : 2000, id:t})
        }else{
            toast.success(`Welcome aboard, ${name}`, {duration : 2000, id:t})
            alert(responseData.message)
            setName("")
            setLastName("")
            setEmail("")
            setPassword("")
            setPassword2("")
            setRegisterError("")
            navigate("/")
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
        setName(e.target.value)
    }

    const handleLastNameChange=(e)=>{
        setLastName(e.target.value)
    }

    return(
        <section className="register-section">
            <h2>Register</h2>
            <form className="register-form">
                <label htmlFor="register-name-inp">Name</label>
                <input type="text" name="name" id="register-name-inp" placeholder="Type your name" value={name} onChange={handleNameChange}/>
                <label htmlFor="register-name-inp">Last Name</label>
                <input type="text" name="lastName" id="register-lastName-inp" placeholder="Type your Last Name" value={lastName} onChange={handleLastNameChange}/>
                <label htmlFor="register-email-inp">E-mail</label>
                <input type="email" name="email" id="register-email-inp" placeholder="Type your E-mail" value={email} onChange={handleEmailChange}/>
                <label htmlFor="register-password-inp">Password</label>
                <input type="password" name='password' id='register-password-inp' placeholder='Choose your password' value={password} onChange={handlePasswordChange} />
                <label htmlFor="register-password2-inp">Confirm Password</label>
                <input type="password" name='password2' id='register-password2-inp' placeholder='Re-Enter your password' value={password2} onChange={handlePassword2Change} />
                <p id='registerErrorLabel'>{registerError}</p>
            </form>

            <button id='register-btn' onClick={handleRegisterBtnClick}>
                Register
            </button>

            <div className='altLogins'>
                <p>Or Sign up using:</p>
                <button className="altLoginBtn" id='googleLogin' onClick={handleGoogleLoginBtnClick}/>
                <button className= "altLoginBtn" id='facebookLogin' onClick={()=>{alert("Feature Coming Soon")}}/>
            </div>
            <div className='login-linksContainer'>
                <p className='loginLink'>E-mail not verified? <span><Link to='/verify'>Verify</Link></span></p>
                <p className='loginLink'>Already have an account? <span><Link to='/login' >Login</Link></span> </p>
            </div>
        </section>
    )
}