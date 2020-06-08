import React, { useState, useEffect, useContext, useRef } from 'react'
import * as THREE from 'three'


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
import { materialsToSeaShack } from './assignMaterials'
import { addLights } from './env/lights'
import { addFishes } from '../factories/animateFish'



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
        firstMouseLock = false,
        pause = false

    const canvasWrapper = useRef(null)

    // const { addVelocityStats, dispatch } = useContext(PhysicsContext)
    // const { keys, dispatch } = useContext(WorldContext)

    useEffect(() => {
        init()
    },[])

    useEffect(() => {
        // If init() is finished executing
        if(animationPresets){

            if(typeOfControls === "pointerLock"){
                controls.addEventListener("lock", () => {
                    pause = false
                    if(firstMouseLock){
                        animate()
                    }
                    else firstMouseLock = true
                    
                })
                
                controls.addEventListener( 'unlock', function () {
                    pause = true
                })
            }

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

            // TOGGLE GUI
            gui.destroy()

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

            // Assign materials and adds WATER too
            materialsToSeaShack(models, scene, gui, textures, envTextures)


           


            // Add lights
            addLights(scene)





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


            // Add fishes
            addFishes(models, clock, scene)


           



            window.addEventListener( 'resize', onWindowResize, false );

            function onWindowResize(){

                camera.aspect = window.innerWidth / window.innerHeight;
                camera.updateProjectionMatrix();

                renderer.setSize( window.innerWidth, window.innerHeight );

            }


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

            const moveBalloon = () => {
                let balloon = models["terrain"].scene.children.filter(mesh => {
                        return mesh.name === "balloon"
                    })[0],
                    crystal =  balloon.children.filter(mesh => {
                        return mesh.name === "crystal"
                    })[0]

                const createPointlight = (color, intensity) => {
                    let light = new THREE.PointLight( color, intensity, 50 )
                    return light
                }

                crystal.material.emissive = "#29abe2"
                crystal.material.emissiveIntensity = 0.7

                let crystalLight = createPointlight("#29abe2", 5)
                crystal.add(crystalLight)


                //========== the curve points we copied from Blender
                let points = [
                    [-15.864727020263672, 20.019498825073242, 1.1991803646087646] ,
                    [-10.206042289733887, 20.019498825073242, 1.1991803646087646] ,
                    [14.122605323791504, 11.68978500366211, 1.6080012321472168] ,
                    [15.293538093566895, 1.4762248992919922, 2.677096128463745] ,
                    [-2.2389841079711914, 2.173431396484375, 1.3749806880950928] ,
                    [15.88077449798584, -4.203508377075195, 4.208217620849609] ,
                    [6.553418159484863, -11.728780746459961, 5.346242904663086] ,
                    [-10.45313835144043, -18.094257354736328, 1.665771245956421] ,
                    [-15.22360610961914, -7.912998199462891, 3.298128128051758] ,
                    [-14.953625679016113, -2.7865638732910156, 7.15889835357666] ,
                ]
                //========== scale the curve to make it as large as you want
                let scale = 1
                //========== Convert the array of points into vertices (in Blender the z axis is UP so we swap the z and y)

                for (let i = 0; i < points.length; i++) {
                    let x = points[i][0] * scale
                    let y = points[i][1] * scale
                    let z = points[i][2] * scale

                    points[i] = new THREE.Vector3(x, z, -y)
                }

                //========== Create a path from the points
                let curvePath =  new THREE.CatmullRomCurve3(points)
                let percentage = 0,
                    bufferPercent = 0

                function positBalloon() {
                    // percentage += 0.00015
                    percentage += 0.00015

                    

                    let p1 = curvePath.getPointAt((percentage + bufferPercent) % 1)
                    let p2 = curvePath.getPointAt((percentage + bufferPercent + 0.01) % 1)
            
                  
                    balloon.position.x = p1.x
                    balloon.position.y = p1.y + 0.2
                    balloon.position.z = p1.z
            
                    // balloon.lookAt(
                    //     new THREE.Vector3(
                    //         p2.x, p2.y + 0.2, p2.z
                    //     )
                    // )
                }

                function animate( time ) {
    
                    positBalloon()

                    // console.log(
                    //     anchor.rotation.x,
                    //     anchor.rotation.y,
                    //     anchor.rotation.z
                    // )

                    if(anchor.rotation.x > 0.12){
                        anchor.rotation.x = 0.12
                    }
            
                    requestAnimationFrame( animate )
                    
                }
                
                animate()

                

            }

            moveBalloon()

            // createDingles(scene, module, 10, models.dingleBo, {
            //     x : 0,
            //     z : 0
            // }, 0.3)

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


    const animate = (now) => {
        // Animation mixer update - START
        let delta
        // now *= 0.001  // make it seconds
        // Animation mixer update - END

        // console.log("STILL RUNNING")

        if(scene && camera && controls && stats){


            stats.update()
            // Animates movements (check girlMovement.js file)
            if(Object.keys(keys).length > 0) movements.animateMovements(keys, prevCurrKey)

            if(clock){
                delta = clock.getDelta()
            }

            // models["vinylPlayr"].scene.rotation.y += 0.001
            renderer.render(scene, camera)


            if(typeOfControls === "trackBall"){
                controls.update()
            }

            if(pause) return
            requestAnimationFrame(animate)
            // console.log(pause)
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
                    if(controls && typeOfControls === "pointerLock"){
                        if(!controls.isLocked)
                        controls.lock()
                    }
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