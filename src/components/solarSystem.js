import React, { useState, useEffect, useContext } from 'react'
import * as THREE from 'three'

import { addMass, removeMass } from '../factories/massObjects'
import { applyVelocity, displace, applyAcceleration } from '../factories/physics'

import createAxes from '../factories/axes'

import "../assets/scss/solar_system.scss"
import { PhysicsContext } from '../utils/contexts/physicsContexts'
import { GridIcon, AddObjIcon, ObjRelatedIcon, RemoveObjIcon } from '../assets/images'
import { SideBarButton, colors } from './UIComponents'
import { totesRandoInt, totesRando } from '../factories/math/usefulFuncs'


const SolarSystem = () => {

    const [ velocity, setVelocity ] = useState(0)
    const { addVelocityStats, dispatch } = useContext(PhysicsContext)
    const [ addObj, setAddObj ] = useState([])
    const [ scene, setScene ] = useState(null)

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
            camera = new THREE.PerspectiveCamera(40, container.clientWidth / container.clientHeight, 1, 200)
            camera.position.set(50, 50, 50)

            // controls
            // Trackball controls imported dynamically because it can only be imported in useEffect
            controls = new module.TrackballControls(camera, container)
            controls.minDistance = 5
            controls.maxDistance = 100
            // controls.enableDamping = true; // an animation loop is required when either damping or auto-rotation are enabled
            // controls.dampingFactor = 0.05;

            // axes
            scene.add(new THREE.AxesHelper(20))

            // Lights
            const light1 = new THREE.AmbientLight(0xFFFFFF, 0.5),
                light2 = new THREE.DirectionalLight(0xFFFFFF)

            light2.position.set(1, 1, 1)

            scene.add(light1)
            scene.add(light2)

            // createAxes( scene, maxRange, incDecStepSize, colors )
            createAxes(
                scene, 
                15, 
                5, 
                {
                    x : "#333333",
                    y : "#333333",
                    z : "#333333",
                }
            )

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

    useEffect(() => {
        if(addObj.length !== 0){
            
        }
    }
    ,[addObj])

    let dynamicallyImportPackage = async () => {
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

                                    let sphereObj = {},
                                        c = addObj.length + 1,
                                        rando = totesRandoInt(0, colors.length - 1),
                                        color = colors[ rando ]
                                    
                                        console.log(color, colors.indexOf(color), rando)

                                    sphereObj["massObj_" + c] = addMass(
                                        scene,
                                        new THREE.Vector3(
                                            totesRando( -15, 15 ),
                                            totesRando( -15, 15 ),
                                            totesRando( -15, 15 )
                                        ),
                                        totesRando(0.1, 1.5),
                                        color
                                    )

                                        setAddObj(addObj.concat(sphereObj))
                                }} 
                                >
                                <AddObjIcon />
                            </div>

                            <div 
                                className="sub-option"
                                onClick= {() => {
                                    const [ m1, m2 ] = addObj

                                    // console.log(massObj1, massObj2)

                                    applyAcceleration(
                                        m1.massObj_1,
                                        0.001,
                                        new THREE.Vector3(1, 2, 3),
                                        dispatch,
                                        0.002,
                                        new THREE.Vector3(-1, -2, -3),
                                        {
                                            scene
                                        }

                                    )
                                }}
                                >
                                <RemoveObjIcon />
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