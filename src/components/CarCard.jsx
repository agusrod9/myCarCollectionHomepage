import './CarCard.css'

export function CarCard({car}){
    return(
        <div className='carCardContainer'>
            <img src={car.imgUrl}/>
            <div className='cardInfo'>
                <p>{car.carMake} {car.carModel}</p>
                <p>{car.carColor}</p>
            </div>
        </div>
    )
}