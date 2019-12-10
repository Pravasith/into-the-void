export const loadModels = (module, scene, mixer) => {

    const gltfLoader = new module.GLTFLoader()
    const s3Url = 'https://xi-upload.s3.amazonaws.com/app-pics/threejs/models/'
    const urls = [
        "terrain-x.gltf",
        "xtc-x.gltf"
    ]

    // Optional: Provide a DRACOLoader instance to decode compressed mesh data
    let dracoLoader = new module.DRACOLoader()
    dracoLoader.setDecoderPath( 'https://xi-upload.s3.amazonaws.com/app-pics/threejs/draco/' )
    gltfLoader.setDRACOLoader( dracoLoader )

    return new Promise((resolve, reject) => {
        let models = []
        urls.map((url, i) => {
            gltfLoader.load(
                s3Url + url, 
                (gltf) => {
                    models.push({
                        modelName: url,
                        modelData: gltf
                    })
                    // applyVelocity(sphere, 0.3, new THREE.Vector3(0, -1, 0), dispatch, raycaster, root)

                    if(models.length === urls.length){
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