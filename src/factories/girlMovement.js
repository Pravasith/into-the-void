
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

            let girl = models['currentCharacter'].scene,
                terrain = models['terrain'].scene

            let dirLight1 = new THREE.DirectionalLight("#ffffff", 0.05)
            dirLight1.castShadow = true;
            dirLight1.position.set(100, 100, 100)


            dirLight1.position.copy(camera.position)


            scene.add(dirLight1)


            girl.traverse(o => {
                if (o.isMesh) {
                    o.castShadow = true;
                    o.receiveShadow = true;
                }
            })

            terrain.traverse(o => {
                if (o.isMesh) {
                    o.castShadow = true
                    o.receiveShadow = true
                }
            })

            

            const scale = 1
            terrain.scale.set(scale, scale, scale)

            let terrainMesh = terrain.children.filter(item => item.name === "terrain")[0]
            terrainMesh.material.side = THREE.FrontSide

            // let terrainMesh = terrain

            
            terrainMesh.receiveShadow = true

            let dummyAnchorToGirl = new THREE.Object3D() // Acts as a parent to anything which follows the girl


            // anchor.position.set(0, 1000, 0)
            anchor.rotation.order = "YXZ"


            dummyAnchorToGirl.position.set(0, 0, 0)
            scene.add(dummyAnchorToGirl)

            // Initital position and rotation of anchor
            anchor.position.set(-16, 1.65, -23.15)
            anchor.rotation.y = -2.48

            girl.scale.set(0.125, 0.125, 0.125)

            // Initial positions

            // anchor.rotation.y = 0.73
            // anchor.rotation.x = 0.29
            // girl.position.y = -1
            girl.position.set(
                anchor.position.x,
                // anchor.position.y - 1.51,
                anchor.position.y - 1.5,
                anchor.position.z
            )

            // x: 10.065508009029148
            // y: 1.6
            // z: 130.59010396014648


            // if(terrainMesh.children.length !== 0) terrainMesh.children.map(mesh => mesh.material.side = THREE.FrontSide)
            // else terrainMesh.material.side = THREE.FrontSide


            // console.log(terrain.position)

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
                positionStep = 0.15,
                axis = new THREE.Vector3(0, 1, 0),
                directionVector,
                intersectingMesh,
                anchorTerrainIntersection

            let girlToTerrainRaycaster1 = new THREE.Raycaster(),
                girlToTerrainRaycaster2 = new THREE.Raycaster(),
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



            // console.log(terrain)

            let terrainMesh = terrain
            // .children.filter(item => item.name === "terrain")[0]

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

            if(boundary){
                const boundaryIntersection = girlRaycaster2.intersectObject(boundary)

                if(boundaryIntersection.length > 0){
                    
                    if(boundaryIntersection[0].distance >= 0.4) positionStep = 0.15
                    else positionStep = 0
                } // UNCOMMENT - DONOT DELETE
            }
            

            

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
                    // console.log("CLOCKWISE")
                    this.turnMultiplier--
                }
                else if(this.fullRotCount.curr - this.fullRotCount.prev < 0){
                    this.turnMultiplier++
                    // console.log("ANTI-CLOCKWISE")
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

                // console.log(anchor.position)
                
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
            girlToTerrainRaycaster1.set(anchor.position, rayDirection)
            girlToTerrainRaycaster2.set(anchor.position, rayDirection)


            const setAnchorYPosWRTTerrain = (rayCasters, meshes) => {

                let intersectionPoints = rayCasters.map((item, i) => {
                    let intersectionPoint = item.intersectObject(meshes[i])
                    if(intersectionPoint.length > 0){
                        return intersectionPoint[0].point.y
                    }
                    else return -1
                })

                

                Array.max = (intersectionPoints) => Math.max.apply(Math, intersectionPoints)

                let maximum = Array.max(intersectionPoints)
                anchor.position.y = maximum  + 1.47
                // if(rayMeshIntersection[0]){
                //     // console.log(rayMeshIntersection)
                //     // Sets anchor's y position relative to Terrain topology (height)
                //     anchor.position.y = rayMeshIntersection[0].point.y  + 1.5
                // }
            }

            let terrainMeshes = []

            terrainMesh.traverse(o => {
                if(o.isMesh){
                    if(o.name === "terrain"){
                        terrainMeshes.push(o)
                    }

                    if(o.name === "terrain2"){
                        terrainMeshes.push(o)
                    }
                }
            })

            

            setAnchorYPosWRTTerrain(
                [
                    girlToTerrainRaycaster1,
                    girlToTerrainRaycaster2
                ],
                terrainMeshes
            )





            // if(terrainMesh.children.length > 0){
                
            //     intersectingMesh = terrainMesh.children.map(mesh => {
            //         if(girlRaycaster.intersectObject(mesh)[0] !== undefined){
            //             return mesh
            //         }
            //     })[0]




            //     // if(intersectingMesh !== undefined){
            //     //     anchorTerrainIntersection = girlRaycaster.intersectObject(intersectingMesh)
        
                    
            //     //     if(anchorTerrainIntersection[0]){
            //     //         // Sets anchor's y position relative to Terrain topology (height)
            //     //         anchor.position.y = anchorTerrainIntersection[0].point.y  + 1.5
            //     //     }
            //     // }
            // }

            // else{
            //     anchorTerrainIntersection = girlRaycaster.intersectObject(terrainMesh)
            //     if(anchorTerrainIntersection[0]){
            //         // Sets anchor's y position relative to Terrain topology (height)
            //         anchor.position.y = anchorTerrainIntersection[0].point.y  + 1.5
            //     }
            // }

            // Links girl's position to anchor's position
            girl.position.set(
                anchor.position.x,
                // anchor.position.y - 1.51,
                anchor.position.y - 1.5,
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