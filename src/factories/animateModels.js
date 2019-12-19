
import { TweenMax } from 'gsap'
import * as THREE from 'three'
import { displace } from './physics'
import React, { useState } from 'react'

export const animateModels = (presets) => {

    const {
        girl,
        anchor,
        document,
        camera,
        mixer,
        terrain,
        scene
    } = presets


    


    // anchor.position.y = 2
    const pi = Math.PI
    let dirRot = "c_wise" 

    let model = girl.modelData.scene
    model.scale.set(0.125, 0.125, 0.125)

    console.log(model)

    // store the current pressed keys in an array
    let keys = [],
        prevCurrKey = new Array(2).fill(null), // prev, new
        prevCurrAngle = new Array(2).fill(null)

    let raycaster = new THREE.Raycaster()


    // if the pressed key is 87 (w) then keys[87] will be true
    // keys [87] will remain true untill the key is released (below)
    // the same is true for any other key, we can now detect multiple
    // keypresses
    document.onkeydown = function (e) {
        keys[e.keyCode] = true
        
        // Stores the prev key in [0] and current key in [1]
        if(prevCurrKey[1] !== e.keyCode){
            prevCurrKey[0] = prevCurrKey[1]
            prevCurrKey[1] = e.keyCode
        }
    }

    document.onkeyup = function (e) {
        delete keys[e.keyCode]
    }


    
    const characterAction = () => {

        let timestep = 0 // Time step between animations
        let positionStep = 0.25

        let directionVector = camera.getWorldDirection( new THREE.Vector3() )
        let axis = new THREE.Vector3(0, 1, 0) 



        // let modelPos = new THREE.Vector3(
        //     model.position.x,
        //     model.position.y,
        //     model.position.z
        // )

        // let camPos = new THREE.Vector3(
        //     camera.position.x,
        //     camera.position.y,
        //     camera.position.z
        // )


        // let dV = new Vector3(0, 0, 0).subVectors(camPos, modelPos)



        anchor.rotation.order = "YXZ"



        if(keys[87]){ // W

            // Anchor movements
            displace(anchor, positionStep, new THREE.Vector3(
                directionVector.x,
                0,
                directionVector.z
            ).applyAxisAngle(axis, 0))
            

            // if(prevCurrAngle[1] > 0 && prevCurrAngle[0] < 0){
            //     console.log("signs flipped")
            // }

            // Girl movements
            TweenMax.to(model.rotation, timestep, {
                y : anchor.rotation.y             
            })
            
        }

        if(keys[65]){ // A

            // Anchor movements
            displace(anchor, positionStep, new THREE.Vector3(
                directionVector.x,
                0, 
                directionVector.z
            ).applyAxisAngle(axis, pi / 2))

            // Girl movements
            TweenMax.to(model.rotation, timestep, {
                y : pi / 2
            })
        }

        if(keys[83]){ // S


            // Anchor movements
            displace(anchor, positionStep, new THREE.Vector3(
                directionVector.x,
                0, 
                directionVector.z
            ).applyAxisAngle(axis, pi))

            // Girl movements
            TweenMax.to(model.rotation, timestep, {
                y : pi
            })
        }

        if(keys[68]){ // D


            // Anchor movements
            displace(anchor, positionStep, new THREE.Vector3(
                directionVector.x,
                0, 
                directionVector.z
            ).applyAxisAngle(
                axis, 
                (prevCurrKey[0] === 83 && prevCurrKey[1] === 68) || (prevCurrKey[0] === 68 && prevCurrKey[1] === 83)
                // Above line checks if buttons pressed are s and d or vice versa, for rotation to happen properly
                ?
                3 * pi / 2
                :
                -pi / 2
            ))

            // Girl movements
            TweenMax.to(model.rotation, timestep, {
                y 
                : 
                (prevCurrKey[0] === 83 && prevCurrKey[1] === 68) || (prevCurrKey[0] === 68 && prevCurrKey[1] === 83)
                // Above line checks if buttons pressed are s and d or vice versa, for rotation to happen properly
                ?
                3 * pi / 2
                :
                -pi / 2
            })
        }


        // Terrain
        let terrainModel = terrain.modelData.scene.children[0]
        raycaster.set(anchor.position, new THREE.Vector3(
            0,
            -1,
            0
        ))



        let intersects = raycaster.intersectObject(terrainModel)

        if(intersects[0]){
            anchor.position.y = intersects[0].point.y  + 1.5
        }
        // if(intersects[0]){}
        

        // Links girl's position to anchor's position
        model.position.set(
            anchor.position.x,
            anchor.position.y - 1.5,
            anchor.position.z
        )

    }

    const updateLooper = () => {
        function animate( time ) {
            // do updating/repeating things here
            characterAction()
            requestAnimationFrame( animate )
        }
    
        requestAnimationFrame( animate )
        characterAction()
    }

    updateLooper()
}


