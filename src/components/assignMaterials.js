import * as THREE from 'three'
import { attachTextures } from '../factories/textures'
import { getSimpleWobblePlane } from './env/water2'

export const materialsToSeaShack = (models, scene, gui, textures, envTextures) => {
    //materials
    let glowingRocksMat = new THREE.MeshLambertMaterial({ 
        color: "#29abe2", 
        envMap: envTextures.sceneEnv, 
        combine: THREE.MixOperation, 
        // reflectivity: 0.3
        reflectivity: 0.6

    })

    let basic = new THREE.MeshLambertMaterial({
        side: THREE.FrontSide,
        // transparent: true,
        roughness: 0.75,
        flatShading : false,
        // emissive: 0x2d2d2d,
    })

    const panOptions1 = { 
        showGui : false, 
        u : 1, 
        v : 1, 
        zoom : 3, 
        flipY : false, 
        textureRotation : 0,
        // animateV : true,
        // animateU : true
    }


    const createPointlight = (color, intensity) => {
        let light = new THREE.PointLight( color, intensity, 50 )
        return light

    }
    
    
    models["terrain"].scene.children.map(mesh => {
        const { name } = mesh

        switch (mesh.name) {
            case "blueRocks":
                mesh.material = glowingRocksMat.clone()
                // mesh.material.color.set("#30ffbd")
                // subdivide(
                //     mesh,
                //     0.2
                // )
                break
            
            case "greenRocks":
                mesh.material = glowingRocksMat.clone()
                // mesh.material.color.set("#00ffee")
                // subdivide(
                //     mesh,
                //     0.2
                // )
                break

            case "orangeRocks":
                mesh.material = glowingRocksMat.clone()
                // mesh.material.color.set("#009dff")
                // subdivide(
                //     mesh,
                //     0.2
                // )
                break
            
            case "pinkRocks":
                mesh.material = glowingRocksMat.clone()
                // mesh.material.color.set("#ea00ff")
                // subdivide(
                //     mesh,
                //     0.2
                // )
                break

            case "redRocks":
                mesh.material = glowingRocksMat.clone()
                // mesh.material.color.set("#ff00a2")
                // subdivide(
                //     mesh,
                //     0.2
                // )
                break
            
            case "yellowRocks":
                mesh.material = glowingRocksMat.clone()
                // mesh.material.color.set("#ff3700")
                // subdivide(
                //     mesh,
                //     0.2
                // )
                break

            // case "plainRocks":
            //     mesh.material = glowingRocksMat
            //     // subdivide(
            //     //     mesh,
            //     //     0.2
            //     // )
            //     break

            // case "waterFront":
            //     mesh.material = basic
            //     attachTextures(mesh, gui, textures.woodTexture, panOptions1)
            //     // subdivide(
            //     //     mesh,
            //     //     0.2
            //     // )
            //     break

            // case "verticalSupport":
            //     mesh.material = basic
            //     attachTextures(mesh, gui, textures.woodTexture, panOptions1)
            //     // subdivide(
            //     //     mesh,
            //     //     0.2
            //     // )
            //     break

            // case "supportFrame":
            //     mesh.material = basic
            //     attachTextures(mesh, gui, textures.woodTexture, panOptions1)
            //     // subdivide(
            //     //     mesh,
            //     //     0.2
            //     // )
            //     break

            case "cloth":
                mesh.material = basic
                mesh.material.side = THREE.DoubleSide
                attachTextures(mesh, gui, textures.psyCloth, panOptions1)
                break

            case "crystal":
                mesh.material = basic.clone()
                mesh.material.emissive.set("#29abe2")
                let crystalLight = createPointlight("#29abe2", 4)

                crystalLight.position.set(
                    mesh.position.x,
                    mesh.position.y,
                    mesh.position.z
                )

                scene.add(crystalLight)
                break

            case "mushroomPinkSpots":
                mesh.material = basic.clone()
                mesh.material.emissive.set("#29abe2")
                mesh.material.emissiveIntensity = (0.6)
                break

            case "mushroomRedParts":
                mesh.material = basic.clone()
                mesh.material.emissive.set("#ff0000")
                mesh.material.emissiveIntensity = (0.6)
                break

            case "mushroomYellowSpots":
                mesh.material = basic.clone()
                mesh.material.emissive.set("#ffff00")
                mesh.material.emissiveIntensity = (0.6)
                break

            case "mushroomGreenSpots":
                mesh.material = basic.clone()
                mesh.material.emissive.set("#00ff15")
                mesh.material.emissiveIntensity = (0.6)
                break
        
            default:
                break
        }
    })

    let options = {
        aspectRatio: 1,
        width : 100, 
        widthSections : 15,
        opacity : 0.3, 
        perkiness0to10 : 0.5, 
        smoothing0to10 : 10, 
        speed0to1 : 0.2
    }

    let water = getSimpleWobblePlane(
        options
    )
    scene.add(water)
    water.position.set(0, -0.3, 5)
    water.rotation.x = -Math.PI / 2

    let glowingWaterMat = new THREE.MeshLambertMaterial({ 
        color: "#3493eb", 
        envMap: envTextures.skyBoxEnv, 
        combine: THREE.MixOperation, 
        reflectivity: 0.7,
        opacity : 0.5,
        transparent : true
    })

    water.material = glowingWaterMat

    // console.log(meshes)
    
}