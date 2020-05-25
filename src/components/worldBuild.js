import React, { useState, useEffect, useContext, useRef } from 'react'
import * as THREE from 'three'
import { Howl, Howler } from 'howler'
import Stats from "stats.js"

import { addMass, removeMass } from '../factories/massObjects'
import { applyVelocity, displace, applyAcceleration } from '../factories/physics'

import createAxes from '../factories/axes'

import "../assets/scss/world.scss"
import { PhysicsContext } from '../utils/contexts/physicsContexts'
import { GridIcon, AddObjIcon, ObjRelatedIcon, RemoveObjIcon } from '../assets/images'
import { colors, skyboxGradients, albumSongs, hoardingTextures } from './resources'
import { totesRandoInt, totesRando } from '../factories/math/usefulFuncs'
import { addSkyBoxes } from './env/sky'

// import { noise } from '../factories/waterNoise'
import { loadModels } from '../factories/loadModels'
import { getWater } from './env/water'
import { movements } from '../factories/girlMovement'
import { girlAnimations, sceneAnimations } from '../factories/animations'
import { WorldContext } from '../utils/contexts/worldContext'
import { getSimpleWater } from './env/water2'
import { attachTextures } from '../factories/textures'
import { addFloydElements } from '../factories/floydElements'
import { createDingles } from '../factories/dingles'




const WorldBuild = () => {

    const [ newObj, setNewObj ] = useState([])
    const [ scene, setScene ] = useState(null)
    const [ camera, setCamera ] = useState(null)
    const [ models, setModels ] = useState(null)
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

            let girl = animationPresets.models["animations-clean-x"],
                animations = animationPresets.models["animations-clean-x"].animations
            
            // attachTextures(scene, models, gui)

            sceneAnimations.init(girl, animations)

            console.log(keys)
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

            // renderer.shadowMap.enabled = true;
            // renderer.shadowMap.type = THREE.PCFSoftShadowMap;

            container.appendChild(renderer.domElement)

            setRenderer(renderer)

            // scene
            scene = new THREE.Scene()
            setScene(scene)

            

            // TEXTURE SKYBOX - FOR WORLD ENV
            addSkyBoxes(scene)

            // Load models like terrain, character, yada yada
            await loadModels(module)
            .then((gltfs) => {
                models = gltfs

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

                    // Store animations

                    // if(modelData.animations)
                    // if(modelData.animations.length > 0){
                    //     mixer = new THREE.AnimationMixer(model)
                    //     mixer.clipAction(modelData.animations[0]).play()
                    //     // mixer.clipAction(gltf.animations[0]).play()
                    // }
                })
            })
            .catch(e => console.error(e))

            // setMixer(mixer)
            setModels(models)

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

            // Add floyd - static elements
            
            addFloydElements(models, scene, gui)


            // Lights
            const lightDistance = 1
            const ambientLight = new THREE.AmbientLight("#ffffff", 0.5),
                dirLight2 = new THREE.DirectionalLight("#ffffff", 0.2),
                dirLight3 = new THREE.DirectionalLight("#ffffff", 0.2),
                dirLight4 = new THREE.DirectionalLight("#ffffff", 0.1)

            dirLight2.position.set(lightDistance, lightDistance, -lightDistance)
            dirLight3.position.set(-lightDistance, lightDistance, lightDistance)
            dirLight4.position.set(-lightDistance, lightDistance, -lightDistance)

            scene.add(ambientLight)

            scene.add(dirLight2)
            scene.add(dirLight3)
            scene.add(dirLight4)



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
            const { Water } = module
            getWater(scene, Water)
            // getSimpleWater(scene)
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
                // const girlCharacter = models["animations-clean-x"].scene
                // anchor.add(girlCharacter)
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

            console.log("X")
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
            // import('three/examples/jsm/libs/stats.min.js'),
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
    
                    sceneAnimations.animationControllers(keys)
    
    
                    keys[e.keyCode] = true
    
                    // Stores the prev key in [0] and current key in [1]
                    if(prevCurrKey[1] !== e.keyCode){
                        prevCurrKey[0] = prevCurrKey[1]
                        prevCurrKey[1] = e.keyCode
                    }

                }}
                onKeyUp = {(e) => {
    
                    sceneAnimations.animationControllers(null, keys)
    
    
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