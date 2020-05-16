
import { TweenMax } from 'gsap'
import * as THREE from 'three'
import { displace } from './physics'


export const movements = {
    init : null, // this function initiates a few steps before animating the girl's movements
    globalVars : null, // this just stores some values from init function to pass them on to animateMovements
    animateMovements : null, // this is the function which does the moving stuff - should be looped in a reqAnimFrame()
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
                terrain = models['coronaDraco'].scene

            let dirLight1 = new THREE.DirectionalLight("#ffffff", 0.5)
            dirLight1.castShadow = true;
            dirLight1.position.set(100, 100, 100)


            dirLight1.position.copy(camera.position)


            scene.add(dirLight1)
            // shadows
            girl.children.map(mesh => {
                // mesh.castShadow = true
                mesh.children.map(item => {
                    if(item.type !== 'Bone') item.castShadow = true
                })
            })


            


            terrain.position.set(0, -0.85, 0)

            let terrainMesh = terrain.children.filter(item => item.name === "terrain")[0]
            // let terrainMesh = terrain.children[0]

            // let terrainMesh = terrain

            
            terrainMesh.receiveShadow = true

            let dummyAnchorToGirl = new THREE.Object3D() // Acts as a parent to anything which follows the girl


            anchor.position.set(0, 1000, 0)
            anchor.rotation.order = "YXZ"


            dummyAnchorToGirl.position.set(0, 0, 0)
            scene.add(dummyAnchorToGirl)

            // Initital position and rotation of anchor
            // anchor.position.set(-1.7433705819587333, 1.4001339569573819, -0.4527981524080006)
            // anchor.rotation.set(0.10999999999999673, -0.4940000000000117, 6.282978218408773e-17)

            girl.scale.set(0.125, 0.125, 0.125)

            // Initial positions
            anchor.position.set(17, 1.6, 138)

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
                terrainMesh,
                dirLight1
            }
        }

        this.animateMovements = (keys, prevCurrKey) => {

            let timestep = 0.12, // Time step between animations
                positionStep = 0.25,
                axis = new THREE.Vector3(0, 1, 0),
                directionVector,
                intersectingMesh,
                anchorTerrainIntersection

            let girlRaycaster = new THREE.Raycaster(),
                rayDirection = new THREE.Vector3(0, -1, 0)

            const pi = Math.PI

            const {
                camera,
                anchor,
                girl,
                dummyAnchorToGirl,
                terrainMesh,
                dirLight1
            } =  this.globalVars




            directionVector = camera.getWorldDirection( new THREE.Vector3() )
            // animstate = animationStates
        
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
                
        
                // Girl movements
                TweenMax.to(girl.rotation, timestep, {
                    y : anchor.rotation.y
                })

                console.log(anchor.position)
        
                // Run main character animations (girl)
                
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
                    y : anchor.rotation.y + pi / 2
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
                    y : anchor.rotation.y + pi
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
                    anchor.rotation.y + 3 * pi / 2
                    :
                    anchor.rotation.y + -pi / 2
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

                // console.log(anchorTerrainIntersection)
    
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
