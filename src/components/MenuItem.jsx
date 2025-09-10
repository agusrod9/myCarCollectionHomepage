import './MenuItem.css'
export function MenuItem({text, icon, onClick}){
    return(
        <div className="menuItemContainer" onClick={onClick}>
            {icon}
            <p>{text}</p>
        </div>
    )
}