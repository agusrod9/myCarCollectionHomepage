import './DashBoard.css'
import { DashBoardItem } from './DashBoardItem'
export function DashBoard(){
    return(
        <section>
            <div className='dashBoard'>
                <DashBoardItem text="Notificaciones" className = "dbItem notif" imgUrl= "src/assets/react.svg" />
                <DashBoardItem text="Métricas" className = "dbItem metrics" imgUrl= "src/assets/react.svg"/>
                <DashBoardItem text="WishList" className = "dbItem wishlist"imgUrl= "src/assets/react.svg"/>
                <DashBoardItem text="perfil" className = "dbItem perfil" imgUrl= "src/assets/react.svg" nav="/profile"/>
                <DashBoardItem text="agregar auto" className = "dbItem newcar"imgUrl= "src/assets/react.svg" nav="/newCar"/>
            </div>

        </section>
    )
}