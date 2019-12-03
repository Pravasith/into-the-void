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


const SolarSystem = () => {

    const [ terrain, setTerrain ] = useState(null)
    const [ newObj, setNewObj ] = useState([])
    const [ scene, setScene ] = useState(null)

    const { addVelocityStats, dispatch } = useContext(PhysicsContext)

    useEffect(() => {

        let parent, renderer, scene, camera, controls

        // Dynamic module importer
        dynamicallyImportPackage()
        .then(async (module) => {
            // BASIC SETTINGS /////////////////////////////////////////
            
            // renderer
            const container = document.getElementsByClassName("display-screen")[0]
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

            // camera
            camera = new THREE.PerspectiveCamera(55, container.clientWidth / container.clientHeight, 2, 2500)
            camera.position.set(0, 0, 100)

            // controls
            // Trackball controls imported dynamically because it can only be imported in useEffect
            controls = new module.TrackballControls(camera, container)
            controls.minDistance = 1
            controls.maxDistance = 1000
            controls.enableDamping = false; // an animation loop is required when either damping or auto-rotation are enabled

            // axes
            // scene.add(new THREE.AxesHelper(20))

            // TEXTURE SKYBOX - FOR WORLD ENV
            addSkyBoxes(scene)

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

            let terrainX = new THREE.Mesh( geometry, material )
            terrainX.rotation.x = -Math.PI / 2
            terrainX.position.y = -50
            // terrain.position.z = -2

            terrainX.updateMatrixWorld(true)
            // scene.add( terrainX )

            let peak = 20,
                vertices = terrainX.geometry.vertices,
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

            terrainX.geometry.verticesNeedUpdate = true
            terrainX.geometry.normalsNeedUpdate = true
            

            let sphere_geometry = new THREE.SphereGeometry(0.5, 32, 32)
            let sphere_material = new THREE.MeshPhongMaterial({color: new THREE.Color(0.9, 0.55, 0.8)})
            let sphere = new THREE.Mesh(sphere_geometry, sphere_material)
            scene.add(sphere)
            sphere.position.y = 100

            let raycaster = new THREE.Raycaster()
            // raycaster.set(sphere.position, new THREE.Vector3(0, -1, 0))

            // var intersects = raycaster.intersectObject(terrain)
            // console.log(intersects)
            // sphere.position.y = intersects[0].point.y + 1.5

            const gltfLoader = new module.GLTFLoader()
            const url = 'https://xi-upload.s3.amazonaws.com/app-pics/threejs/models/move-x.gltf'

            // Optional: Provide a DRACOLoader instance to decode compressed mesh data
            let dracoLoader = new module.DRACOLoader()
            dracoLoader.setDecoderPath( 'https://xi-upload.s3.amazonaws.com/app-pics/threejs/draco/' )
            gltfLoader.setDRACOLoader( dracoLoader )

            gltfLoader.load(url, (gltf) => {
                const root = gltf.scene
                console.log(gltf)
                const scale = 1
                scene.add(root)
                console.log(root)
                root.scale.set(
                    scale, 
                    scale, 
                    scale
                )
                root.rotation.y = 90
                // root.position.z = 10

                const color = "#FFF"  // white
                const near = 10
                const far = 500
                scene.fog = new THREE.Fog(color, near, far)

                setTerrain(root)
                applyVelocity(sphere, 0.3, new THREE.Vector3(0, -1, 0), dispatch, raycaster, root)
            })

            // let wireframe = new THREE.WireframeGeometry(geometry)
            // let line = new THREE.LineSegments(wireframe)
            // line.rotation.x = -Math.PI / 2
            // line.position.y = -0
            // line.material.color.setHex(0x000000)
            // scene.add(line)



            function animate( time ) {
                
                // // sphere.position.y -= 0.2
                // raycaster.set(
                //     sphere.position, 
                //     new THREE.Vector3(0, -1, 0)
                // )

                // // console.log(terrain)

                // if(terrain){
                //     console.log(terrain)
                //     let intersects = raycaster.intersectObject(terrain)
                //     console.log(intersects[0])
                // }
                
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
                className="display-screen"
                onMouseMove={(e) => {
                    // console.log(e.screenX, e.screenY)
                }}
                >
            </div>
        </div>
    )
}

export default SolarSystem