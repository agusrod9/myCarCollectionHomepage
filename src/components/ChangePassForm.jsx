import './ChangePassForm.css';
import { useState } from "react"
import { useNavigate } from 'react-router-dom'

const API_BASEURL = import.meta.env.VITE_API_BASEURL;

export function ChangePassForm(){
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [password2, setPassword2] = useState("")
    const navigate = useNavigate()
    const handleChangePassBtnClick =async (e)=>{
    
        e.preventDefault()
        if(email=="" || password=="" || password2==""){
            return alert("Faltan datos")
        }

        if(password!=password2){
            return alert("Contraseñas no coinciden")
        }
        
        let response = await requestChangePass(email, password)
        let responseData = await response.json()
        if(response.status != 200){
            alert(responseData.message)
        }else{
            alert(responseData.message)
            navigate('/',{replace:true})
            setEmail("")
            setPassword("")
            setPassword2("")
        }
        
    }

    async function requestChangePass(mail, pass){
        const url = `${API_BASEURL}/api/sessions/changePass`
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
    }

    const handlePasswordChange =(e)=>{
        setPassword(e.target.value)
    }

    const handlePassword2Change =(e)=>{
        setPassword2(e.target.value)
    }

    return(
        <section className="changePass-section">
            <h2>Nueva contraseña</h2>
            <form className="changePass-form">
                
                <label htmlFor="register-email-inp">E-mail</label>
                <input type="email" name="email" id="register-email-inp" placeholder="Ingresa tu E-mail" value={email} onChange={handleEmailChange}/>
                <label htmlFor="register-password-inp">Contraseña</label>
                <input type="password" name='password' id='register-password-inp' placeholder='Ingresa tu contraseña' value={password} onChange={handlePasswordChange} />
                <label htmlFor="register-password2-inp">Repite la contraseña</label>
                <input type="password" name='password2' id='register-password2-inp' placeholder='Repite tu contraseña' value={password2} onChange={handlePassword2Change} />


                <button id='register-btn' onClick={handleChangePassBtnClick}>
                    Enviar
                </button>
            </form>
            
        </section>
    )
}