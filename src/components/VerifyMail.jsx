import { useState } from 'react'
import './VerifyMail.css'
import toast from 'react-hot-toast';

const API_BASEURL = import.meta.env.VITE_API_BASEURL;

export function VerifyMail ({onSuccess}){
    const [email, setEmail] = useState("")
    const [verificationCode, setVerificationCode] = useState("")
    const handleVerifyCodeBtnClick =async (e)=>{
        e.preventDefault()
        if(email=="" || verificationCode==""){
            toast.error("Missing mandatory fields", {duration : 2500})
        }else{
            await verifyCode(email,verificationCode)
            setEmail("")
            setVerificationCode("")
        }
        
    }

        async function verifyCode(email, verificationCode){
        const t = toast.loading("Verifying your account...", {duration : 20000})
        const url = `${API_BASEURL}sessions/verify`
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
                toast.success("Your account is now verified!", {duration: 2000, id:t})
                onSuccess()
            }
        }else{
            toast.error("Couldn't verify your account", {duration: 2000, id:t})
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
            <h2>Verifica tu e-Mail</h2>
            <p>Ingresa el código que te enviamos</p>
            <form className="verify-form">
                <label htmlFor="verify-email-inp">E-mail</label>
                <input type="email" name="email" id="verify-email-inp" placeholder="Ingresa tu E-mail" value={email} onChange={handleEmailChange}/>
                <label htmlFor="verify-code-inp">Código</label>
                <input type="string" name='code' id='verify-code-inp' placeholder='Ingresa tu código' value={verificationCode} onChange={handleVerificationCodeChange} />
                <button id='verify-btn' onClick={handleVerifyCodeBtnClick}>
                    Verificar
                </button>
            </form>
        </section>
    )
}