import React, { useState, useEffect, useContext } from 'react'
import * as THREE from 'three'

import { addMass, removeMass } from '../factories/massObjects'
import { applyVelocity, displace, applyAcceleration } from '../factories/physics'

import createAxes from '../factories/axes'

import "../assets/scss/solar_system.scss"
import { PhysicsContext } from '../utils/contexts/physicsContexts'
import { GridIcon, AddObjIcon, ObjRelatedIcon, RemoveObjIcon } from '../assets/images'
import { colors } from './UIComponents'
import { totesRandoInt, totesRando } from '../factories/math/usefulFuncs'
import { addSkyBoxes } from './env'

import { noise } from '../factories/geoPhysics.js'

console.log(noise)


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
            renderer.setPixelRatio( window.devicePixelRatio )
            renderer.setSize(container.clientWidth, container.clientHeight)
            renderer.setClearColor(0x000000, 0) // Background color
            container.appendChild(renderer.domElement)

            // scene
            scene = new THREE.Scene()

            setScene(scene)

            // camera
            camera = new THREE.PerspectiveCamera(55, container.clientWidth / container.clientHeight, 2, 2500)
            camera.position.set(0, 0, 100)

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
            addSkyBoxes(scene)


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
            //         x : "purple",
            //         y : "purple",
            //         z : "purple",
            //     }
            // )

            let a = new THREE.Vector3( 15, 15, -15 )
            let b = new THREE.Vector3( 15, -15, 15 )
            let ap = new THREE.Vector3( 15, 15, 15 ) //

            let sphereX = addMass(scene, ap, 0.15, "#cacaca") //
            let sphere1 = addMass(scene, a, 0.15, "#29abe2")
            let sphere2 = addMass(scene, b, 0.5, "#ff6652")

            let apMinusA = new THREE.Vector3( 0, 0, 0 ).subVectors(ap, a),
                bMinusAp = new THREE.Vector3( 0, 0, 0 ).subVectors(b, ap)


            // apMinusA.multiplyScalar(2)

            // parent
            parent = new THREE.Object3D()
            scene.add( parent )




            // Add plane geometry
            let geometry = new THREE.PlaneGeometry(100, 100, 200, 200)
            let mapImage = "https://xi-upload.s3.amazonaws.com/app-pics/threejs/maps/planet-x-map.jpg"

            let material = new THREE.MeshPhongMaterial({ 
                color: "#29abe2", 
                specular: "#FFFFFF", 
                side: THREE.DoubleSide,  
                shading: THREE.FlatShading, 
                shininess: 3
            })

            let terrain = new THREE.Mesh( geometry, material )
            terrain.rotation.x = -Math.PI / 2
            terrain.position.y = -50
            // terrain.position.z = -2

            terrain.updateMatrixWorld(true)
            scene.add( terrain )

            let peak = 20,
                vertices = terrain.geometry.vertices,
                c = 0,
                smoothing = 50

            while(c < vertices.length){
                let point = vertices[c]
                point.z = peak * noise.perlin3(
                    point.x / smoothing,
                    point.y / smoothing,
                    point.z / smoothing
                )
                c++
            }

            terrain.geometry.verticesNeedUpdate = true
            terrain.geometry.normalsNeedUpdate = true
            

            let sphere_geometry = new THREE.SphereGeometry(3, 32, 32)
            let sphere_material = new THREE.MeshPhongMaterial({color: new THREE.Color(0.9, 0.55, 0.8)})
            let sphere = new THREE.Mesh(sphere_geometry, sphere_material)
            scene.add(sphere)
            sphere.position.y = 100

            let raycaster = new THREE.Raycaster()
            // raycaster.set(sphere.position, new THREE.Vector3(0, -1, 0))

            // var intersects = raycaster.intersectObject(terrain)
            // console.log(intersects)
            // sphere.position.y = intersects[0].point.y + 1.5

            let mtlLoader = new module.MTLLoader()

            mtlLoader.load(
                'https://xi-upload.s3.amazonaws.com/app-pics/threejs/models/blenderMonster.mtl',
                (mtls) => {
                    mtls.preload()

                    let objLoader = new module.OBJLoader()
                    objLoader.setMaterials(mtls)

                    objLoader.load(
                        'https://xi-upload.s3.amazonaws.com/app-pics/threejs/models/blenderMonster.obj',
                        (obj) => {
                            scene.add(obj)
                            // obj.rotation.x = Math.PI * 0.5
                        }

                    )
                }

            )

            

            

            // let wireframe = new THREE.WireframeGeometry(geometry)
            // let line = new THREE.LineSegments(wireframe)
            // line.rotation.x = -Math.PI / 2
            // line.position.y = -0
            // line.material.color.setHex(0x000000)
            // scene.add(line)

            // a - b is the distance vector (like r in GMm/r^2 = g), 
            let bMinusA = new THREE.Vector3( 0, 0, 0 ).subVectors(b, a),
                aMinusB = new THREE.Vector3( 0, 0, 0 ).subVectors(a, b)

            // applyVelocity(sphere2, 0.05, aMinusB, dispatch)
            // applyAcceleration(sphereX, 0.0005, bMinusA, dispatch, 0.123, bMinusAp, {scene})
            // applyAcceleration(sphere2, 0.0005, bMinusA, dispatch, 0.123, apMinusA, {scene})
            // applyAcceleration(sphere1, 0.0005, bMinusAp, dispatch, 0.05, apMinusA, {scene})

            function animate( time ) {

                sphere.position.z += 0.5
                raycaster.set(sphere.position, new THREE.Vector3(0, -1, 0))
                let intersects = raycaster.intersectObject(terrain)
                // sphere.position.y = intersects[0].point.y + 3 //radius of sphere

                controls.update()
                renderer.render( scene, camera )
                requestAnimationFrame( animate )
            }

            requestAnimationFrame( animate )
            
        })
    }
    ,[])



    const dynamicallyImportPackage = async () => {

        let allMods = {}

        // Importing trackball controls and OBJLoader
        await Promise.all([
            import('three/examples/jsm/controls/TrackballControls'),
            import('three/examples/jsm/loaders/OBJLoader.js'),
            import('three/examples/jsm/loaders/MTLLoader.js')
        ])
        .then(modules => {
            modules.map((item, i) => {
                allMods = {
                    ...allMods,
                    ...item
                }
            })
        })

        
        // return await import('three/examples/jsm/controls/TrackballControls')
        // .then(module => module)
        .catch(e => console.log(e))

        return allMods
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