import Swal from 'sweetalert2'

export function toDo(msg="🚧 To be implemented"){
    const MODE = import.meta.env.VITE_MODE
    if(NODE !== 'development'){
        return null
    }
    return(
        Swal.fire({
            position: 'top-end',
            toast : true,
            timerProgressBar : true,
            text : msg,
            timer : 1000,
            theme : 'dark'
        })
    )
}