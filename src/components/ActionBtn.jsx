import styles from './ActionBtn.module.css'

export function ActionBtn({id, icon, label, onClick, disabled, extraClass}){
    return(
        <div id={id} className={disabled ? `${styles.btn} ${styles.btnDisabled} ${extraClass}` :`${styles.btn} ${extraClass}`} onClick={disabled ? null : onClick}>
            <span className='btnIcon'>{icon}</span>
            <p className='btnLabel'>{label}</p>
        </div>
    )
}