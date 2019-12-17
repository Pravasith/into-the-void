
import { TweenMax } from 'gsap'
import { Vector3 } from 'three'
import { displace } from './physics'
import React, { useState } from 'react'

export const animateModels = (presets) => {

    const {
        girl,
        anchor,
        document,
        camera,
        mixer
    } = presets

    let model = girl.modelData.scene
    model.scale.set(0.125, 0.125, 0.125)

    // store the current pressed keys in an array
    let keys = [],
        prevCurrKey = new Array(2).fill(null) // prev, new


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
        // console.log(prevCurrKey)
    }

    
    const characterAction = () => {

        let pi = Math.PI
        let timestep = 0.2 // Time step between animations
        let positionStep = 0.25

        let directionVector = camera.getWorldDirection( new Vector3() )
        let axis = new Vector3(0, 1, 0)


        if(keys[87]){ // W
            displace(anchor, positionStep, new Vector3(
                directionVector.x,
                0, 
                directionVector.z
            ).applyAxisAngle(axis, 0))
            TweenMax.to(model.rotation, timestep, {
                y : 0
            })
        }

        if(keys[65]){ // A
            displace(anchor, positionStep, new Vector3(
                directionVector.x,
                0, 
                directionVector.z
            ).applyAxisAngle(axis, pi / 2))
            // model.position.x -= positionStep
            TweenMax.to(model.rotation, timestep, {
                y : pi / 2
            })
        }

        if(keys[83]){ // S
            displace(anchor, positionStep, new Vector3(
                directionVector.x,
                0, 
                directionVector.z
            ).applyAxisAngle(axis, pi))
            // model.position.z += positionStep
            TweenMax.to(model.rotation, timestep, {
                y : pi
            })
        }

        if(keys[68]){ // D
            displace(anchor, positionStep, new Vector3(
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
            // model.position.x += positionStep
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


