import * as THREE from 'three'
import { skyboxGradients } from '../resources'

export const addSkyBoxes = (scene) => {

    const loader = new THREE.TextureLoader()
    let spaceMap, 
        gradientMaps = new Array(6), 
        c = 0,
        gradientMapUp,
        gradientMapDown,
        skyOpacity = 1,
        floorOpacity = 1

    skyboxGradients.map((item, i) => {
        loader.load(item.image, (texture) => {
            let materialOptions = {
                map: texture,
                side: THREE.BackSide,
                // alphaMap: texture,
                // alphaTest: 0.5,
                transparent : true,
                fog: false
            }

            if(item.name === "spaceBgd")
                spaceMap = new THREE.MeshBasicMaterial(materialOptions)

            else if(item.name === "gradBgd")
                gradientMaps.fill(new THREE.MeshBasicMaterial({
                    ...materialOptions,
                    transparent: true,
                    opacity: skyOpacity,
                    alphaTest: 0
                }))

            else if(item.name === "gradBgd_Up")
                gradientMapUp = new THREE.MeshBasicMaterial({
                    ...materialOptions,
                    transparent: true,
                    opacity: skyOpacity,
                    alphaTest: 0
                })

            else if(item.name === "gradBgd_Down")
                gradientMapDown = new THREE.MeshBasicMaterial({
                    ...materialOptions,
                    transparent: true,
                    opacity: floorOpacity,
                    alphaTest: 0
                })
                
            
            c++
            if(c === 4){
                gradientMaps[2] = gradientMapUp
                gradientMaps[3] = gradientMapDown

                const spaceSkyboxGeo = new THREE.BoxGeometry(1000, 1000, 1000)
                const spaceSkybox = new THREE.Mesh(spaceSkyboxGeo, spaceMap)
                scene.add(spaceSkybox)

                // const gradSkyboxGeo = new THREE.BoxGeometry(1000, 1000, 1000)
                // const gradSkybox = new THREE.Mesh(gradSkyboxGeo, gradientMaps)
                // gradSkybox.position.set(0, 420, 0)
                // scene.add(gradSkybox)
            }
        })
    })
}