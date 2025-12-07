import BackHomeNav from '../components/BackHomeNav';
import NotFound from '../components/NotFound';
import usePageTitle from '../hooks/usePageTitle';
import styles from './NotFoundScreen.module.css';

export function NotFoundScreen(){
    usePageTitle('Oops!')
    return(
        <section className={styles.root}>
            <BackHomeNav />
            <NotFound />
        </section>
    )
}