import styles from './StatCard.module.css'



export function StatCard({icon, value, label, onClick, pointerCursor}){
    return(
        <div className={pointerCursor ? `${styles.statCardContent} ${styles.pointerCursor}` : styles.statCardContent} onClick={onClick}>
            <span className={styles.statIcon}>{icon}</span>
            <p className={styles.statLabel}>{label}</p>
            <p className={styles.statValue}>{value}</p>
        </div>
    )
}