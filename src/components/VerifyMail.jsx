import { useState } from 'react'
import styles from './VerifyMail.module.css'
import toast from 'react-hot-toast';
import { Link } from 'react-router';

const API_BASEURL = import.meta.env.VITE_API_BASEURL;

export function VerifyMail ({onSuccess}){
    const [email, setEmail] = useState("")
    const [verificationCode, setVerificationCode] = useState("")
    const [verificationError, setVerificationError] = useState("")
    const handleVerifyCodeBtnClick =async (e)=>{
        e.preventDefault()
        setVerificationError("")
        if(email=="" || verificationCode==""){
            setVerificationError("Please complete all fields.")
        }else{
            await verifyCode(email,verificationCode)
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
            if(responseData.message.includes("CODE DOES NOT VERIFY")){
                setVerificationError("Invalid verification code.")
                return
            }
            toast.error("Couldn't verify your account", {duration: 2000, id:t})
        }
        return responseData
    }

    const handleEmailChange =(e)=>{
        setEmail(e.target.value)
    }

    const handleVerificationCodeChange =(e)=>{
        setVerificationError("")
        setVerificationCode(e.target.value)
    }


    return(
        <section className={styles.verifySection}>
                <h2>Verify your E-Mail</h2>
                <p>Enter the code we sent to your email.</p>
            <form className={styles.verifyForm}>
                <label htmlFor="verify-email-inp">E-mail</label>
                <input type="email" name="email" id="verify-email-inp" placeholder="Type your E-mail" value={email} onChange={handleEmailChange}/>
                <label htmlFor="verify-code-inp">Code</label>
                <input type="string" name='code' id='verify-code-inp' placeholder='Type your code' value={verificationCode} onChange={handleVerificationCodeChange} />
                <p className={styles.verificationErrorLabel}>{verificationError}</p>
            </form>
            <button className={styles.verifyBtn} onClick={handleVerifyCodeBtnClick}>
                Verify
            </button>
            <div className={styles.loginLinksContainer}>
                <p className={styles.verifyLink}>Already verified? <span><Link to='/login'>Log in</Link></span></p>
            </div>
        </section>
    )
}