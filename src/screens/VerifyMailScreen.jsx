import styles from './VerifyMailScreen.module.css'
import { VerifyMail } from '../components/VerifyMail';
import { useNavigate } from 'react-router-dom';
import usePageTitle from '../hooks/usePageTitle';
import BackHomeNav from '../components/BackHomeNav';



export function VerifyMailScreen(){
    usePageTitle("E- Mail verification")
    const navigate = useNavigate()
    const handleVerificationSuccess = ()=>{
        navigate('/login')
    }
    
    return(
        <section className={styles.root}>
            <VerifyMail onSuccess={handleVerificationSuccess}/>
            <BackHomeNav />
        </section>
    )
}