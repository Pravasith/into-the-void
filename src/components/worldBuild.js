import React, { useState, useEffect, useContext, useRef } from 'react'
import * as THREE from 'three'
import gsap from 'gsap'

import { Howl, Howler } from 'howler'
import Stats from "stats.js"

// import { addMass, removeMass } from '../factories/massObjects'
// import { applyVelocity, displace, applyAcceleration } from '../factories/physics'

import createAxes from '../factories/axes'


// import { PhysicsContext } from '../utils/contexts/physicsContexts'
import { GridIcon, AddObjIcon, ObjRelatedIcon, RemoveObjIcon } from '../assets/images'
// import { colors, skyboxGradients, albumSongs, hoardingTextures } from './resources'
// import { totesRandoInt, totesRando } from '../factories/math/usefulFuncs'
import { addSkyBoxes } from './env/sky'

// import { noise } from '../factories/waterNoise'
import { loadModelsTexturesAndEnvMaps } from '../factories/loadModels'
import { getWater } from './env/water'
import { movements } from '../factories/girlMovement'
import { sceneAnimations } from '../factories/animations'
// import { WorldContext } from '../utils/contexts/worldContext'
import {  getSimpleWobblePlane } from './env/water2'
import { addFloydElements } from '../factories/floydElements'
import { createDingles } from '../factories/dingles'

import "../assets/scss/world.scss"
import { attachTextures } from '../factories/textures'



const WorldBuild = () => {

    const [ newObj, setNewObj ] = useState([])
    const [ scene, setScene ] = useState(null)
    const [ camera, setCamera ] = useState(null)

    const [ models, setModels ] = useState(null)
    const [ textures, setTextures ] = useState(null)
    const [ envTextures, setEnvTextures ] = useState(null)

    const [ clock, setClock ] = useState(null)
    const [ renderer, setRenderer ] = useState(null)
    const [ controls, setControls ] = useState(null)
    const [ initComplete, setInitComplete ] = useState(false)
    const [ animationPresets, setAnimationPresets ] = useState(null)
    const [ gui, setGui ] = useState(null)
    const [ stats, setStats ] = useState(null)


    // const [ slowKey, setSlowKey ] = useState(null)
    

    let keys = {},
        prevCurrKey = [],
        typeOfControls = "pointerLock", // trackBall or pointerLock,
        requestId

    const canvasWrapper = useRef(null)

    // const { addVelocityStats, dispatch } = useContext(PhysicsContext)
    // const { keys, dispatch } = useContext(WorldContext)

    useEffect(() => {
        init()
    },[])

    useEffect(() => {
        // If init() is finished executing
        if(animationPresets){

            // movements initiation -  see girlMovement.js file
            movements.init(animationPresets)

            let girl = animationPresets.models["currentCharacter"],
                animations = animationPresets.models["currentCharacter"].animations
            
            // attachTextures(scene, models, gui)

            sceneAnimations.init(girl, animations)

            // console.log(keys)
            animate()
        }
    }
    ,[initComplete]
    )

    function createStats() {
        var stats = new Stats()
        stats.setMode(0)
  
        stats.domElement.style.position = 'absolute'
        stats.domElement.style.left = '0'
        stats.domElement.style.top = '0'
  
        return stats
    }

    const init = () => {
        let renderer,
            scene,
            camera,
            controls,
            mixer,
            models,
            textures,
            envTextures,
            clock = new THREE.Clock(),
            peak = 0

        setClock(clock)

        // Dynamic module importer
        dynamicallyImportPackage()
        .then(async module => {
            // BASIC SETTINGS /////////////////////////////////////////

            // renderer
            const container = canvasWrapper.current

            let stats = createStats()
            setStats(stats)
            document.body.appendChild(stats.domElement)
           

            renderer = new THREE.WebGLRenderer({
                antialias: true,
                alpha:true
            })
            // renderer.setPixelRatio( window.devicePixelRatio )
            renderer.setSize(container.clientWidth, container.clientHeight)
            renderer.setClearColor(0x000000, 0) // Background color

            renderer.shadowMap.enabled = true
            // renderer.shadowMap.type = THREE.PCFSoftShadowMap
            // renderer.sortObjects = false

            container.appendChild(renderer.domElement)

            setRenderer(renderer)

            // scene
            scene = new THREE.Scene()
            setScene(scene)

            

            

            // Load models like terrain, character, yada yada
            await loadModelsTexturesAndEnvMaps(module)
            .then((loadedData) => {
                models = loadedData.models
                textures = loadedData.textures
                envTextures = loadedData.envTextures

                Object.keys(models).forEach((gltf) => {

                    const modelData = models[gltf]
                    const model = modelData.scene
                    const scale = 1

                    // Adds terrain, charater
                    scene.add(model)

                    model.scale.set(
                        scale, 
                        scale,
                        scale
                    )
                })
            })
            .catch(e => console.error(e))

            setModels(models)
            setTextures(textures)
            setEnvTextures(envTextures)

            // GUI
            let gui = new module.GUI()
            setGui(gui)

            // let stats = new module.Stats
            // setStats(stats)

            // console.log(module)
            // Add fog
            scene.fog = new THREE.Fog(
                "#000",
                30, // near value
                300 // far value
            )

            // TEXTURE SKYBOX - FOR WORLD ENV
            const sky = addSkyBoxes(textures.skyTexture)
            scene.add(sky)

            // Add floyd - static elements
            addFloydElements(models, scene, gui, textures, envTextures)

            function createPointlight(color, size, intensity) {
                const sphereX = new THREE.SphereBufferGeometry( size, 16, 8 );
				let light = new THREE.PointLight( color, intensity, 50 );
                light.add( new THREE.Mesh( sphereX, new THREE.MeshBasicMaterial( { visible : false, color : color } ) ) );

				return light

            }
            
            const materialsToSeaShack = () => {
                //materials
                let glowingRocksMat = new THREE.MeshLambertMaterial({ 
                    color: "#ffffff", 
                    envMap: envTextures.sceneEnv, 
                    combine: THREE.MixOperation, 
                    // reflectivity: 0.3
                    reflectivity: 0.15

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

                const subdivide = (mesh, subdivisions) => {

                    let geometry = mesh.geometry
                    let modifier = new module.SubdivisionModifier(subdivisions)
                    let smoothGeometry = modifier.modify(geometry)
    
                    // convert to THREE.BufferGeometry
    
                    if(mesh.geometry) mesh.geometry.dispose()
    
                    mesh.geometry = new THREE.BufferGeometry().fromGeometry(smoothGeometry)
    
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
                            let crystalLight = createPointlight("#29abe2", 1, 4)
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

                // console.log(meshes)
                
            }

            materialsToSeaShack()


            // Lights
            const lightDistance = 5
            const ambientLight = new THREE.AmbientLight("#ffffff", 0.6),
                dirLight = new THREE.DirectionalLight("#ffffff", 0.2)


            dirLight.position.set(lightDistance + 20, lightDistance + 20, lightDistance)
           
            


            // spotLight.target.position.x = 6
            // spotLight.target.position.y = 0
            // spotLight.target.position.z = 12

            scene.add(ambientLight)
            scene.add(dirLight)
            // scene.add(lightHelperS)


            dirLight.castShadow = true;

            dirLight.shadow.mapSize.width = 2048
            dirLight.shadow.mapSize.height = 2048

            var d = 35

            dirLight.shadow.camera.left = - d
            dirLight.shadow.camera.right = d
            dirLight.shadow.camera.top = d
            dirLight.shadow.camera.bottom = - d

            dirLight.shadow.camera.far = 3500
            dirLight.shadow.bias = -0.00005

            let dirLightHeper = new THREE.DirectionalLightHelper( dirLight, 10 )
            scene.add( dirLightHeper )


            let light1 = createPointlight("#ff4242", 0.2, 10)
            let light2 = createPointlight("#ff1ca4", 0.6, 10)
            let light3 = createPointlight("#ff1ca4", 0.6, 10)

            light2.position.set(
                6.08,
                6,
                12.84
            )

            light3.position.set(
                3.6,
                5,
                12.2
            )
            
            scene.add(light1, light2, light3)

            let sinCount = 0
            gsap.ticker.add(() => {
                light1.position.y = Math.sin(sinCount) 
                sinCount+= 0.01
            })


            


            // createAxes( scene, maxRange, incDecStepSize, colors )
            // createAxes(
            //     scene,
            //     15,
            //     5,
            //     {
            //         x : "purple",
            //         y : "purple",
            //         z : "purple",
            //     }
            // )


            // Add water 
            // const { Water } = module

            // // waterPlaneScene.children[0].material.side = THREE.FrontSide
            // const water = getWater(Water, gui)
            // scene.add(water)

            // OR
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

            // Anchor for 3D orbit movements (mouse)
            let anchor = new THREE.Object3D()
            anchor.position.y = 10
            anchor.scale.set(0.125, 0.125, 0.125)
            scene.add(anchor)


            // camera
            camera = new THREE.PerspectiveCamera(55, container.clientWidth / container.clientHeight, 10, 10000)
            camera.position.set(0, (2.5/2 * 5.5) - 7, 2.5 * 10)
            camera.rotation.x = -Math.PI / 20

            // sets camera to the state
            setCamera(camera)

            var material = new THREE.MeshBasicMaterial( {color: "#fff", side: THREE.DoubleSide} );

            let sphereG = new THREE.SphereGeometry(1, 10, 10)
            let sphere = new THREE.Mesh(sphereG, material)
            scene.add( sphere );

            sphere.position.set(0, 0, -20)

            sphere.castShadow = true
            // plane.receiveShadow = true
            

            // controls
            if(typeOfControls === "pointerLock"){
                // Pointer lock controls imported dynamically because it can only be imported in useEffect
                anchor.add(camera) // Parents camera to Anchor
                controls = new module.PointerLockControls(anchor, container)
                scene.add(
                    controls.getObject()
                )
            }

            else if(typeOfControls === "trackBall"){
                // Trackball controls imported dynamically because it can only be imported in useEffect
                controls = new module.TrackballControls(camera, container)
                controls.minDistance = 1
                controls.maxDistance = 1000
                controls.enableDamping = false // an animation loop is required when either damping or auto-rotation are enabled
            }

            // Add controls to state
            setControls(controls)

            

            const animPresets = {
                models,
                anchor,
                document,
                camera,
                scene
            }

            setAnimationPresets(animPresets)

            // createDingles(scene, module, 6, models.dingleBo, {
            //     x : 10,
            //     z : 24
            // }, 3)

            // createDingles(scene, module, 7, models.dingleBo, {
            //     x : 0.8,
            //     z : 9.3
            // }, 3)

            // createDingles(scene, module, 4, models.dingleBo, {
            //     x : -10,
            //     z : 34
            // }, 2)


            // Girl animations
            // girlAnimations(
            //     models["xtc-x"],
            //     models["xtc-x"].animations,
            //     // keys,
            //     // dispatch
            // )

            // Move girl
            // girlMovement(
            //     animationPresets
            //     // dispatch
            // )
            

            
            // let wireframe = new THREE.WireframeGeometry(geometry)
            // let line = new THREE.LineSegments(wireframe)
            // line.rotation.x = -Math.PI / 2
            // line.position.y = -0
            // line.material.color.setHex(0x000000)
            // scene.add(line)

            
            setInitComplete(true)

        })
    }


    function animate( time ) {
        // Animation mixer update - START
        let delta
        // Animation mixer update - END

        requestId = undefined

        if(scene && camera && controls && stats){
            if(typeOfControls === "trackBall") controls.update()

            stats.update()
            // Animates movements (check girlMovement.js file)
            if(Object.keys(keys).length > 0) movements.animateMovements(keys, prevCurrKey)
            else stop()

            if(clock){
                delta = clock.getDelta()
            }

            // console.log("X")
            renderer.render(scene, camera)

            start()
        }
    }

    function start() {
        if (!requestId) {
           requestId = window.requestAnimationFrame(animate)
        }
    }
    
    function stop() {
        if (requestId) {
           window.cancelAnimationFrame(requestId)
           requestId = undefined
        }
    }

    const dynamicallyImportPackage = async () => {
        let allMods = {}

        // Importing trackball controls and GLTFLoader
        await Promise.all([
            import('three/examples/jsm/controls/TrackballControls'),
            import('three/examples/jsm/loaders/GLTFLoader.js'),
            import('three/examples/jsm/loaders/DRACOLoader.js'),
            import('three/examples/jsm/controls/PointerLockControls.js'),
            import('three/examples/jsm/objects/Water2.js'),
            import('three/examples/jsm/libs/dat.gui.module.js'),
            import('three/examples/jsm/modifiers/SubdivisionModifier.js'),
            import('three/examples/jsm/utils/SkeletonUtils.js'),

        ])
        .then(modules => {
            modules.map((item, i) => {
                allMods = {
                    ...allMods,
                    ...item
                }
            })
        })
        .catch(e => console.log(e))

        return allMods
    }

    

  
    return (
        <div
            className = "parent-class"  
            
            >
            <div
                className="tools-holster"
                tabIndex="0"
                >
                {/* <p>{addVelocityStats.stats.timeElapsed}</p> */}
                <div className="icon-wrap">

                    <div className="icon-wrap-abs">
                        {/* Background dummy div */}
                            <div className="icon-wrap-gradient">
                            </div>
                        {/* Background dummy div */}

                        <div className="icon-wrap-gradient-abs">
                            <GridIcon />
                        </div>
                    </div>

                    <div className="side-icon-wrap hide">
                        <div className="side-icon-wrap-abs"> 
                        </div>
                    </div>
                    
                </div>

                <div className="icon-wrap">
                    <div className="icon-wrap-abs">
                        {/* Background dummy div */}
                            <div className="icon-wrap-gradient">
                            </div>
                        {/* Background dummy div */}

                        <div className="icon-wrap-gradient-abs">
                            <ObjRelatedIcon />
                        </div>
                    </div>

                    <div className="side-icon-wrap hide">
                        <div className="side-icon-wrap-abs"> 
                            <div 
                                className="sub-option"
                                onClick={() => {

                                    var material = new THREE.MeshLambertMaterial( {color: "#eb4034", emissive: "#eb4034", emissiveIntensity: 5,  side: THREE.DoubleSide} );

                                    let sphereG = new THREE.SphereGeometry(1, 10, 10)
                                    let sphere = new THREE.Mesh(sphereG, material)
                                    scene.add( sphere );

                                    sphere.position.set(0, 0, 0)

                                    sphere.castShadow = true

                                }} 
                                >
                                <AddObjIcon />
                            </div>

                            <div 
                                className="sub-option"
                                onClick= {() => {
                                    // console.log(terrain)
                                }}
                                >
                                <RemoveObjIcon />

                                {/* <img src="https://xi-upload.s3.amazonaws.com/3dprinted.jpg" alt=""/> */}
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div
                ref = {canvasWrapper}
                className="display-screen"
                onClick = {() => {
                    if(controls && typeOfControls === "pointerLock") controls.lock()
                }}
                tabIndex = "1"
                onKeyDown = {(e) => {
                    // let keyPress = keys
                    // keyPress[e.keyCode] = true
    
                    // setKeys({
                    //     ...keys,
                    //     ...keyPress
                    // })
                    const { keyCode } = e

                    if(
                        keyCode === 87 ||
                        keyCode === 83 ||
                        keyCode === 65 ||
                        keyCode === 68 
                        ) sceneAnimations.animationControllers(keys)
    
    
                    keys[e.keyCode] = true
    
                    // Stores the prev key in [0] and current key in [1]
                    if(prevCurrKey[1] !== e.keyCode){
                        prevCurrKey[0] = prevCurrKey[1]
                        prevCurrKey[1] = e.keyCode
                    }

                }}
                onKeyUp = {(e) => {
    
                    const { keyCode } = e

                    if(
                        keyCode === 87 ||
                        keyCode === 83 ||
                        keyCode === 65 ||
                        keyCode === 68 
                        ) sceneAnimations.animationControllers(null, keys)
    
    
                    // let keyPress = keys
                    // delete keyPress[e.keyCode]
    
                    // setKeys(keyPress)
    
                    delete keys[e.keyCode]
                }}
                >
            </div>
        </div>
    )
}

export default WorldBuild