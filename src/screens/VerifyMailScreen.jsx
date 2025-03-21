import './VerifyMailScreen.css'
import { VerifyMail } from '../components/VerifyMail';
import { Header } from '../components/Header';
import { useNavigate } from 'react-router-dom';



export function VerifyMailScreen(){
    const navigate = useNavigate()
    const handleVerificationSuccess = ()=>{
        navigate('/login')
    }
    return(
        <section className="verifyBody">
            <Header />
            <div className='formContainer'>
                <VerifyMail onSuccess={handleVerificationSuccess}/>
            </div>
        </section>
    )
}