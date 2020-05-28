
import * as THREE from 'three'
import { getSimpleWobblePlane } from "../components/env/water2"
import { attachTextures } from "./textures"


export const addFloydElements = (models, scene, gui, textures, envTextures) => {
    Object.keys(models).forEach(model => {
        const modelData = models[model].scene



        // Refraction for prism
        // const urls = skyboxGradients.reduce((all, item, i) => {
        //     // Reordering images for refraction maps
        //     // Required Order - posX, negX, posY, negY, posZ, negZ
        //     // Current order - refer sky.js in env and see how skyboxGradients are used from UIComponents folder
        //     if(item.name === "spaceBgd"){
        //         for(let j = 0; j < 6; j++){
        //             all[j] = item.image
        //         }
        //     }
        //     return all
        // }, [])



        let cubeMaterial1 = new THREE.MeshStandardMaterial( {
            color: "#8f8f8f", 
            metalness: 0.85, 
            roughness: 0.2, 
            name: 'metallic',
            transparent: true,
            opacity: 0.8
        })

        let cubeMaterial2 = new THREE.MeshStandardMaterial( {
            color: "#FFF", metalness: 0.1, roughness: 0.2, name: 'metallic'
        })

        let cubeMaterial3 = new THREE.MeshStandardMaterial( {
            color: "#ff4ac9", emissive: "#ff4ac9", roughness: 0.2, name: 'metallic'
        })

        let basic = new THREE.MeshBasicMaterial({
            side: THREE.DoubleSide,
            transparent: true
        })



        if(model === "darkSidePrism"){
            modelData.position.set(15.4, 1, 49)
            modelData.scale.set(10, 10, 10)
            modelData.rotation.y = 0.4

            let cPos = 0
            function animate(time) {
                modelData.rotation.y += 0.005
                cPos += 0.015

                let s = 4 * Math.abs(Math.sin(cPos) + 2.1)
                modelData.position.y = Math.sin(cPos) + 1
                // modelData.scale.set(s, s, s)
    
                requestAnimationFrame(animate)
            }
    
            animate()


            modelData.children.map((item, i) => {
                if(item.name === "prism"){

                        let prismFrontMaterial = new THREE.MeshPhongMaterial( { 
                            color: 0xccddff, 
                            envMap: envTextures.skyBoxEnv, 
                            refractionRatio: 0.9, 
                            reflectivity: 1,
                            transparent : true,
                            opacity : 0.92,
                            side: THREE.FrontSide
                        })

                        let prismBackMaterial = new THREE.MeshPhysicalMaterial({
                            map: null,
                            color: 0x888888,
                            metalness: 1,
                            roughness: 0,
                            opacity: 0.1,
                            side: THREE.FrontSide,
                            transparent: true,
                            envMapIntensity: 5,
                            premultipliedAlpha: true
                            // TODO: Add custom blend mode that modulates background color by this materials color.
                        })

                        item.material = prismFrontMaterial

                        let second = item.clone()
                        item.add(second)
                        let s = 1.1

                        // second.position.set(13, 0.5, 127)
                        second.scale.set(s, s, s)
                        second.rotation.y = 0.4
                        second.material = prismBackMaterial
                        // scene.add(second)
                }

                else if(item.name === "prismInside"){

                    let s = 1.1
                    item.scale.set(s, s, s)

                    let whiteMat = new THREE.MeshPhongMaterial({ 
                        color: "#fff",
                        transparent : true,
                        opacity : 0.8,
                        emissive : "#fff", 
                        shininess: 30, 
                        flatShading: false,
                        side: THREE.DoubleSide
                    })
    
                    item.material = whiteMat
                }

                else if(item.name === "rainbowRay"){

                    let whiteMat = new THREE.MeshPhongMaterial({ 
                        color: "#fff",
                        transparent : true,
                        opacity : 0.8,
                        emissive : "#fff", 
                        shininess: 30, 
                        flatShading: false,
                        side: THREE.DoubleSide
                    })
    
                    item.material = whiteMat
                }

                else if(item.name === "midRays"){

                    let whiteMat = new THREE.MeshPhongMaterial({ 
                        color: "#fff",
                        // emissive : "#fff", 
                        transparent: true,

                        shininess: 30, 
                        flatShading: false,
                        side: THREE.DoubleSide
                    })
    
                    item.material = whiteMat
                }

                else {
                    let color

                    if(item.name === "violet") color = "#cc34eb"
                    else if(item.name === "blue") color = "#29abe2"
                    else if(item.name === "orange") color = "#ff4a03"
                    else color = item.name

                    
                    let colorMat = new THREE.MeshPhongMaterial({ 
                        color, 
                        // specular: "#fff",
                        transparent : true,
                        opacity : 0.8,
                        emissive : color, 
                        shininess: 30, 
                        flatShading: false,
                        side: THREE.DoubleSide
                    })
    
                    item.material = colorMat
                }

            })

            
        }

        else if(model === "terrain"){
            modelData.children.map((item, i) => {

                switch (item.name) {
                   

                    case "railing":
                        item.material = basic
                        const panOptions = { 
                            showGui : true, 
                            u : 1,
                            v : 1, 
                            zoom : 10, 
                            flipY : false, 
                            textureRotation : 0,
                            animateV : true,
                            animateU : true
                        }

                        attachTextures(item, gui, textures.psyTexture, panOptions)
                        break

                    // default:
                    //     item.material = cubeMaterial1
                    //     break
                }
            })
        }

        else if(model === "vinylPlayr"){
            // console.log(modelData)

            let s = 1

            modelData.position.set(9.9, 2.5, 35.8)
            modelData.scale.set(s, s, s)
            modelData.rotation.x = Math.PI/2
            modelData.rotation.z = 4.1

            var controls = new function() {
                this.posY = 2.5
                this.rX = Math.PI/2
                this.rZ = 4.1
            }
    
            // gui.add(controls, 'posY', 0, 5)
            // gui.add(controls, 'rX', 0, 4 * Math.PI)
            // gui.add(controls, 'rZ', 0, 4 * Math.PI)

            // function animate(time) {
            //     modelData.position.set(9.9, controls.posY, 35.8)
            //     // modelData.scale.set(s, s, s)
            //     modelData.rotation.x = controls.rX
            //     modelData.rotation.z = controls.rZ 
    
            //     requestAnimationFrame(animate)
            // }
    
            // animate()

            modelData.children.map((item, i) => {
               

               

                switch (item.name) {
                    case "baseDisc":
                        item.material = cubeMaterial2
                        break

                    case "frameForList":
                        item.material = basic
                        const panOptions = { 
                            showGui : false, 
                            u : 1, 
                            v : 1, 
                            zoom : 3, 
                            flipY : false, 
                            textureRotation : 0,
                            // animateV : true,
                            // animateU : true
                        }

                        attachTextures(item, gui, textures.woodTexture, panOptions)
                        break
                    
                    case "midCube":
                        item.material = basic
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

                        attachTextures(item, gui, textures.woodTexture, panOptions1)
                        break

                    case "frame":
                        item.material = basic

                        const panOptions2 = { 
                            showGui : false, 
                            u : 1, 
                            v : 1, 
                            zoom : 3, 
                            flipY : false, 
                            textureRotation : 0,
                            animateV : true,
                            animateU : true
                        }

                        attachTextures(item, gui, textures.psyTexture, panOptions2)
                        break
                    
                    case "disc":
                        item.material = cubeMaterial2
                        function animate(time) {
                            
                            item.rotation.y += 0.02 
                
                            requestAnimationFrame(animate)
                        }
                        animate()

                        const panOptions3 = { 
                            showGui : false, 
                            u : 1, 
                            v : 0.9, 
                            zoom : 2.1, 
                            flipY : false, 
                            textureRotation : 0,
                            // animateV : true,
                            // animateU : true
                        }

                        attachTextures(item, gui, textures.psyTexture, panOptions3)
                        break

                    case "rotor":
                        item.children.filter(item => item.name === "pinkPipe")[0].material = item.material = cubeMaterial3
                        break

                    case "songList":
                        item.material = basic

                        const panOptions4 = { 
                            showGui : false, 
                            u : 1, 
                            v : 1, 
                            zoom : 1, 
                            flipY : false, 
                            textureRotation : 0,
                            animateV : false,
                            animateU : false
                        }

                        attachTextures(item, gui, textures.songList, panOptions4)
                        break
                
                    default:
                        item.material = cubeMaterial1
                        break
                }
            })
        }


       



        // else if(model === "welcomeHoarding"){
        //     // x: 38.10720647743632
        //     // y: 1.6
        //     // z: 56.01103010103523
        // }

        
    })

    // Create Hoarding

    
    let options = {
        aspectRatio: 818/541,
        width : 8, 
        widthSections : 50,
        opacity : 0.9, 
        perkiness0to10 : 0.5, 
        smoothing0to10 : 1, 
        speed0to1 : 0.02
    }

    let wobblyPlane = getSimpleWobblePlane(
        options
    )

    wobblyPlane.position.set(
        38.10,
        4,
        56
    )

    const panOptions = { 
        showGui : false, 
        u : 1, 
        v : 1, 
        zoom : 1, 
        flipY : true, 
        textureRotation : 0,
        animateV : true
    }

    attachTextures(wobblyPlane, gui, textures.mainHoarding, panOptions)


    scene.add(wobblyPlane)
}
