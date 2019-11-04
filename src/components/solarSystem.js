import React, { useState, useEffect } from 'react'
import * as THREE from 'three'

// import importModuleDynamically from '../lib/moduleImports'
import createAxes from '../factories/axes'

import "../assets/solar_system.scss"


const SolarSystem = () => {
    let parent, renderer, scene, camera, controls

    useEffect(() => {

        // Dynamic module importer
        dynamicallyImportPackage()
        .then((module) => {
            // BASIC SETTINGS /////////////////////////////////////////

            // renderer
            renderer = new THREE.WebGLRenderer()
            renderer.setSize( window.innerWidth, window.innerHeight )
            renderer.setClearColor( "#1f1f1f") // Background color

            const container = document.body
            container.appendChild( renderer.domElement )

            // scene
            scene = new THREE.Scene()

            // camera
            camera = new THREE.PerspectiveCamera( 40, window.innerWidth / window.innerHeight, 1, 200 )
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

            // createAxes(THREE, scene, maxRange, incDecStepSize)
            createAxes(THREE, scene, 5, 2.5) 

            // material and geometry
            let geometry = new THREE.SphereGeometry( 0.5, 6, 5, 0, 6.3, 0, 3.1 )
            let material = new THREE.MeshToonMaterial({
                color: "#29abe2"
            })
            let sphere = new THREE.Mesh( geometry, material )
            

            // parent
            parent = new THREE.Object3D()
            scene.add( parent )
            scene.add( sphere )

            function animate() {
                requestAnimationFrame( animate )
                // sphere.rotation.z += 0.05
                controls.update()
                renderer.render( scene, camera )
            }

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

    return <div></div>
}

export default SolarSystem