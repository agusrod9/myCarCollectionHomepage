import './ResetPassForm.css'
import { useState } from "react"
import { useNavigate } from 'react-router-dom'

export function ResetPassForm(){
    const [email, setEmail] = useState("")
    const navigate = useNavigate()
    const handleResetBtnClick =async (e)=>{
        e.preventDefault()
        if(email==""){
            return alert("Faltan datos")
        }
        
        let response = await requestNewPass(email)
        if(response.status != 200){
            alert(response.message)
        }else{
            alert("Nueva contraseña enviada al correo electrónico.")
            setEmail("")
            navigate('/login')
        }
        
    }

    async function requestNewPass(mail){
        const url = `https://mycarcollectionapi.onrender.com/api/sessions/resetPass`
        const fetchData = {
            "email" : mail 
        }
        const opts = {
            method : "POST",
            headers : {'Content-Type' : 'application/json'},
            body : JSON.stringify(fetchData)
        }
        const response = await fetch(url,opts)
        return response
        
    }

    const handleEmailChange =(e)=>{
        setEmail(e.target.value)
    }

    return(
        <section className="resetPass-section">
            <h2>Password Reset</h2>
            <p>Type your E-mail to get a new password.</p>
            <form className="resetPass-form">
                <label htmlFor="resetPass-email-inp">E-mail</label>
                <input type="email" name="email" id="resetPass-email-inp" placeholder="Ingresa tu E-mail" value={email} onChange={handleEmailChange}/>
                <button id='resetPass-btn' onClick={handleResetBtnClick}>
                    Enviar
                </button>
            </form>
        </section>
    )
}