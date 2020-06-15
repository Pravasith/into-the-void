import * as THREE from 'three'
import { s3URLs, modelLinkURLs, envMapURLs, imageLinkURLs } from "../components/resources"





export const loadModelsTexturesAndEnvMaps = (module, dispatch) => {


    dispatch(
        {
            type : "ON_PROGRESS", 
            percentLoaded : 0
        }
    )

    // MODEL LOADER
    const gltfLoader = new module.GLTFLoader()
    // Optional: Provide a DRACOLoader instance to decode compressed mesh data
    let dracoLoader = new module.DRACOLoader()
    dracoLoader.setDecoderPath('https://xi-upload.s3.amazonaws.com/app-pics/threejs/draco/')
    gltfLoader.setDRACOLoader(dracoLoader)

    // TEXTURE LOADER
    let textureLoader = new THREE.TextureLoader()

    // ENV TEXTURE LOADER
    let envTextureLoader = new THREE.CubeTextureLoader()


    const modelURLs = { ...modelLinkURLs },
        textureURLs = { ...imageLinkURLs },
        envURLs = { ...envMapURLs }

    // Compute total loading items
    const totalItemsToLoad = Object.keys(modelURLs).length +
        Object.keys(textureURLs).length +
        Object.keys(envURLs).length

    let loadItemCount = 0,
        allLoadedItemsData = {
            models : {},
            textures : {},
            envTextures : {}
        }

    const dispatchLoadingData = () => {

        dispatch(
            {
                type : "ON_PROGRESS",
                percentLoaded : loadItemCount / totalItemsToLoad * 100
            }
        )
    }


    return new Promise((resolve, reject) => {


        // Loading models
        let models = {}

        Object.keys(modelURLs).map(key => {
            gltfLoader.load(
                s3URLs.models + modelURLs[key], 
                (gltf) => {
                    models[key.split(".")[0]] = gltf
                    loadItemCount++
                    dispatchLoadingData()

                    allLoadedItemsData = {
                        ...allLoadedItemsData,
                        models : {
                            ...allLoadedItemsData.models,
                            ...models
                        }
                    }

                    if(loadItemCount === totalItemsToLoad){
                        resolve(allLoadedItemsData)
                    }

                    // if(Object.keys(models).length === Object.keys(modelURLs).length){
                    //     resolve(models)
                    // }
                },
                // called while loading is progressing
                (xhr) => {
                    // console.log( 'Models ' + ( xhr.loaded / xhr.total * 100 ) + '% loaded' )
                },
                // called when loading has errors
                (error) => {
                    reject({
                        jist : 'An error occured while loading ' + key,
                        error
                    })
                    console.error( 'An error happened' )
                }
            )
        })


        // Loading textures
        let textures = {}

        Object.keys(textureURLs).map(key => {
            textureLoader.load(
                s3URLs.mapsAndImages + textureURLs[key],
                (texture) => {
                    textures[key.split(".")[0]] = texture

                    loadItemCount++
                    dispatchLoadingData()

                    allLoadedItemsData = {
                        ...allLoadedItemsData,
                        textures : {
                            ...allLoadedItemsData.textures,
                            ...textures
                        }
                    }

                    if(loadItemCount === totalItemsToLoad){
                        resolve(allLoadedItemsData)
                    }
                },
                // called while loading is progressing
                (xhr) => {
                    // console.log( 'Textures ' +  ( xhr.loaded / xhr.total * 100 ) + '% loaded' )
                },
                // called when loading has errors
                (error) => {
                    reject({
                        jist : 'An error occured while loading ' + key,
                        error
                    })
                    console.error( 'An error happened' )
                }
            )
        })


        // Loading env maps
        let envTextures = {}

        Object.keys(envURLs).map(key => {
            envTextureLoader.load(
                envURLs[key],
                (envTexture) => {
                    envTexture.mapping = THREE.CubeRefractionMapping
                    envTextures[key] = envTexture

                    loadItemCount++
                    dispatchLoadingData()

                    allLoadedItemsData = {
                        ...allLoadedItemsData,
                        envTextures : {
                            ...allLoadedItemsData.envTextures,
                            ...envTextures
                        }
                    }

                    if(loadItemCount === totalItemsToLoad){
                        resolve(allLoadedItemsData)
                    }
                },
                // called while loading is progressing
                (xhr) => {
                    // console.log( 'Envs ' +  ( xhr.loaded / xhr.total * 100 ) + '% loaded' )
                },
                // called when loading has errors
                (error) => {
                    reject({
                        jist : 'An error occured while loading ' + key,
                        error
                    })
                    console.error( 'An error happened' )
                }
            )
        })

        
    })
 
}