const API_BASEURL = import.meta.env.VITE_API_BASEURL;
import heic2any from 'heic2any';

export async function uploadManyImages(userId, folder, imageFilesArray){
    const url = `${API_BASEURL}aws/?userId=${userId}&folder=${folder}`
    const imagesUrls = await Promise.all( //waits for al the fetches
        Array.from(imageFilesArray).map(async(img)=>{
            const formData = new FormData()
            formData.append('image', img)
            const opts = {
                method : 'POST',
                body: formData
            }
            const response = await fetch(url,opts)
            const data = await response.json()
            const imageUrl = data.url
            return imageUrl // Pushes the result to imagesUrls directly
        })
    )
    return imagesUrls;
}

export async function uploadSingleImage(userId, folder, imageFile){
    const url = `${API_BASEURL}aws/?userId=${userId}&folder=${folder}`
    const opts = {
        method : 'POST'
    }
    const formData = new FormData()
    formData.append('image', imageFile)
    opts.body = formData
    const response = await fetch(url,opts)
    const data = await response.json()
    const imageUrl = data.url
    return imageUrl 
}

export async function convertToWebp(file){
    let blob = file;

    //primero paso a PNG
    const isHeic = file.type === "image/heic" 
        || file.type === "image/heif"
        || file.name.toLowerCase().endsWith(".heic")
        || file.name.toLowerCase().endsWith(".heif");

    if (isHeic) {
        try {
            blob = await heic2any({
                blob: file,
                toType: "image/png",
                quality: 1
            });
        } catch (e) {
            console.error("Error converting HEIC/HEIF:", e);
            throw new Error("Could not convert HEIC/HEIF");
        }
    }

    //luego paso file a webp
    const img = await new Promise((resolve) => {
        const image = new Image();
        image.onload = () => resolve(image);
        image.src = URL.createObjectURL(blob);
    });

    const canvas = document.createElement("canvas");
    canvas.width = img.width;
    canvas.height = img.height;

    const ctx = canvas.getContext("2d");
    ctx.drawImage(img, 0, 0);

    const webpBlob = await new Promise((resolve) =>
        canvas.toBlob(
            resolve,
            "image/webp",
            0.8
        )
    );

    return new File([webpBlob], file.name.replace(/\.[^/.]+$/, "") + ".webp", {
        type: "image/webp"
    });
};