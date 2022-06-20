import * as THREE from "three"
import { attachTextures } from "../factories/textures"
import { getSimpleWobblePlane } from "./env/water2"

export const materialsToSeaShack = (
    models,
    scene,
    gui,
    textures,
    envTextures
) => {
    //materials
    let starsReflection = new THREE.MeshLambertMaterial({
        color: "#fff",
        envMap: envTextures.skyBoxEnv,
        combine: THREE.MixOperation,
        // reflectivity: 0.3
        // metalness : 0.8,
        // shininess : 0.5,
        reflectivity: 0.75,
    })

    let blackMetal = new THREE.MeshStandardMaterial({
        color: "#29abe2",
        // emissive
        // reflectivity: 0.3
        // metalness : 0.8,
        // shininess : 0.5,
        roughness: 0.2,
        metalness: 0.8,
    })

    // let glowingRocksMat = new THREE.MeshStandardMaterial({
    //     color: "#fff",
    //     envMap: envTextures.sceneEnv,
    //     // combine: THREE.MixOperation,
    //     // reflectivity: 0.3
    //     metalness : 0.8,
    //     shininess : 0.5,
    //     roughness : 0.2,
    //     // reflectivity: 0.8

    // })

    let glowingRocksMat = new THREE.MeshStandardMaterial({
        color: "#000000",
        envMap: envTextures.sceneEnv,
        combine: THREE.MixOperation,
        // reflectivity: 0.3
        metalness: 0.8,
        roughness: 0.2,
        // shininess : 0.5,
        reflectivity: 0.5,
    })

    let basic = new THREE.MeshLambertMaterial({
        side: THREE.FrontSide,
        // transparent: true,
        roughness: 0.75,
        flatShading: false,
        // emissive: 0x2d2d2d,
    })

    const panOptions1 = {
        showGui: false,
        u: 1,
        v: 1,
        zoomX: 3,
        zoomY: 3,
        flipY: false,
        textureRotation: 0,
        // animateV : true,
        // animateU : true
    }

    const attachTVmats = (mesh, mat) => {
        mesh.material = basic.clone()

        const panOptions4 = {
            showGui: false,
            u: 0.1,
            v: 1,
            zoomX: 1.1,
            zoomY: 0.3,
            flipY: false,
            textureRotation: -Math.PI / 2,
            animateV: true,
            animateU: false,
        }

        attachTextures(mesh, gui, mat, panOptions4)
    }

    models["terrain"].scene.children.map(mesh => {
        const { name } = mesh

        switch (mesh.name) {
            case "cloth":
                mesh.material = basic
                mesh.material.side = THREE.DoubleSide
                attachTextures(mesh, gui, textures.psyCloth, panOptions1)
                break

            case "mushroomPinkSpots":
                mesh.material = basic.clone()
                mesh.material.emissive.set("#29abe2")
                mesh.material.emissiveIntensity = 0.6
                break

            case "mushroomRedParts":
                mesh.material = basic.clone()
                mesh.material.emissive.set("#ff0000")
                mesh.material.emissiveIntensity = 0.6
                break

            case "mushroomYellowSpots":
                mesh.material = basic.clone()
                mesh.material.emissive.set("#ffff00")
                mesh.material.emissiveIntensity = 0.6
                break

            case "mushroomGreenSpots":
                mesh.material = basic.clone()
                mesh.material.emissive.set("#00ff15")
                mesh.material.emissiveIntensity = 0.6
                break

            case "terrain2":
                mesh.material = basic.clone()
                mesh.material.visible = false
                break

            case "boundary":
                mesh.material = basic.clone()
                mesh.material.visible = false
                break

            case "supportFrameLH":
                mesh.material = glowingRocksMat.clone()
                break

            case "glowLH":
                mesh.material = basic.clone()
                mesh.material.emissive.set("#29abe2")
                mesh.material.emissiveIntensity = 0.5
                break

            case "railingLH":
                mesh.material = basic.clone()
                break

            case "glowSpaceShip":
                mesh.material = basic.clone()
                mesh.material.emissive.set("#29abe2")
                mesh.material.emissiveIntensity = 0.5
                break

            case "spaceship":
                mesh.material = glowingRocksMat.clone()
                break

            case "elevator":
                mesh.material = glowingRocksMat.clone()
                break

            case "elevatorShaft":
                mesh.material = glowingRocksMat.clone()
                break

            case "pinkGlow1":
                mesh.material = basic.clone()
                mesh.material.emissive.set("#29abe2")
                mesh.material.emissiveIntensity = 0.8
                break

            case "pinkGlow2":
                mesh.material = basic.clone()
                mesh.material.emissive.set("#29abe2")
                mesh.material.emissiveIntensity = 0.8
                break

            case "Sphere":
                mesh.material = starsReflection.clone()
                break

            case "hoardingPicture":
                mesh.material = basic.clone()

                const panOptions3 = {
                    showGui: false,
                    u: 0.9,
                    v: 0.9,
                    zoomX: 0.8,
                    zoomY: 0.8,
                    flipY: true,
                    textureRotation: Math.PI,
                    animateV: false,
                    animateU: false,
                }

                attachTextures(mesh, gui, textures.mainHoarding, panOptions3)
                break

            case "tv1":
                attachTVmats(mesh, textures.tv1)
                break

            case "tv3":
                attachTVmats(mesh, textures.tv3)
                break

            case "tv4":
                attachTVmats(mesh, textures.tv4)
                break

            case "gravityHarnessTV":
                attachTVmats(mesh, textures.gravityHarnessTV)
                break

            case "tv2":
                mesh.material = basic.clone()

                const panOptions5 = {
                    showGui: false,
                    u: 0.04,
                    v: 1,
                    zoomX: 1.1,
                    zoomY: 0.2,
                    flipY: false,
                    textureRotation: -Math.PI / 2,
                    animateV: true,
                    animateU: false,
                }

                attachTextures(mesh, gui, textures.tv2, panOptions5)
                break

            default:
                break
        }
    })

    let options = {
        aspectRatio: 1,
        width: 100,
        widthSections: 15,
        opacity: 0.3,
        perkiness0to10: 0.5,
        smoothing0to10: 10,
        speed0to1: 0.2,
    }

    let water = getSimpleWobblePlane(options)
    scene.add(water)
    water.position.set(0, -0.3, 5)
    water.rotation.x = -Math.PI / 2

    let glowingWaterMat = new THREE.MeshLambertMaterial({
        color: "#3493eb",
        envMap: envTextures.skyBoxEnv,
        combine: THREE.MixOperation,
        reflectivity: 0.7,
        opacity: 0.5,
        transparent: true,
    })

    water.material = glowingWaterMat

    // console.log(meshes)
}
