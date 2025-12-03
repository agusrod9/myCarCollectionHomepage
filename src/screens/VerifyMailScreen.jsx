import './VerifyMailScreen.css'
import { VerifyMail } from '../components/VerifyMail';
import { Header } from '../components/Header';
import { useNavigate } from 'react-router-dom';
import usePageTitle from '../hooks/usePageTitle';



export function VerifyMailScreen(){
    usePageTitle("E- Mail verification")
    const navigate = useNavigate()
    const handleVerificationSuccess = ()=>{
        navigate('/login')
    }
    return(
        <section className="verifyBody">
            <div className='formContainer'>
                <VerifyMail onSuccess={handleVerificationSuccess}/>
            </div>
        </section>
    )
}