import './DashBoardItem.css'
import { useNavigate } from 'react-router'

export function DashBoardItem({text, className, imgUrl, nav}){
    const navigate = useNavigate();
    return(
        <div className={className} onClick={()=>{navigate(nav)}}>
            <p>{text}</p>
            <img src={imgUrl}></img>
        </div>
    )
}