import './CarCard.css'

export function CarCard({car, containerClass, infoClass, includeManuf}){
    return(
        <div className={containerClass}>
            <img src={car.imgUrl}/>
            <div className={infoClass}>
                <p>{car.carMake} {car.carModel}</p>
                <p>{car.carColor}</p>
                {includeManuf ? <p>{car.manuf}</p> : null}
            </div>
        </div>
    )
}