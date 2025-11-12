export async function uploadManyImages(userId, folder, imageFilesArray){
    const url = `https://mycarcollectionapi.onrender.com/api/aws/?userId=${userId}&folder=${folder}`
    const opts = {
        method : 'POST'
    }
    const imagesUrls = await Promise.all( //waits for al the fetches
        Array.from(imageFilesArray).map(async(img)=>{
            const formData = new FormData()
            formData.append('image', img)
            opts.body = formData
            const response = await fetch(url,opts)
            const data = await response.json()
            const imageUrl = data.url
            return imageUrl // Pushes the result to imagesUrls directly
        })
    )
    return imagesUrls;
}

export async function uploadSingleImage(userId, folder, imageFile){
    const url = `https://mycarcollectionapi.onrender.com/api/aws/?userId=${userId}&folder=${folder}`
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