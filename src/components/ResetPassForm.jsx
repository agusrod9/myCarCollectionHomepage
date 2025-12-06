import styles from './ResetPassForm.module.css'
import { useState } from "react"
import { useNavigate } from 'react-router-dom'
import toast from 'react-hot-toast';
import validator from 'validator'

const API_BASEURL = import.meta.env.VITE_API_BASEURL;

export function ResetPassForm(){
    const [email, setEmail] = useState("")
    const [inputError, setInputError] = useState("")
    const navigate = useNavigate()

    const handleResetBtnClick =async (e)=>{
        e.preventDefault()
        if(email==""){
            setInputError("Please enter E-mail.")
            return 
        }
        if(!validator.isEmail(email)){
            setInputError("E-Mail is invalid.")
            return
        }

        const t = toast.loading("Sending reset instructions...", {duration : 20000})
        const response = await requestNewPass(email)
        if(response.status != 200){
            toast.error("Something went wrong. Try again", {duration: 2500, id:t})
            return
        }else{
            toast.success("Password reset email sent!", {duration: 2500, id:t})
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
        setInputError("")
        setEmail(e.target.value)
    }

    return(
        <section className={styles.resetPassSection}>
            <h2>Password Reset</h2>
            <p>Type your E-mail to get a new password.</p>
            <form className={styles.resetPassForm}>
                <label htmlFor="resetPass-email-inp">E-mail</label>
                <input type="email" name="email" id="resetPass-email-inp" placeholder="Ingresa tu E-mail" value={email} onChange={handleEmailChange} onKeyDown={(e)=>{
                    if(e.key=='Enter'){
                        e.preventDefault()
                        handleResetBtnClick(e)
                    }
                }}/>
                <p className={styles.errorLabel}>{inputError}</p>
            </form>
            <button className={styles.resetPassBtn} id='resetPass-btn' onClick={handleResetBtnClick} >
                Send
            </button>
        </section>
    )
}