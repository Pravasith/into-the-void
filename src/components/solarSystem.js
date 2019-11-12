import React, { useState, useEffect, useContext } from 'react'
import * as THREE from 'three'

import { addMass, removeMass } from '../factories/massObjects'
import { applyVelocity, displace, applyAcceleration } from '../factories/physics'

import createAxes from '../factories/axes'

import "../assets/scss/solar_system.scss"
import { PhysicsContext } from '../utils/contexts/physicsContexts'
import { GridIcon, AddObjIcon, ObjRelatedIcon, RemoveObjIcon } from '../assets/images'
import { SideBarButton, colors, textureImages } from './UIComponents'
import { totesRandoInt, totesRando } from '../factories/math/usefulFuncs'
import { BackSide } from 'three'


const SolarSystem = () => {

    const [ velocity, setVelocity ] = useState(0)
    const [ newObj, setNewObj ] = useState([])
    const [ scene, setScene ] = useState(null)

    const { addVelocityStats, dispatch } = useContext(PhysicsContext)

    useEffect(() => {

        let parent, renderer, scene, camera, controls

        // Dynamic module importer
        dynamicallyImportPackage()
        .then((module) => {
            // BASIC SETTINGS /////////////////////////////////////////

            // renderer
            const container = document.getElementsByClassName("display-screen")[0]

            renderer = new THREE.WebGLRenderer({
                antialias: false,
                alpha:true
            })
            renderer.setSize(container.clientWidth, container.clientHeight)
            renderer.setClearColor(0x000000, 0) // Background color
            container.appendChild(renderer.domElement)

            // scene
            scene = new THREE.Scene()

            setScene(scene)

            // camera
            camera = new THREE.PerspectiveCamera(55, container.clientWidth / container.clientHeight, 2, 20000)
            camera.position.set(-250, 500, -250)

            // controls
            // Trackball controls imported dynamically because it can only be imported in useEffect
            controls = new module.TrackballControls(camera, container)
            controls.minDistance = 1
            controls.maxDistance = 1000
            controls.enableDamping = false; // an animation loop is required when either damping or auto-rotation are enabled
            // controls.dampingFactor = 0.05;

            // axes
            scene.add(new THREE.AxesHelper(20))

            // TEXTURE SKYBOX - FOR WORLD ENV
            const loader = new THREE.TextureLoader()
            let materials = []

            textureImages.map((item, i) => {
                loader.load(
                    "https://xi-upload.s3.amazonaws.com/app-pics/threejs/space-background-pravasith-2U.png",
                     (texture) => {
                    materials.push(
                        new THREE.MeshBasicMaterial({
                            map: texture,
                            side: BackSide,
                            // alphaMap: texture
                            alphaTest: 0.5
                        })
                    )
                    // Add skybox to scene
                    
                    addSkyBox(materials, scene)
                })
            })

            // Lights
            const light1 = new THREE.AmbientLight(0xFFFFFF, 0.5),
                light2 = new THREE.DirectionalLight(0xFFFFFF)

            light2.position.set(1, 1, 1)

            scene.add(light1)
            scene.add(light2)

            // createAxes( scene, maxRange, incDecStepSize, colors )
            // createAxes(
            //     scene, 
            //     15, 
            //     5, 
            //     {
            //         x : "#333333",
            //         y : "#333333",
            //         z : "#333333",
            //     }
            // )

            let a = new THREE.Vector3( 15, 15, -15 )
            let b = new THREE.Vector3( 15, -15, 15 )
            let ap = new THREE.Vector3( 15, 15, 15 ) //

            // let sphereX = addMass(scene, ap, 0.15, "#cacaca") //
            // let sphere1 = addMass(scene, a, 0.15, "#29abe2")
            // let sphere2 = addMass(scene, b, 0.5, "#ff6652")

            let apMinusA = new THREE.Vector3( 0, 0, 0 ).subVectors(ap, a),
                bMinusAp = new THREE.Vector3( 0, 0, 0 ).subVectors(b, ap)


            // apMinusA.multiplyScalar(2)

            // parent
            parent = new THREE.Object3D()
            scene.add( parent )

            // a - b is the distance vector (like r in GMm/r^2 = g), 
            let bMinusA = new THREE.Vector3( 0, 0, 0 ).subVectors(b, a),
                aMinusB = new THREE.Vector3( 0, 0, 0 ).subVectors(a, b)

            // applyVelocity(sphere2, 0.05, aMinusB, dispatch)
            // applyAcceleration(sphereX, 0.0005, bMinusA, dispatch, 0.123, bMinusAp, {scene})
            // applyAcceleration(sphere2, 0.0005, bMinusA, dispatch, 0.123, apMinusA, {scene})
            // applyAcceleration(sphere1, 0.0005, bMinusAp, dispatch, 0.05, apMinusA, {scene})

            function animate( time ) {
                controls.update()
                renderer.render( scene, camera )
                requestAnimationFrame( animate )
            }

            requestAnimationFrame( animate )
            
        })
    }
    ,[])

    const addSkyBox = (materials, scene) => {
        const skyBoxGeo = new THREE.BoxGeometry(1800, 1800, 1800)
        const skybox = new THREE.Mesh(skyBoxGeo, materials)

        scene.add(skybox)
    }

    const dynamicallyImportPackage = async () => {
        // Importing trackball controls
        return await import('three/examples/jsm/controls/TrackballControls')
        .then(module => module)
        .catch(e => console.log(e))
    }

    return (
        <div
            className = "parent-class"
            >
            <div className="tools-holster">
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
                                        totesRando(0.1, 0.5),
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
                                    
                                }}
                                >
                                <RemoveObjIcon />
                                {/* <img src="https://xi-upload.s3.amazonaws.com/3dprinted.jpg" alt=""/> */}
                            </div>
                        </div>
                    </div>
                </div>

            </div>
            <div className="display-screen"></div>
        </div>
    )
}

export default SolarSystem