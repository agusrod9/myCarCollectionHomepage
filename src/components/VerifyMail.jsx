import { useState } from 'react'
import './VerifyMail.css'
import { useNavigate } from 'react-router-dom'


export function VerifyMail ({onSuccess}){
    const [email, setEmail] = useState("")
    const [verificationCode, setVerificationCode] = useState("")
    const navigate = useNavigate()
    const handleVerifyCodeBtnClick =async (e)=>{
        e.preventDefault()
        if(email=="" || verificationCode==""){
            alert("Faltan datos")
        }else{
            await verifyCode(email,verificationCode, navigate)
            setEmail("")
            setVerificationCode("")
        }
        
    }

        async function verifyCode(email, verificationCode, navigate){
        const url = `https://mycarcollectionapi.onrender.com/api/sessions/verify`
        const data = {email , verificationCode}
        const opts = {
            method : 'POST',
            headers : {'Content-Type' : 'application/json'},
            credentials : 'include',
            body : JSON.stringify(data)
        }
        const response = await fetch(url,opts)
        const responseData = await response.json()
        if(response.status==200){
            if(onSuccess){
                onSuccess()
            }
        }else{
            alert("No se pudo verificar")
        }
        return responseData
        
    }

    const handleEmailChange =(e)=>{
        setEmail(e.target.value)
    }

    const handleVerificationCodeChange =(e)=>{
        setVerificationCode(e.target.value)
    }


    return(
        <section className="verify-section">
            <h2>Verify your e-Mail</h2>
            <p></p>
            <form className="verify-form">
                <label htmlFor="verify-email-inp">E-mail</label>
                <input type="email" name="email" id="verify-email-inp" placeholder="Ingresa tu E-mail" value={email} onChange={handleEmailChange}/>
                <label htmlFor="verify-password-inp">Código</label>
                <input type="string" name='code' id='verify-code-inp' placeholder='Ingresa tu código' value={verificationCode} onChange={handleVerificationCodeChange} />
                <button id='verify-btn' onClick={handleVerifyCodeBtnClick}>
                    Verificar
                </button>
            </form>
        </section>
    )
}