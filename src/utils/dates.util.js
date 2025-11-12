import { format, parseISO } from "date-fns"
import { es, enUS } from "date-fns/locale"

export const formatDate = (dateSTR, locale= es)=>{
    try {
        const date = parseISO(dateSTR)
        return format(date, "MM/dd/yyyy", {locale})
    } catch (error) {
        return dateSTR
    }
    
}