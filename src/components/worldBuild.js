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
import { animateModels } from '../factories/animateModels'


const WorldBuild = () => {

    const [ newObj, setNewObj ] = useState([])
    const [ scene, setScene ] = useState(null)

    const canvasWrapper = useRef(null)
    

    const { addVelocityStats, dispatch } = useContext(PhysicsContext)

    useEffect(() => {
        init()
    }
    ,[])

    const init = () => {
        let renderer, 
            scene, 
            camera, 
            controls, 
            mixer,
            models,
            clock = new THREE.Clock(),
            peak = 0

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



            // scene
            scene = new THREE.Scene()
            setScene(scene)


            // controls
            // Trackball controls imported dynamically because it can only be imported in useEffect
            // controls = new module.TrackballControls(camera, container)
            // controls.minDistance = 1
            // controls.maxDistance = 1000
            // controls.enableDamping = false; // an animation loop is required when either damping or auto-rotation are enabled

            // TEXTURE SKYBOX - FOR WORLD ENV
            addSkyBoxes(scene)

            // Load models like terrain, character, yada yada
            await loadModels(module)
            .then((gltfs) => {
                models = gltfs
                gltfs.map((gltf, i) => {
                    const { modelData } = gltf
                    const model = modelData.scene
                    const scale = 1

                    // Adds terrain, charater
                    scene.add(model)

                    model.scale.set(
                        scale, 
                        scale, 
                        scale
                    )

                    // if(modelData.animations)
                    if(modelData.animations.length > 0){
                        mixer = new THREE.AnimationMixer(model)
                        mixer.clipAction(modelData.animations[0]).play()
                        // mixer.clipAction(gltf.animations[0]).play()
                    }
                })
            })
            .catch(e => console.error(e))

            // Add fog
            scene.fog = new THREE.Fog(
                "#ffffff",
                10, // near value
                270 // far value
            )


            // Lights
            const lightDistance = 15
            const ambientLight = new THREE.AmbientLight("#ffffff", 0.5),
                dirLight1 = new THREE.DirectionalLight("#ffffff", 0.4),
                dirLight2 = new THREE.DirectionalLight("#ffffff", 0.4),
                dirLight3 = new THREE.DirectionalLight("#ffffff", 0.4),
                dirLight4 = new THREE.DirectionalLight("#ffffff", 0.4)

            dirLight1.position.set(lightDistance, lightDistance, lightDistance)
            dirLight2.position.set(lightDistance, lightDistance, -lightDistance)
            dirLight3.position.set(-lightDistance, lightDistance, lightDistance)
            dirLight4.position.set(-lightDistance, lightDistance, -lightDistance)

            scene.add(ambientLight)
            scene.add(dirLight1)
            // scene.add(dirLight2)
            // scene.add(dirLight3)
            // scene.add(dirLight4)


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
            let water = getWater()
            scene.add(water)

            // Animate character


            let sphere_geometry = new THREE.SphereGeometry(5, 32, 32)
            let sphere_material = new THREE.MeshPhongMaterial({color: new THREE.Color(0.9, 0.55, 0.8)})
            let sphere = new THREE.Mesh(sphere_geometry, sphere_material)
            scene.add(sphere)
            // sphere.position.y = 100

            let raycaster = new THREE.Raycaster()
            // raycaster.set(sphere.position, new THREE.Vector3(0, -1, 0))

            // var intersects = raycaster.intersectObject(terrain)
            // console.log(intersects)
            // sphere.position.y = intersects[0].point.y + 1.5

            
            // let wireframe = new THREE.WireframeGeometry(geometry)
            // let line = new THREE.LineSegments(wireframe)
            // line.rotation.x = -Math.PI / 2
            // line.position.y = -0
            // line.material.color.setHex(0x000000)
            // scene.add(line)

            // camera
            camera = new THREE.PerspectiveCamera(55, container.clientWidth / container.clientHeight, 2, 2500)
            camera.position.set(0, 0, 100)
            camera.rotation.x = -Math.PI / 20

            // Animate models
            animateModels(
                models.filter(model => model.modelName === 'xtc-x')[0], 
                document,
                camera
            )

            // Set terrain 
            let terrain = models.filter(model => model.modelName === 'terrain-x')[0]
            // terrain.modelData.scene.position.y = 1

           

            



            function animate( time ) {
                
                // // sphere.position.y -= 0.2
                // raycaster.set(
                //     sphere.position, 
                //     new THREE.Vector3(0, -1, 0)
                // )

                // peak +=1

                // // console.log(terrain)

                // if(terrain){
                //     console.log(terrain)
                //     let intersects = raycaster.intersectObject(terrain)
                //     console.log(intersects[0])
                // }
                
                // sphere.position.y = intersects[0].point.y + 3 //radius of sphere

                // Animation mixer update - START
                let delta = clock.getDelta()
                if (mixer != null) {
                    mixer.update(delta)
                }
                // Animation mixer update - END

                // controls.update()
                renderer.render( scene, camera )
                requestAnimationFrame( animate )
            }

            requestAnimationFrame( animate )

        })
    }


    const dynamicallyImportPackage = async () => {
        let allMods = {}

        // Importing trackball controls and GLTFLoader
        await Promise.all([
            import('three/examples/jsm/controls/TrackballControls'),
            import('three/examples/jsm/loaders/GLTFLoader.js'),
            import('three/examples/jsm/loaders/DRACOLoader.js')
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
                onKeyDown={(e) => {
                    console.log("e.key")
                }}
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
                onMouseMove={(e) => {
                    // console.log(e.screenX, e.screenY)
                }}
                >
            </div>
            
        </div>
    )
}

export default WorldBuild