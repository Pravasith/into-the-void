import React, { useState, useEffect } from 'react'
import * as THREE from 'three'

// import importModuleDynamically from '../lib/moduleImports'

import "../assets/solar_system.scss"


const SolarSystem = () => {
    let parent, renderer, scene, camera, controls

    useEffect(() => {

        // Dynamic module importer
        dynamicallyImportPackage()
        .then((module) => {

            // renderer
            renderer = new THREE.WebGLRenderer()
            renderer.setSize( window.innerWidth, window.innerHeight )
            renderer.setClearColor( "#fff")

            const container = document.body
            container.appendChild( renderer.domElement )

            // scene
            scene = new THREE.Scene()

            // camera
            camera = new THREE.PerspectiveCamera( 40, window.innerWidth / window.innerHeight, 1, 100 )
            camera.position.set( 50, 50, 50 )

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
            controls.minDistance = 0
            controls.maxDistance = 250
            // controls.enableDamping = true; // an animation loop is required when either damping or auto-rotation are enabled
            // controls.dampingFactor = 0.05;

            // axes
            // scene.add(new THREE.AxisHelper( 20 ))


            // parent
            parent = new THREE.Object3D()
            scene.add( parent )
            // scene.add( sphere )

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
        // Importing trackball controls
        return await import('three/examples/jsm/controls/TrackballControls')
        .then(module => module)
        .catch(e => console.log(e))
    }


    const createAxes = () => {

        let c = 0,
            xColor = "red",
            yColor = "green",
            zColor = "blue",
            reverseC = 0,
            gap = 12,
            incDec = 3

        while(c < gap){

        /////////////////////////////////////////////////////
            // Lines going from y = -10 to y =10
            let yMaterial = new THREE.LineBasicMaterial({ color: yColor })
            let yGeometry = new THREE.Geometry()
            let subCY = 0,
                subCReverseY = 0

            while(subCY < gap){
                yGeometry.vertices.push(new THREE.Vector3(subCY, -10, c ))
                yGeometry.vertices.push(new THREE.Vector3(subCY, 10, c ))
                yGeometry.vertices.push(new THREE.Vector3(subCY, -10, reverseC ))
                yGeometry.vertices.push(new THREE.Vector3(subCY, 10, reverseC ))

                yGeometry.vertices.push(new THREE.Vector3(subCReverseY, -10, c ))
                yGeometry.vertices.push(new THREE.Vector3(subCReverseY, 10, c ))
                yGeometry.vertices.push(new THREE.Vector3(subCReverseY, -10, reverseC ))
                yGeometry.vertices.push(new THREE.Vector3(subCReverseY, 10, reverseC ))

                subCY+=incDec
                subCReverseY-=incDec

                let yLine = new THREE.LineSegments( yGeometry, yMaterial )
                scene.add(yLine)
            }
        /////////////////////////////////////////////////////

        /////////////////////////////////////////////////////
            // Lines going from x = 0 to x =10
            let xMaterial = new THREE.LineBasicMaterial({ color: xColor })
            let xGeometry = new THREE.Geometry()
            let subCX = 0,
                subCReverseX = 0

            while(subCX < gap){
                xGeometry.vertices.push(new THREE.Vector3( subCX, c, -10))
                xGeometry.vertices.push(new THREE.Vector3( subCX, c, 10))
                xGeometry.vertices.push(new THREE.Vector3( subCX, reverseC, -10))
                xGeometry.vertices.push(new THREE.Vector3( subCX, reverseC, 10))
    
                xGeometry.vertices.push(new THREE.Vector3( subCReverseX, c, -10))
                xGeometry.vertices.push(new THREE.Vector3( subCReverseX, c, 10))
                xGeometry.vertices.push(new THREE.Vector3( subCReverseX, reverseC, -10))
                xGeometry.vertices.push(new THREE.Vector3( subCReverseX, reverseC, 10))
    
                subCX+=incDec
                subCReverseX-=incDec

                let xLine = new THREE.LineSegments( xGeometry, xMaterial )
                scene.add(xLine)
            }
        /////////////////////////////////////////////////////
        
        /////////////////////////////////////////////////////
            // Lines going from z = 0 to z =10
            let zMaterial = new THREE.LineBasicMaterial({ color: zColor })
            let zGeometry = new THREE.Geometry()
            let subCZ = 0,
                subCReverseZ = 0

            while(subCZ < gap){
                zGeometry.vertices.push(new THREE.Vector3( -10, subCZ, c))
                zGeometry.vertices.push(new THREE.Vector3( 10, subCZ, c))
                zGeometry.vertices.push(new THREE.Vector3( -10, subCZ, reverseC))
                zGeometry.vertices.push(new THREE.Vector3( 10, subCZ, reverseC))

                zGeometry.vertices.push(new THREE.Vector3( -10, subCReverseZ, c))
                zGeometry.vertices.push(new THREE.Vector3( 10, subCReverseZ, c))
                zGeometry.vertices.push(new THREE.Vector3( -10, subCReverseZ, reverseC))
                zGeometry.vertices.push(new THREE.Vector3( 10, subCReverseZ, reverseC))

                subCZ+=incDec
                subCReverseZ-=incDec

                let zLine = new THREE.LineSegments( zGeometry, zMaterial )
                scene.add(zLine)
            } 
        /////////////////////////////////////////////////////

            c+=incDec
            reverseC-=incDec
        }

        

        let material2 = new THREE.LineBasicMaterial({
            color: "#FFFFFF",
            linewidth: 10
        })
        let geometry2 = new THREE.Geometry()

        geometry2.vertices.push(new THREE.Vector3( 0, 0, 10 ))
        geometry2.vertices.push(new THREE.Vector3( 0, 0, -10 ))

        // geometry2.vertices.push(new THREE.Vector3( 0, 1, 10 ))
        // geometry2.vertices.push(new THREE.Vector3( 0, 1, -10 ))

        let linew = new THREE.Line( geometry2, material2 )
        scene.add(linew)


        
    }

    return <div></div>
}

export default SolarSystem