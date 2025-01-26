import { fileTypeFromBuffer } from "file-type";

export async function verifyFormat(file){
    const arrayBuffer = await file.arrayBuffer()
    const buffer = new Uint8Array(arrayBuffer)
    const fileType = await fileTypeFromBuffer(buffer);
    
    
    if (fileType) {
        console.log(fileType.ext)
        return fileType.ext;
    } else {
        return null;
    }
    

}