import React, { useState, useEffect } from 'react'
import { TweenMax } from 'gsap'
import * as THREE from 'three'

import { addMass, removeMass } from '../factories/massObjects'
import { applyVelocity, applyAcceleration } from '../factories/physics'

import createAxes from '../factories/axes'

import "../assets/solar_system.scss"


const SolarSystem = () => {

    const [ velocity, setVelocity ] = useState(0)
    
    useEffect(() => {

        let parent, renderer, scene, camera, controls

        // Dynamic module importer
        dynamicallyImportPackage()
        .then((module) => {
            // BASIC SETTINGS /////////////////////////////////////////

            // renderer
            const container = document.getElementsByClassName("display-screen")[0]

            
            renderer = new THREE.WebGLRenderer()
            renderer.setSize( container.clientWidth, container.clientHeight )
            renderer.setClearColor( "#1f1f1f") // Background color
            container.appendChild( renderer.domElement )

            // scene
            scene = new THREE.Scene()

            // camera
            camera = new THREE.PerspectiveCamera( 40, container.clientWidth / container.clientHeight, 1, 200 )
            camera.position.set( 50, 50, 50 )

            // controls
            // Trackball controls imported dynamically because it can only be imported in useEffect
            controls = new module.TrackballControls(camera, container)
            controls.minDistance = 5
            controls.maxDistance = 100
            // controls.enableDamping = true; // an animation loop is required when either damping or auto-rotation are enabled
            // controls.dampingFactor = 0.05;

            // axes
            // scene.add(new THREE.AxisHelper( 20 ))

            // Lights
            const light1 = new THREE.AmbientLight(0xFFFFFF, 0.5),
                light2 = new THREE.DirectionalLight(0xFFFFFF)

            light2.position.set(1, 1, 1)

            scene.add(light1)
            scene.add(light2)

            // createAxes( scene, maxRange, incDecStepSize )
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

            let a = new THREE.Vector3( 5, 2, 6 )
            let b = new THREE.Vector3( -15, -15, -15 )

            let sphere1 = addMass(scene, a, 0.5, "#29abe2")
            let sphere2 = addMass(scene, b, 1.5, "#ff6652")

            // removeMass(scene, sphere1)

            // parent
            parent = new THREE.Object3D()
            scene.add( parent )

            // a - b is the distance vector (like r in GMm/r^2 = g), 
            // negating to revese direction
            let aMinusB = new THREE.Vector3( 0, 0, 0 ).subVectors(a, b).negate(),
                bMinusA = new THREE.Vector3( 0, 0, 0 ).subVectors(b, a).negate()

            // TweenMax.to(sphere1.position, 2, {
            //     y: -15,
            //     repeat: -1
            // })
            // TweenMax.to(sphere2.position, 30, {y: 15})

            let t = 0, 
                t_s = 0, 
                v1, 
                v2,
                velocityMagnitude = 0.001


            function animate() {
                requestAnimationFrame( animate )
                // sphere2.position.x += 0.01
                

                // add velocity (directionVector, displacement magnitude, targetObject, t (optional), trailObject (optional))
                v1 = applyVelocity( 
                    aMinusB, velocityMagnitude, sphere1, t, 
                    {
                        // color: "#fff",
                        scene
                    }
                )

                    velocityMagnitude+=velocityMagnitude / 60
                    setVelocity(velocityMagnitude)

                // if(t % 60 === 0 || t % 60 >= 60 ){
                //     console.log(t % 60)
                    
                // }
                    

                t++

                controls.update()
                renderer.render( scene, camera )

            }        
            
           
            
            console.log()

            animate()
            
        })
    }
    ,[])

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
                <p>{velocity}</p>
            </div>
            <div className="display-screen"></div>
        </div>
    )
}

export default SolarSystem