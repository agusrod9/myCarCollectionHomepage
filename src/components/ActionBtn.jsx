import './ActionBtn.css'

export function ActionBtn({id, icon, label, extraClass, onClick, disabled}){
    return(
        <div id={id} className={disabled ? `btn ${extraClass || ""} btnDisabled` :`btn ${extraClass || ""}`} onClick={disabled ? null : onClick}>
            <span className='btnIcon'>{icon}</span>
            <p className='btnLabel'>{label}</p>
        </div>
    )
}