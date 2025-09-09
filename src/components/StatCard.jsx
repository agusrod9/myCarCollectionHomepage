import './StatCard.css'



export function StatCard({icon, value, label, onClick}){
    return(
        <div className='statCardContent' onClick={onClick}>
            <span className='statIcon'>{icon}</span>
            <p className='statLabel'>{label}</p>
            <p className='statValue'>{value}</p>
        </div>
    )
}