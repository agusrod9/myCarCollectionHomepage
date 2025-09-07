import './Register.css'
import { useState } from "react"
import { Link } from 'react-router'
import validator from 'validator'

export function Register(){
    const [email, setEmail] = useState("")
    const [name, setName] = useState("")
    const [lastName, setLastName] = useState("")
    const [password, setPassword] = useState("")
    const [password2, setPassword2] = useState("")
    const [registerError, setRegisterError] = useState("")

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
        const url = `https://mycarcollectionapi.onrender.com/api/sessions/google`
        window.location.assign(url);
    }

    async function registerToApi(name, lastName, mail, pass){
        const url = `https://mycarcollectionapi.onrender.com/api/sessions/register`
        const fetchData = {
            "firstName" : name,
            "lastName" : lastName,
            "email" : mail ,
            "contactEmail" : mail,
            "profilePicture" : "imgProfile",
            "password" : pass
        }
        const opts = {
            method : "POST",
            headers : {'Content-Type' : 'application/json'},
            credentials : 'include',
            body : JSON.stringify(fetchData)
        }
        const response = await fetch(url,opts)
        const responseData = await response.json()

        if(response.status != 200){
            setRegisterError(responseData.message)
        }else{
            alert(responseData.message)
            setName("")
            setLastName("")
            setEmail("")
            setPassword("")
            setPassword2("")
            setRegisterError("")
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
                <label htmlFor="register-password-inp">Contraseña</label>
                <input type="password" name='password' id='register-password-inp' placeholder='Choose your password' value={password} onChange={handlePasswordChange} />
                <label htmlFor="register-password2-inp">Repite la contraseña</label>
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