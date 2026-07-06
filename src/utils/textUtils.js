export async function copyToClipboard(text) {
    if (navigator.clipboard?.writeText) {
        await navigator.clipboard.writeText(text);
        return;
    }
}

export const capitalize = (str, nameOrBrand) => {
    if(!str){
        return ""
    }
    if(nameOrBrand){
        return str.split(" ").map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()).join(" ")
    }
    return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
}