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

export const getAddedDateText = (dateString)=>{
    const added = new Date(dateString);
    const now = new Date();

    //normalizo a fechas con horas 00:00:00
    const addedDay = new Date(added.getFullYear(), added.getMonth(), added.getDate());
    const nowDay = new Date(now.getFullYear(), now.getMonth(), now.getDate());

    const diffMs = nowDay - addedDay;
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
    const diffWeeks = Math.floor(diffDays / 7);
    const diffMonths = Math.floor(diffDays / 30);
    const diffYears = Math.floor(diffDays/365);

    if (diffDays <= 0) return "Added today";

    if (diffDays === 1) return "Added yesterday";

    if (diffDays <= 5) return `Added ${diffDays} days ago`;

    if (diffWeeks === 1) return "Added last week";

    if (diffWeeks <= 3) return "Added few weeks ago";

    if (diffMonths === 1) return "Added last month";

    if (diffMonths > 1 && diffMonths <12) return `Added ${diffMonths} months ago`;

    if (diffYears === 1) return `Added last year`;

    if (diffYears > 1) return `Added ${diffYears} years ago`;

    return "Added some time ago";
}