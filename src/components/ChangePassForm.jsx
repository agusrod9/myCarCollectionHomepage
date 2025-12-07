import styles from './ChangePassForm.module.css';
import { useState } from "react"
import { useNavigate } from 'react-router-dom'
import PasswordInput from './PasswordInput';
import validator from 'validator';
import toast from 'react-hot-toast';

const API_BASEURL = import.meta.env.VITE_API_BASEURL;

export function ChangePassForm(){
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [password2, setPassword2] = useState("")
    const [formError, setFormError] = useState("")
    const navigate = useNavigate()

    const handleChangePassBtnClick =async(e)=>{
        e.preventDefault()
        setFormError("")
        if(email=="" || password=="" || password2==""){
            setFormError("Please enter E-mail and Passsword.")
            return
        }

        if(!validator.isEmail(email)){
            setFormError("E-Mail is invalid.")
            return
        }

        if(password!=password2){
            setFormError("Passwords don´t match.")
            return
        }
        const t = toast.loading("Updating your password...", {duration : 20000})
        let response = await requestChangePass(email, password)
        const responseData = await response.json()
        if(response.status != 200){
            if(responseData?.message.includes("CANNOT SET PASSWORD - GOOGLE USER")){
                toast.error("This account uses Google Sign-In. You can’t set a password for it.", {duration : 5000, id:t})
                setEmail("")
                setPassword("")
                setPassword2("")
                return
            }
            toast.error(`We couldn't create your account, please try again.`, {duration : 3000, id:t})
        }else{
            toast.success(`Password updated!`, {duration : 3000, id:t})
            setEmail("")
            setPassword("")
            setPassword2("")
            navigate('/',{replace:true})
        }
        
    }

    async function requestChangePass(mail, pass){
        const url = `${API_BASEURL}sessions/changePass`
        const fetchData = {
            "email" : mail ,
            "password" : pass
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
        setFormError("")
    }

    const handlePasswordChange =(e)=>{
        setPassword(e.target.value)
        setFormError("")
    }

    const handlePassword2Change =(e)=>{
        setPassword2(e.target.value)
        setFormError("")
    }

    return(
        <section className={styles.changePassSection}>
            <h2>New password</h2>
            <form className={styles.changePassForm}>
                <label htmlFor="register-email-inp">E-mail</label>
                <input type="email" name="email" id="register-email-inp" placeholder="Type your E-mail" value={email} onChange={handleEmailChange}/>
                <label htmlFor="register-password-inp">Password</label>
                <PasswordInput className={styles.passwordInput} placeholder='Choose your password' value={password} onChange={handlePasswordChange} />
                <label htmlFor="register-password2-inp">Confirm Password</label>
                <PasswordInput className={styles.passwordInput} placeholder='Repeat your password' value={password2} onChange={handlePassword2Change} onKeyDown={(e)=>{
                    if(e.key=='Enter'){
                        e.preventDefault()
                        handleChangePassBtnClick(e)
                    }
                }}/>
                <p className={styles.formErrorLabel}>{formError}</p>
            </form>
            <button type='submit' className={styles.formBtn} onClick={handleChangePassBtnClick}>
                Send
            </button>
            
        </section>
    )
}