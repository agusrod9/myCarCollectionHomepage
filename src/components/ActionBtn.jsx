import './ActionBtn.css'

export function ActionBtn({icon, label, extraClass, onClick}){
    return(
        <div className={`btn ${extraClass || ""}`} onClick={onClick}>
            <span className='btnIcon'>{icon}</span>
            <p className='btnLabel'>{label}</p>
        </div>
    )
}