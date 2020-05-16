export const loadModels = (module) => {

    const gltfLoader = new module.GLTFLoader()
    const s3Url = 'https://xi-upload.s3.amazonaws.com/app-pics/threejs/models/'
    const urls = [
        "coronaDraco",
        "animations-clean-x",
        "darkSideAlbumModel"
    ]

    // Optional: Provide a DRACOLoader instance to decode compressed mesh data
    let dracoLoader = new module.DRACOLoader()
    dracoLoader.setDecoderPath( 'https://xi-upload.s3.amazonaws.com/app-pics/threejs/draco/' )
    gltfLoader.setDRACOLoader( dracoLoader )

    return new Promise((resolve, reject) => {
        let models = {}
        urls.map((url, i) => {
            gltfLoader.load(
                s3Url + url + '.gltf', 
                (gltf) => {
                    models[url] = gltf
                    // models.push({
                    //     modelName: url,
                    //     modelData: gltf
                    // })

                    // console.log(url)

                    

                    if(Object.keys(models).length === urls.length){
                        resolve(models)
                    }
                },
                // called while loading is progressing
                (xhr) => {
                    console.log( ( xhr.loaded / xhr.total * 100 ) + '% loaded' )
                },
                // called when loading has errors
                (error) => {
                    reject({
                        jist : 'An error happened while loading ' + url,
                        error
                    })
                    console.error( 'An error happened' )
                }
            )
        })
    })
 
}