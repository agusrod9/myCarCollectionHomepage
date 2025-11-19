export function validateNickFormat(nick){
    const regex = /^[a-z0-9._-]+$/;
    return regex.test(nick)
}