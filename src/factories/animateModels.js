
import { TweenMax } from 'gsap'
import { Vector3 } from 'three'
import { displace } from './physics'
import React, { useState } from 'react'

export const animateModels = (character, document, camera, mixer) => {

    let model = character.modelData.scene
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
        // let tl = new TimelineLite()
        let timestep = 0.2 // Time step between animations
        let positionStep = 0.25



        // if(keys[87]){ // W
        //     displace(model, positionStep, new Vector3(0, 0, -1))
        //     // model.position.z -= positionStep
        //     TweenMax.to(model.rotation, timestep, {
        //         y : 0
        //     })
        // }

        // if(keys[65]){ // A
        //     displace(model, positionStep, new Vector3(-1, 0, 0))
        //     // model.position.x -= positionStep
        //     TweenMax.to(model.rotation, timestep, {
        //         y : pi / 2
        //     })
        // }

        // if(keys[83]){ // S
        //     displace(model, positionStep, new Vector3(0, 0, 1))
        //     // model.position.z += positionStep
        //     TweenMax.to(model.rotation, timestep, {
        //         y : pi
        //     })
        // }

        // if(keys[68]){ // D
        //     displace(model, positionStep, new Vector3(1, 0, 0))
        //     // model.position.x += positionStep
        //     TweenMax.to(model.rotation, timestep, {
        //         y 
        //         : 
        //         (prevCurrKey[0] === 83 && prevCurrKey[1] === 68) || (prevCurrKey[0] === 68 && prevCurrKey[1] === 83)
        //         // Above line checks if buttons pressed are s and d or vice versa, for rotation to happen properly
        //         ?
        //         3 * pi / 2
        //         :
        //         -pi / 2
        //     })
        // }

        
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

const animateGirl = (girl, camera, movingDirection) => {

    let theGirl =  girl.modelData.scene
    const { slope } = movingDirection
    const timestep = 0.1

    // console.log(slope)

    if(movingDirection.upOrDown === "up"){
        TweenMax.to(camera.rotation, timestep, {
            x : camera.rotation.x + 0.1 * slope
        })
    }

    if(movingDirection.upOrDown === "down"){
        TweenMax.to(camera.rotation, timestep, {
            x : camera.rotation.x - 0.1 * slope
        })
    }

    if(movingDirection.leftOrRight === "left"){
        TweenMax.to(theGirl.rotation, timestep, {
            y : theGirl.rotation.y + 0.1 * slope
        })
    }

    if(movingDirection.leftOrRight === "right"){
        TweenMax.to(theGirl.rotation, timestep, {
            y : theGirl.rotation.y - 0.1 * slope
        })
    }
    // console.log(theGirl)
}

export const handleMouse = (e, canvasWrapper, stateVars, girl, camera) => {

    // The stateVars arg connects state to our function here
    const {
        leftOrRight,
        setLeftOrRight,
        upOrDown,
        setUpOrDown,
        counter,
        setCounter
    } = stateVars

    let x = e.screenX, 
        y = e.screenY,
        movingDirection = {}

    const thisContainer = canvasWrapper.current
    const width = thisContainer.clientWidth,
        height =  thisContainer.clientHeight

    let dArrayLR = [...leftOrRight], // stores 5 points (mouse hovered on pixels)
        dArrayUD = [...upOrDown] // stores 5 points (mouse hovered on pixels)


    let c = counter

    if( !(dArrayLR[dArrayLR.length - 1] && dArrayUD[dArrayUD.length - 1]) ){
        dArrayLR[c] = x
        dArrayUD[c] = y
    }

    c++

    if(c > dArrayLR.length - 1){
        dArrayLR = dArrayLR.reduce((all, item, i) => {
            if(i < dArrayLR.length - 1) all[i] = dArrayLR[i + 1]
            else all[i] = x

            return all
        }, [])

        dArrayUD = dArrayUD.reduce((all, item, i) => {
            if(i < dArrayUD.length - 1) all[i] = dArrayUD[i + 1]
            else all[i] = y

            return all
        }, [])
        // dArrayLR.shift()[dArrayLR.length - 1] = x
        // dArrayUD.shift()[dArrayUD.length - 1] = y

        c = 0
    }

    
    setCounter(c)

    // if(dArrayLR[1] !== x){
    //     dArrayLR[0] = dArrayLR[1]
    //     dArrayLR[1] = x
    // }

    // if(dArrayUD[1] !== y){
    //     dArrayUD[0] = dArrayUD[1]
    //     dArrayUD[1] = y
    // }

    setLeftOrRight([
        ...dArrayLR
    ])

    setUpOrDown([
        ...dArrayUD
    ])

    // I need to get the slope of the line made by those two points so that I can use it to rotate 
    // the view 
    // precisely according to users' mouse movements, so YO! 
    // I feel brilliant! XD
    let x1 = dArrayLR[0], // Old x co-ordinate
        x2 = dArrayLR[dArrayLR.length - 1], // New x co-ordinate
        y1 = dArrayUD[0], // Old y co-ordinate
        y2 = dArrayUD[dArrayLR.length - 1], // New y co-ordinate
        slope = (y2 - y1) / (x2 - x1)

    if(dArrayLR[0] > dArrayLR[1]) movingDirection["leftOrRight"] = "left"
    else movingDirection["leftOrRight"] = "right"

    if(dArrayUD[0] > dArrayUD[1]) movingDirection["upOrDown"] = "up"
    else movingDirection["upOrDown"] = "down"
    
    movingDirection["slope"] = slope

    console.log(dArrayUD, dArrayLR, slope)

    // console.log(slope)

    animateGirl(girl, camera, movingDirection)

    // console.log(window)


    // if(x >= 0 && x < width) console.log("left")
    // else if(x )
}

