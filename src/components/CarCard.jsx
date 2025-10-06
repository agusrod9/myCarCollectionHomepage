import './CarCard.css'

export function CarCard({car, containerClass, infoClass, includeManuf}){
    
    return(
        <div className={containerClass}>
            {car.img_urls.length<1 ? <img src='/public/v2.png' /> : <img src={car.img_urls[0] || ""}/>}
            <div className={infoClass}>
                <p>{car.carMake} {car.carModel}</p>
                <p>{car.carColor}</p>
                {includeManuf ? <p>{car.manuf}</p> : null}
            </div>
        </div>
    )
}