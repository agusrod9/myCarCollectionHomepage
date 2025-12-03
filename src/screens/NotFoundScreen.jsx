import usePageTitle from '../hooks/usePageTitle';
import './NotFoundScreen.css';

export function NotFoundScreen(){
    const FRONT_URL = import.meta.env.VITE_FRONT_URL
    usePageTitle('Oops!')
    return(
        <div className="NotFoundScreenBody">
            <img src="/edited.svg" alt="We collect Logo." />
            <h1>404</h1>
            <p>Oops! The page you are looking for does not exist.</p>
            <a href={FRONT_URL}>Go Home</a>
        </div>
    )
}