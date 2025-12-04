import { useState, useEffect } from 'react'
import styles from './VerifyMail.module.css'
import toast from 'react-hot-toast';
import { Link } from 'react-router';
import validator from 'validator'

const API_BASEURL = import.meta.env.VITE_API_BASEURL;

export function VerifyMail ({onSuccess}){
    const [email, setEmail] = useState("")
    const [verificationCode, setVerificationCode] = useState("")
    const [verificationError, setVerificationError] = useState("")
    const [displayResendCodeLabel, setDisplayResendCodeLabel] = useState(false)
    const [timer, setTimer] = useState(0);
    const [canResend, setCanResend] = useState(true);
    const [tryCounter, setTryCounter] = useState(0)

    const handleVerifyCodeBtnClick =async (e)=>{
        e.preventDefault()
        setVerificationError("")
        if(email=="" || verificationCode==""){
            setVerificationError("Please complete all fields.")
            return
        }
        if(!validator.isEmail(email)){
            setVerificationError("E-Mail is invalid.")
            return
        }
        await verifyCode(email,verificationCode)
        setVerificationCode("")
        
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
            }
            setTryCounter(prev => {
                const next = prev + 1
                if (next > 1) setDisplayResendCodeLabel(true)
                return next
            })
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

    const handleResendClick=async()=>{
        if(!canResend){
            return
        }
        setVerificationError("")
        setTimer(60)
        setCanResend(false);
        if(!validator.isEmail(email)){
            setVerificationError("Please type a valid E-Mail to get a new code.")
            return
        }
        const t = toast.loading(`Sending new code...`)
        const url = `${API_BASEURL}sessions/getVerificationCode?email=${email}`
        const opts = {
            method : "POST"
        }
        const response = await fetch(url,opts)
        const responseData = await response.json()
        if(response.status!=200){
            if(responseData.message?.includes("VERIFICATION CODE NOT SET. TRY AGAIN.")){
                toast.error("Something went wrong. Please try again.", {duration : 4500, id:t})
                return
            }
            if(responseData.message?.includes("USER NOT FOUND")){
                toast.error("We couldn't find an account with that email.", {duration : 4500, id:t})
                return
            }
        }
        toast.success(`Sent! Check ${email}`,{duration : 6000, id:t})
    }

    useEffect(() => {
        if (timer <= 0) {
        setCanResend(true);
        return;
        }

        const interval = setInterval(() => {
        setTimer(prev => prev - 1);
        }, 1000);

        return () => clearInterval(interval);
    }, [timer]);


    return(
        <section className={styles.verifySection}>
                <h2>Verify your E-Mail</h2>
                <p>Enter the code we sent to your E-mail.</p>
            <form className={styles.verifyForm}>
                <label htmlFor="verify-email-inp">E-mail</label>
                <input type="email" name="email" id="verify-email-inp" placeholder="Type your E-mail" value={email} onChange={handleEmailChange}/>
                <label htmlFor="verify-code-inp">Code</label>
                <input type="string" name='code' id='verify-code-inp' placeholder='Type your code' value={verificationCode} onChange={handleVerificationCodeChange} />
                <p className={styles.verificationErrorLabel}>{verificationError}</p>
                <p className={styles.getNewCodeLabel}>
                    {
                    displayResendCodeLabel?
                    timer > 0?
                    (
                        <>You can request a new code in {timer}s</>
                    ):
                    (
                        <>Having trouble? <span onClick={handleResendClick} className={styles.resendLink}> Request a new code</span></>
                    )
                    :
                    null
                    }
                </p>
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