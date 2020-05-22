
import { TweenMax } from 'gsap'
import * as THREE from 'three'
import { displace } from './physics'


export const movements = {
    init : null, // this function initiates a few steps before animating the girl's movements
    globalVars : null, // this just stores some values from init function to pass them on to animateMovements
    animateMovements : null, // this is the function which does the moving stuff - should be looped in a reqAnimFrame()
    fullRotCount : {
        prev : 0,
        curr : 0
    },
    turnMultiplier: 0,
    init_ES6 : function() { // a dummy function to access global 'this'

        // 'this' keyword below is local to init_ES6 function
        // console.log(this) // returns init_ES6 function

        this.init = (presets) => {
            // 'this' keyword below is global to movements object
            // console.log(this) // returns movement object


            const {
                models,
                anchor,
                document,
                camera,
                scene
            } = presets

            let girl = models['animations-clean-x'].scene,
                terrain = models['darkSideTerrain'].scene

            let dirLight1 = new THREE.DirectionalLight("#ffffff", 0.05)
            dirLight1.castShadow = true;
            dirLight1.position.set(100, 100, 100)


            dirLight1.position.copy(camera.position)


            scene.add(dirLight1)
            // shadows
            // girl.children.map(mesh => {
            //     // mesh.castShadow = true
            //     mesh.children.map(item => {
            //         if(item.type !== 'Bone') item.castShadow = true
            //     })
            // })


            // girl.traverse(o => {
            //     if (o.isMesh) {
            //       o.castShadow = true;
            //       o.receiveShadow = true;
            //     }
            // });

            // terrain.traverse(o => {
            //     if (o.isMesh) {
            //       o.castShadow = true;
            //       o.receiveShadow = true;
            //     }
            // });

            


            terrain.position.set(0, -0.85, 0)

            let terrainMesh = terrain.children.filter(item => item.name === "terrain")[0]
            // let terrainMesh = terrain.children[0]

            // let terrainMesh = terrain

            
            terrainMesh.receiveShadow = true

            let dummyAnchorToGirl = new THREE.Object3D() // Acts as a parent to anything which follows the girl


            // anchor.position.set(0, 1000, 0)
            anchor.rotation.order = "YXZ"


            dummyAnchorToGirl.position.set(0, 0, 0)
            scene.add(dummyAnchorToGirl)

            // Initital position and rotation of anchor
            anchor.position.set(40, 1.4001339569573819, 83)
            // anchor.rotation.set(0.10999999999999673, -0.4940000000000117, 6.282978218408773e-17)

            girl.scale.set(0.125, 0.125, 0.125)

            // Initial positions

            // anchor.rotation.y = 0.73
            anchor.rotation.x = 0.29
            girl.position.y = -1

            // x: 10.065508009029148
            // y: 1.6
            // z: 130.59010396014648


            // if(terrainMesh.children.length !== 0) terrainMesh.children.map(mesh => mesh.material.side = THREE.FrontSide)
            // else terrainMesh.material.side = THREE.FrontSide


            // console.log(terrain.position, terrainMesh)

            this.globalVars = {
                camera,
                anchor,
                girl,
                dummyAnchorToGirl,
                terrain,
                dirLight1,
            }
        }

        this.animateMovements = (keys, prevCurrKey) => {

            let 
                // timestep = 0.12, // Time step between animations
                timestep = 0.2,
                positionStep = 0.25,
                axis = new THREE.Vector3(0, 1, 0),
                directionVector,
                intersectingMesh,
                anchorTerrainIntersection

            let girlRaycaster = new THREE.Raycaster(),
                girlRaycaster2 = new THREE.Raycaster(),
                rayDirection = new THREE.Vector3(0, -1, 0)

            const pi = Math.PI

            const {
                camera,
                anchor,
                girl,
                dummyAnchorToGirl,
                terrain,
                dirLight1,
            } =  this.globalVars

            let terrainMesh = terrain.children.filter(item => item.name === "terrain")[0]

            directionVector = camera.getWorldDirection( new THREE.Vector3() )
            // animstate = animationStates

            // TEMP
            let pointerDirectionObj = new THREE.Object3D() 
            girl.add(pointerDirectionObj)
            pointerDirectionObj.position.set(0, 0, -2)

            let frontDirection = new THREE.Vector3()

            pointerDirectionObj.getWorldPosition(frontDirection)
            girlRaycaster2.set(girl.position, frontDirection.sub(girl.position))

            const boundary = terrain.children.filter(item => item.name === "boundary")[0]
            let basicMat = new THREE.MeshBasicMaterial({
                side: THREE.BackSide,
                visible : false
            })

            boundary.material = basicMat

            // boundary.material.transparent = true
            // boundary.material.opacity = 0

            const boundaryIntersection = girlRaycaster2.intersectObject(boundary)

            if(boundaryIntersection.length > 0){
                if(boundaryIntersection[0].distance >= 1) positionStep = 0.25
                else positionStep = 0
            } // UNCOMMENT - DONOT DELETE

            // positionStep = 0

            let anchorRot = anchor.rotation.y,
                rotCount = 0

            let dummyFullRot = {
                ...this.fullRotCount
            }

            if(anchorRot < 0){
                rotCount = pi + pi - Math.abs(anchorRot)
            }

            else {
                rotCount = Math.abs(anchorRot)
            }

            dummyFullRot.prev = dummyFullRot.curr
            dummyFullRot.curr = rotCount

            this.fullRotCount = {
                ...dummyFullRot
            }

            if(Math.abs(this.fullRotCount.curr - this.fullRotCount.prev) >= 6){
                if(this.fullRotCount.curr - this.fullRotCount.prev > 0){
                    console.log("CLOCKWISE")
                    this.turnMultiplier--
                }
                else if(this.fullRotCount.curr - this.fullRotCount.prev < 0){
                    this.turnMultiplier++
                    console.log("ANTI-CLOCKWISE")
                }
            }

            




            if(keys[87]){ // W
        
                // Anchor movements
                displace(anchor, positionStep, new THREE.Vector3(
                    directionVector.x,
                    0,
                    directionVector.z
                )
                .applyAxisAngle(
                    axis, 
                    0
                ))

                // console.log(anchor.rotation.y)
                // Girl movements
                TweenMax.to(girl.rotation, timestep, {
                    // y : anchor.rotation.y
                    y: rotCount + (2 * pi * this.turnMultiplier)
                    
                })
                // Run main character animations (girl)

                // console.log(rotCount)
                
            }

            if(keys[65]){ // A
        
                // Anchor movements
                displace(anchor, positionStep, new THREE.Vector3(
                    directionVector.x,
                    0, 
                    directionVector.z
                ).applyAxisAngle(axis, pi / 2))
        
                // Girl movements
                TweenMax.to(girl.rotation, timestep, {
                    // y : anchor.rotation.y + pi / 2
                    y: rotCount + pi / 2 + (2 * pi * this.turnMultiplier)
                })
            }

            if(keys[83]){ // S
        
                // Anchor movements
                displace(anchor, positionStep, new THREE.Vector3(
                    directionVector.x,
                    0, 
                    directionVector.z
                )
                .applyAxisAngle(axis, pi)
                )
        
                // Girl movements
                TweenMax.to(girl.rotation, timestep, {
                    // y : anchor.rotation.y + pi
                    y: rotCount + pi + (2 * pi * this.turnMultiplier)
                })
            }

            if(keys[68]){ // D
        
                // Anchor movements
                displace(anchor, positionStep, new THREE.Vector3(
                    directionVector.x,
                    0, 
                    directionVector.z
                )
                .applyAxisAngle(
                    axis, 
                    (prevCurrKey[0] === 83 && prevCurrKey[1] === 68) || (prevCurrKey[0] === 68 && prevCurrKey[1] === 83)
                    // Above line checks if buttons pressed are s and d or vice versa, for rotation to happen properly
                    ?
                    3 * pi / 2
                    :
                    -pi / 2
                ))
        
                // Girl movements
                TweenMax.to(girl.rotation, timestep, {
                    y 
                    : 
                    (prevCurrKey[0] === 83 && prevCurrKey[1] === 68) || (prevCurrKey[0] === 68 && prevCurrKey[1] === 83)
                    // Above line checks if buttons pressed are s and d or vice versa, for rotation to happen properly
                    ?
                    // anchor.rotation.y + 3 * pi / 2
                    rotCount + 3 * pi / 2 + (2 * pi * this.turnMultiplier)
                    :
                    // anchor.rotation.y + -pi / 2
                    rotCount + -pi / 2 + (2 * pi * this.turnMultiplier)
                })
            }

            // Terrain raycasting
            girlRaycaster.set(anchor.position, rayDirection)


            if(terrainMesh.children.length > 0){

                // console.log(terrainMesh)

                intersectingMesh = terrainMesh.children.map(mesh => {
                    if(girlRaycaster.intersectObject(mesh)[0] !== undefined){
                        return mesh
                    }
                })[0]


                if(intersectingMesh !== undefined){
                    anchorTerrainIntersection = girlRaycaster.intersectObject(intersectingMesh)
        
                    if(anchorTerrainIntersection[0]){
                        // Sets anchor's y position relative to Terrain topology (height)
                        anchor.position.y = anchorTerrainIntersection[0].point.y  + 1.5
                    }
                }
            }

            else{
                anchorTerrainIntersection = girlRaycaster.intersectObject(terrainMesh)
                if(anchorTerrainIntersection[0]){
                    // Sets anchor's y position relative to Terrain topology (height)
                    anchor.position.y = anchorTerrainIntersection[0].point.y  + 1.5
                }
            }
            

            // Links girl's position to anchor's position
            girl.position.set(
                anchor.position.x,
                anchor.position.y - 1.51,
                anchor.position.z
            )

            dummyAnchorToGirl.position.set(
                anchor.position.x,
                anchor.position.y + 5,
                anchor.position.z
            )

        }
    }
}

movements.init_ES6()




// function animate( time ) {
//     // do updating/repeating things here
    
//     characterAction()
//     requestAnimationFrame( animate )
// }

// animate()



// export const girlMovement = (presets) => {

//     const {
//         models,
//         anchor,
//         document,
//         camera,
//         scene
//     } = presets

//     const pi = Math.PI

//     let girl = models['xtc-x'].scene,
//         terrain = models['terrain-x'].scene

//     let timestep = 0.12, // Time step between animations
//         positionStep = 0.25,
//         axis = new THREE.Vector3(0, 1, 0),
//         directionVector,
//         terrainMesh = terrain.children[0],
//         anchorTerrainIntersection
    
//     // store the current pressed keys in an array
//     let keys = [],
//         prevCurrKey = new Array(2).fill(null) // prev, new

//     let girlRaycaster = new THREE.Raycaster(),
//         dummyAnchorToGirl = new THREE.Object3D(), // Acts as a parent to anything which follows the girl
//         rayDirection = new THREE.Vector3(0, -1, 0)


//     anchor.position.set(-100, 0, 0)
//     anchor.rotation.order = "YXZ"

//     dummyAnchorToGirl.position.set(0, 10, 0)
//     scene.add(dummyAnchorToGirl)

//     girl.scale.set(0.125, 0.125, 0.125)

//     terrainMesh.material.side = THREE.FrontSide



//     // if the pressed key is 87 (w) then keys[87] will be true
//     // keys [87] will remain true untill the key is released (below)
//     // the same is true for any other key, we can now detect multiple
//     // keypresses
//     document.onkeydown = function (e) {
//         keys[e.keyCode] = true
 
//         // Stores the prev key in [0] and current key in [1]
//         if(prevCurrKey[1] !== e.keyCode){
//             prevCurrKey[0] = prevCurrKey[1]
//             prevCurrKey[1] = e.keyCode
//         }
//     }

//     document.onkeyup = function (e) {
//         delete keys[e.keyCode]
//     }

//     const characterAction = () => {

//         directionVector = camera.getWorldDirection( new THREE.Vector3() )
//         // animstate = animationStates

//         if(keys[87]){ // W

//             // Anchor movements
//             displace(anchor, positionStep, new THREE.Vector3(
//                 directionVector.x,
//                 0,
//                 directionVector.z
//             )
//             .applyAxisAngle(
//                 axis, 
//                 0
//             ))
            

//             // Girl movements
//             TweenMax.to(girl.rotation, timestep, {
//                 y : anchor.rotation.y
//             })

//             // Run main character animations (girl)
            
//         }

//         if(keys[65]){ // A

//             // Anchor movements
//             displace(anchor, positionStep, new THREE.Vector3(
//                 directionVector.x,
//                 0, 
//                 directionVector.z
//             ).applyAxisAngle(axis, pi / 2))

//             // Girl movements
//             TweenMax.to(girl.rotation, timestep, {
//                 y : anchor.rotation.y + pi / 2
//             })
//         }

//         if(keys[83]){ // S

//             // Anchor movements
//             displace(anchor, positionStep, new THREE.Vector3(
//                 directionVector.x,
//                 0, 
//                 directionVector.z
//             )
//             .applyAxisAngle(axis, pi)
//             )

//             // Girl movements
//             TweenMax.to(girl.rotation, timestep, {
//                 y : anchor.rotation.y + pi
//             })
//         }

//         if(keys[68]){ // D

//             // Anchor movements
//             displace(anchor, positionStep, new THREE.Vector3(
//                 directionVector.x,
//                 0, 
//                 directionVector.z
//             )
//             .applyAxisAngle(
//                 axis, 
//                 (prevCurrKey[0] === 83 && prevCurrKey[1] === 68) || (prevCurrKey[0] === 68 && prevCurrKey[1] === 83)
//                 // Above line checks if buttons pressed are s and d or vice versa, for rotation to happen properly
//                 ?
//                 3 * pi / 2
//                 :
//                 -pi / 2
//             ))

//             // Girl movements
//             TweenMax.to(girl.rotation, timestep, {
//                 y 
//                 : 
//                 (prevCurrKey[0] === 83 && prevCurrKey[1] === 68) || (prevCurrKey[0] === 68 && prevCurrKey[1] === 83)
//                 // Above line checks if buttons pressed are s and d or vice versa, for rotation to happen properly
//                 ?
//                 anchor.rotation.y + 3 * pi / 2
//                 :
//                 anchor.rotation.y + -pi / 2
//             })
//         }


//         // Terrain raycasting
//         girlRaycaster.set(anchor.position, rayDirection)
//         anchorTerrainIntersection = girlRaycaster.intersectObject(terrainMesh)
        

//         if(anchorTerrainIntersection[0]){
//             // Sets anchor's y position relative to Terrain topology (height)
//             anchor.position.y = anchorTerrainIntersection[0].point.y  + 1.5
//         }
        


//         // Links girl's position to anchor's position
//         girl.position.set(
//             anchor.position.x,
//             anchor.position.y - 1.5,
//             anchor.position.z
//         )

//         dummyAnchorToGirl.position.set(
//             anchor.position.x,
//             anchor.position.y + 5,
//             anchor.position.z
//         )

//     }


//     function animate( time ) {
//         // do updating/repeating things here
        
//         characterAction()
//         requestAnimationFrame( animate )
//     }

//     animate()
// }
