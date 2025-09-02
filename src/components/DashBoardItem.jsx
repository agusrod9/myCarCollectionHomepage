import './DashBoardItem.css'

export function DashBoardItem({text, className, imgUrl}){
    return(
        <div className={className} onClick={()=>{console.log( "Click en " +className)}} onMouseEnter={()=>{console.log("hover")}} onMouseLeave= {()=>{console.log("chau hover")}}>
            <p>{text}</p>
            <img src={imgUrl}></img>
        </div>
    )
}