import './NotFoundScreen.css';
import { Link } from 'react-router';

export function NotFoundScreen(){
    return(
        <div className="NotFoundScreenBody">
            <img src="/public/wc.png" alt="We collect Logo." />
            <h1>404</h1>
            <p>Oops! The page you are looking for does not exist.</p>
            <Link to="/">Go Home</Link>
        </div>
    )
}