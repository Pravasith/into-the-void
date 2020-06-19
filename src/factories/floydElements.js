
import * as THREE from 'three'
import { getSimpleWobblePlane } from "../components/env/water2"
import { attachTextures } from "./textures"
import { totesRando, totesRandoInt } from './math/usefulFuncs'


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

        let prismFrontMaterial = new THREE.MeshStandardMaterial({ 
            color: "#fff", 
            envMap: envTextures.sceneEnv, 
            // combine: THREE.MixOperation, 
            // reflectivity: 0.3
            metalness : 0.8,
            shininess : 0.5,
            roughness : 0.2,
            // reflectivity: 0.8
    
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

        const rainbowColors = {
            red : "red",
            blue : "#29abe2",
            violet : "#cc34eb",
            yellow : "yellow",
            green : "green",
            orange : "#ff4a03"
        }

        const moveUpAndDown = (item) => {
            let p=0, initialPos = item.position.y
            function animate2() {
                p+=0.01
                let yPos = Math.abs(Math.cos(p)) * 0.5

                item.position.y = initialPos +  yPos
                requestAnimationFrame(animate2)
            }
            animate2()
        }



        if(model === "darkSidePrism"){
            modelData.position.set(15.4, 1, 49)
            modelData.scale.set(10, 10, 10)
            modelData.rotation.y = 0.4

            // let cPos = 0
            function animate(now) {
                modelData.rotation.y = now * 0.0008
                const cPos = now * 0.001

                // let s = 4 * Math.abs(Math.sin(cPos) + 2.1)
                modelData.position.y = Math.sin(cPos) + 1
                // modelData.scale.set(s, s, s)
    
                requestAnimationFrame(animate)
            }
    
            animate()

            


            modelData.children.map((item, i) => {
                if(item.name === "prism"){

                        

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
                   
                    case "Sphere":
                        const createPointlight = (color, intensity) => {
                            let light = new THREE.PointLight( color, intensity, 50 )
                            return light
                        }
                    
                    
                        let crystalLight1 = createPointlight(rainbowColors.blue, 2),
                            crystalLight2 = createPointlight(rainbowColors.orange, 3),
                            crystalLight3 = createPointlight(rainbowColors.red, 5),
                            crystalLight4 = createPointlight(rainbowColors.orange, 2),
                            crystalLight5 = createPointlight(rainbowColors.yellow, 3),
                            crystalLight6 = createPointlight(rainbowColors.blue, 5)

                        crystalLight1.position.set(1, 1, 1)
                        crystalLight2.position.set(-1, 1, -1)
                        crystalLight3.position.set(0, 1, 0)
                        crystalLight4.position.set(1, -1, 1)
                        crystalLight5.position.set(-1, -1, -1)
                        crystalLight6.position.set(0, -1, 0)

                        item.add(
                            crystalLight1, 
                            crystalLight2, 
                            crystalLight3,
                            // crystalLight4, 
                            // crystalLight5, 
                            crystalLight6
                        )

                        let c=0
                        function animate() {
                            c+=0.01
                            let s = 1 +  2 * Math.abs(Math.sin(c))

                            item.scale.set(s, s, s)
                            item.rotation.y += 0.02 
                            requestAnimationFrame(animate)
                        }
                        animate()

                        moveUpAndDown(item)
                        break

                    case "elevatorShaft":
                        moveUpAndDown(item)
                        break

                    case "pinkGlow2":
                        moveUpAndDown(item)
                        break

                    default:
                        break
            }
            })
        }

        else if(model === "vinylPlayr"){
            // console.log(modelData)

            let s = 0.4

            // modelData.position.set(0.8, 0.5, -6.9)
            modelData.position.set(
                -4.194829940795898,
                0.8241021037101746,
                -9.066085815429688,
            )

            modelData.scale.set(s, s, s)
            // modelData.rotation.x = Math.PI/2
            modelData.rotation.z =  Math.PI / 8
            modelData.rotation.z =  5
            // modelData.rotation.z = 9.4

            // var controls = new function() {
            //     this.posY = 0.5
            //     this.rX = Math.PI/2
            //     this.rZ = 0
            // }
    
            // gui.add(controls, 'posY', 0, 5)
            // // gui.add(controls, 'rX', 0, 4 * Math.PI)
            // gui.add(controls, 'rZ', 0, 4 * Math.PI)

            // function animate(time) {
            //     modelData.position.y = controls.posY
            //     // modelData.scale.set(s, s, s)
            //     // modelData.rotation.x = controls.rX
            //     modelData.rotation.y = controls.rZ 
    
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
                            zoomX : 3, 
                            zoomY : 3, 
                            flipY : false, 
                            textureRotation : 0,
                            // animateV : true,
                            // animateU : true
                        }

                        attachTextures(item, gui, textures.woodTexture, panOptions)
                        break


                    case "frame":
                        item.material = basic

                        const panOptions2 = { 
                            showGui : false, 
                            u : 1, 
                            v : 1, 
                            zoomX : 3, 
                            zoomY : 3, 
                            flipY : false, 
                            textureRotation : 0,
                            animateV : true,
                            animateU : true
                        }

                        attachTextures(item, gui, textures.psyTexture, panOptions2)
                        break
                    
                    case "disc":
                        item.material = prismFrontMaterial
                        item.children[0].material = prismFrontMaterial
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
                            zoomX : 1, 
                            zoomY : 1, 

                            flipY : false, 
                            textureRotation : 0,
                            animateV : false,
                            animateU : false
                        }

                        attachTextures(item, gui, textures.songList, panOptions4)
                        break

                    case "blackDunt":
                        item.material = prismFrontMaterial
                        break
                   
                
                    default:
                        // item.material = prismFrontMaterial
                        // item.material = cubeMaterial1
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


}
