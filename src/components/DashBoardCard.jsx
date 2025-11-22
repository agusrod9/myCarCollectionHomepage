export function DashBoardCard({car, containerClass, infoClass, includeManuf, onClick}){
    const placeholder = "https://user-collected-cars-images-bucket.s3.us-east-2.amazonaws.com/public/placeholder.webp"
    return(
        <div className={containerClass} onClick={onClick}>
            {car.img_urls.length<1 ? <img src={placeholder} /> : <img src={car.img_urls[0] || ""}/>}
            <div className={infoClass}>
                <p className="row">{car.carMake} {car.carModel}</p>
                {includeManuf ? <p className="row">{car.manufacturer}</p> : <p className="row"></p>}
                <p className="row">{car.scale}</p>
            </div>
        </div>
    )
}