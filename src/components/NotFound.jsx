import styles from './NotFound.module.css'

export default function NotFound(){
    return(
        <div className={styles.container}>
            <img src="/edited.svg" alt="The DieCaster logo" />
            <h1>404</h1>
            <p>Oops! The page you are looking for does not exist.</p>
        </div>
    )
}