import './CarCard.css'

export function CarCard({car}){
    return(
        <div className='carCardContainer'>
            <p>{car.carMake} {car.carModel} {car.carColor}</p>
        </div>
    )
}