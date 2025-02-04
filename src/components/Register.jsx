import './Register.css'
import { useState } from "react"
import { Link } from 'react-router'

export function Register(){
    const [email, setEmail] = useState("")
    const [name, setName] = useState("")
    const [lastName, setLastName] = useState("")
    const [password, setPassword] = useState("")
    const [password2, setPassword2] = useState("")

    const handleRegisterBtnClick =async (e)=>{
        e.preventDefault()
        if(email=="" || password=="" || password2=="" ||name=="" || lastName==""){
            return alert("Faltan datos")
        }

        if(password!=password2){
            return alert("Contraseñas no coinciden")
        }
        
        let response = await registerToApi(name, lastName, email, password)
        if(response.message != "USER REGISTERED"){
            alert(response.message)
        }else{
            alert(response.message)
            setName("")
            setLastName("")
            setEmail("")
            setPassword("")
            setPassword2("")
        }
        
        
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
            body : JSON.stringify(fetchData)
        }
        const response = await fetch(url,opts)
        const data = await response.json()
        return data
        
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
        <section id="register-section">
            <h2>Register</h2>
            <form className="register-form">
                <label htmlFor="register-name-inp">Nombre</label>
                <input type="text" name="name" id="register-name-inp" placeholder="Ingresa tu Nombre" value={name} onChange={handleNameChange}/>
                <label htmlFor="register-name-inp">Apellido</label>
                <input type="text" name="lastName" id="register-lastName-inp" placeholder="Ingresa tu Apellido" value={lastName} onChange={handleLastNameChange}/>
                <label htmlFor="register-email-inp">E-mail</label>
                <input type="email" name="email" id="register-email-inp" placeholder="Ingresa tu E-mail" value={email} onChange={handleEmailChange}/>
                <label htmlFor="register-password-inp">Contraseña</label>
                <input type="password" name='password' id='register-password-inp' placeholder='Ingresa tu contraseña' value={password} onChange={handlePasswordChange} />
                <label htmlFor="register-password2-inp">Repite la contraseña</label>
                <input type="password" name='password2' id='register-password2-inp' placeholder='Repite tu contraseña' value={password2} onChange={handlePassword2Change} />


                <button id='register-btn' onClick={handleRegisterBtnClick}>
                    Registrarse
                </button>
            </form>
            <p>Already have an account? <span><Link to='/login' >Login</Link></span> </p>
        </section>
    )
}