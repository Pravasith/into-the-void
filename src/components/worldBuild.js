import React, { useState, useEffect, useContext, useRef } from 'react'
import * as THREE from 'three'

import { addMass, removeMass } from '../factories/massObjects'
import { applyVelocity, displace, applyAcceleration } from '../factories/physics'

import createAxes from '../factories/axes'

import "../assets/scss/world.scss"
import { PhysicsContext } from '../utils/contexts/physicsContexts'
import { GridIcon, AddObjIcon, ObjRelatedIcon, RemoveObjIcon } from '../assets/images'
import { colors } from './UIComponents'
import { totesRandoInt, totesRando } from '../factories/math/usefulFuncs'
import { addSkyBoxes } from './env/sky'

// import { noise } from '../factories/waterNoise'
import { loadModels } from '../factories/loadModels'
import { getWater } from './env/water'
import { movements } from '../factories/girlMovement'
import { girlAnimations, sceneAnimations } from '../factories/animations'
import { WorldContext } from '../utils/contexts/worldContext'
import { getSimpleWater } from './env/water2'


const WorldBuild = () => {

    const [ newObj, setNewObj ] = useState([])
    const [ scene, setScene ] = useState(null)
    const [ camera, setCamera ] = useState(null)
    const [ mixer, setMixer ] = useState(null)
    const [ clock, setClock ] = useState(null)
    const [ renderer, setRenderer ] = useState(null)
    const [ controls, setControls ] = useState(null)
    const [ initComplete, setInitComplete ] = useState(false)
    const [ animationPresets, setAnimationPresets ] = useState(null)

    // const [ slowKey, setSlowKey ] = useState(null)
    

    let keys = {},
        prevCurrKey = [],
        typeOfControls = "pointerLock", // TrackBall or PointerLock,
        slowKey 

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

            sceneAnimations.init(girl, animations)
            animate()
        }
    }
    ,[initComplete]
    )

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

           

            renderer = new THREE.WebGLRenderer({
                antialias: true,
                alpha:true
            })
            // renderer.setPixelRatio( window.devicePixelRatio )
            renderer.setSize(container.clientWidth, container.clientHeight)
            renderer.setClearColor(0x000000, 0) // Background color
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

            setMixer(mixer)

            // Add fog
            scene.fog = new THREE.Fog(
                "#ffffff",
                30, // near value
                1500 // far value
            )


            // Lights
            const lightDistance = 1
            const ambientLight = new THREE.AmbientLight("#ffffff", 0.5),
                dirLight1 = new THREE.DirectionalLight("#ffffff", 0.5),
                dirLight2 = new THREE.DirectionalLight("#ffffff", 0.1),
                dirLight3 = new THREE.DirectionalLight("#ffffff", 0.1),
                dirLight4 = new THREE.DirectionalLight("#ffffff", 0.1)

            dirLight1.position.set(lightDistance, lightDistance, lightDistance)
            dirLight2.position.set(lightDistance, lightDistance, -lightDistance)
            dirLight3.position.set(-lightDistance, lightDistance, lightDistance)
            dirLight4.position.set(-lightDistance, lightDistance, -lightDistance)

            scene.add(ambientLight)
            scene.add(dirLight1)
            scene.add(dirLight2)
            scene.add(dirLight3)
            scene.add(dirLight4)


            // createAxes( scene, maxRange, incDecStepSize, colors )
            createAxes(
                scene,
                15,
                5,
                {
                    x : "purple",
                    y : "purple",
                    z : "purple",
                }
            )


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
            camera = new THREE.PerspectiveCamera(55, container.clientWidth / container.clientHeight, 1, 10000)
            camera.position.set(0, (2.5/2 * 5.5) - 7, 2.5 * 10)
            camera.rotation.x = -Math.PI / 20

            // sets camera to the state
            setCamera(camera)
            



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

        
        if(scene && camera && controls){
            if(typeOfControls === "trackBall") controls.update()

            renderer.render( scene, camera )
            requestAnimationFrame( animate )

            // Animates movements (check girlMovement.js file)
            movements.animateMovements(keys, prevCurrKey)

            if(clock){
                delta = clock.getDelta()

                
            }

            
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
            import('three/examples/jsm/objects/Water2.js')
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

                                    let sphereObj,
                                        c = newObj.length + 1,
                                        rando = totesRandoInt(0, colors.length - 1),
                                        color = colors[ rando ]
                                    
                                        // console.log(color, colors.indexOf(color), rando)

                                    sphereObj = addMass(
                                        scene,
                                        new THREE.Vector3(
                                            totesRando( -15, 15 ),
                                            totesRando( -15, 15 ),
                                            totesRando( -15, 15 )
                                        ),
                                        totesRando(0.1, 1.5),
                                        color
                                    )

                                    setNewObj(newObj.concat(sphereObj))
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
                >
            </div>
        </div>
    )
}

export default WorldBuild