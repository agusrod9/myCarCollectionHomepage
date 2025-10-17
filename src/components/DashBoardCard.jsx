import './DashBoardCard.css'

export function DashBoardCard({car, containerClass, infoClass, includeManuf, onClick}){
    
    return(
        <div className={containerClass} onClick={onClick}>
            {car.img_urls.length<1 ? <img src='/v2.png' /> : <img src={car.img_urls[0] || ""}/>}
            <div className={infoClass}>
                <p>{car.carMake} {car.carModel}</p>
                <p>{car.carColor}</p>
                {includeManuf ? <p>{car.manuf}</p> : null}
            </div>
        </div>
    )
}