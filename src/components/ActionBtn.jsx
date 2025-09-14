import './ActionBtn.css'

export function ActionBtn({id, icon, label, extraClass, onClick}){
    return(
        <div id={id} className={`btn ${extraClass || ""}`} onClick={onClick}>
            <span className='btnIcon'>{icon}</span>
            <p className='btnLabel'>{label}</p>
        </div>
    )
}