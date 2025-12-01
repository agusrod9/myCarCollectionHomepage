import './ResetPassForm.css'
import { useState } from "react"
import { useNavigate } from 'react-router-dom'
import toast from 'react-hot-toast';

const API_BASEURL = import.meta.env.VITE_API_BASEURL;

export function ResetPassForm(){
    const [email, setEmail] = useState("")
    const navigate = useNavigate()
    const handleResetBtnClick =async (e)=>{
        e.preventDefault()
        if(email==""){
            toast.error("Missing mandatory fields", {duration : 2500})
            return 
        }
        const t = toast.loading("Sending reset instructions...", {duration : 20000})
        const response = await requestNewPass(email)
        const responseData = await response.json()
        if(response.status != 200){
            toast.error("Something went wrong. Try again", {duration: 2000, id:t})
        }else{
            toast.success("Password reset email sent!", {duration: 2000, id:t})
            setEmail("")
            navigate('/login')
        }
        
    }

    async function requestNewPass(mail){
        const url = `${API_BASEURL}sessions/resetPass`
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