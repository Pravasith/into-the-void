import React, { useState, useEffect } from 'react'
import * as THREE from 'three'

// import importModuleDynamically from '../lib/moduleImports'

import "../assets/solar_system.scss"


const SolarSystem = () => {
    let parent, renderer, scene, camera, controls

    useEffect(() => {

        // Dynamic module importer from lib
        dynamicallyImportPackage()
        .then((module) => {

            // renderer
            renderer = new THREE.WebGLRenderer()
            renderer.setSize( window.innerWidth, window.innerHeight )

            const container = document.body
            container.appendChild( renderer.domElement )

            // scene
            scene = new THREE.Scene()

            // camera
            camera = new THREE.PerspectiveCamera( 40, window.innerWidth / window.innerHeight, 1, 100 )
            camera.position.set( 20, 20, 20 )

            // geometry
            let geometry = new THREE.SphereGeometry( 2, 8, 6, 0, 6.3, 0, 3.1)

            // material
            let material = new THREE.MeshBasicMaterial({
                wireframe: true,
                wireframeLinewidth: 1
            })

            let sphere = new THREE.Mesh( geometry, material )

            // Dynamic component with No SSR
            // Trackball controls imported dynamically because it can only be imported in useEffect

            // controls
            controls = new module.TrackballControls(camera, container)
            controls.minDistance = 5
            controls.maxDistance = 250
            // controls.enableDamping = true; // an animation loop is required when either damping or auto-rotation are enabled
            // controls.dampingFactor = 0.05;

            // axes
            // scene.add(new THREE.AxisHelper( 20 ))


            // parent
            parent = new THREE.Object3D()
            scene.add( parent )
            scene.add( sphere )

            function animate() {
                requestAnimationFrame( animate )
                parent.rotation.z += 0.01
                controls.update()
                renderer.render( scene, camera )
            }

            animate()
            createAxes()
        })


        
	

    }
    ,[])


    let dynamicallyImportPackage = async () => {
        // let TrackballControls

        return await import('three/examples/jsm/controls/TrackballControls')
        // you can now use the package in here
        .then(module => {
            // TrackballControls = module.TrackballControls
            return module
        })
        .catch(e => console.log(e))

        // return TrackballControls
    }


    const createAxes = () => {

        //create a blue LineBasicMaterial
        let material = new THREE.LineBasicMaterial( { color: "#29ABE2" } )

        let geometry = new THREE.Geometry()
        geometry.vertices.push(new THREE.Vector3( 0, 0, 0) )
        geometry.vertices.push(new THREE.Vector3( 0, 10, 0) )
        geometry.vertices.push(new THREE.Vector3( 10, 0, 0) )

        let line = new THREE.Line( geometry, material )

        scene.add(line)
    }

    return <div></div>
}

export default SolarSystem