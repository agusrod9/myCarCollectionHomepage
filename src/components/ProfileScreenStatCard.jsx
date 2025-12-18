import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import styles from './ProfileScreenStatCard.module.css'
export function ProfileScreenStatCard({icon, label, val}){
    return(
        <div className={styles.profileStatCardWrapper}>
            <div className={styles.iconWrapper}>
                <FontAwesomeIcon icon={icon} size={'xl'}/>
            </div>
            <div className={styles.valueWrapper}>
                <p>{val}</p>
            </div>
            <div className={styles.labelWrapper}>
                <p>{label}</p>
            </div>
        </div>
    )
}