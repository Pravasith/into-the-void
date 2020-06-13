import * as THREE from 'three'

const displace = (target_Obj, displacement_Mag, direction_V) => {

    let initialPos_V = new THREE.Vector3(
        target_Obj.position.x,
        target_Obj.position.y,
        target_Obj.position.z
    )

    // hello ignoramus

    // Convert direction vector to unit vector
    direction_V.normalize()

    // Scalar multiply by displacement_Mag
    direction_V.multiplyScalar(displacement_Mag)

    let finalPos_V = new THREE.Vector3( 0, 0, 0 ).addVectors(
        initialPos_V, direction_V
    )

    target_Obj.position.x = finalPos_V.x
    target_Obj.position.y = finalPos_V.y
    target_Obj.position.z = finalPos_V.z

    return {
        initialPos_V,
        finalPos_V,
        magnitude: displacement_Mag
    }
}



// // Use this function inside animate function (where the requestanimationframe function is)
// const applyVelocity = (directionVector, magnitude, targetObject, t, trail) => {

//     const magnitudeOfDirectionVector = Math.sqrt(
//         Math.pow(directionVector.x, 2)
//             +
//         Math.pow(directionVector.y, 2)
//             +
//         Math.pow(directionVector.z, 2)
//     )

    
//     targetObject.position.x += magnitude * (directionVector.x / magnitudeOfDirectionVector)
//     targetObject.position.y += magnitude * (directionVector.y / magnitudeOfDirectionVector)
//     targetObject.position.z += magnitude * (directionVector.z / magnitudeOfDirectionVector)

//     // TRAIL // // TRAIL // // TRAIL // // TRAIL // // TRAIL // 
//     // TRAIL // // TRAIL // // TRAIL // // TRAIL // // TRAIL // 
//     if(trail){
//         let dotGeometry = new THREE.Geometry()
//         dotGeometry.vertices.push(new THREE.Vector3(
//             targetObject.position.x,
//             targetObject.position.y,
//             targetObject.position.z
//         ))
//         let dotMaterial = new THREE.PointsMaterial({ 
//             size: 1, 
//             sizeAttenuation: false,
//             color: trail.color ?  trail.color : targetObject.material.color
//         })
//         let dot = new THREE.Points( dotGeometry, dotMaterial )
//         trail.scene.add( dot )
//     }
    
//     // TRAIL // // TRAIL // // TRAIL // // TRAIL // // TRAIL // 
//     // TRAIL // // TRAIL // // TRAIL // // TRAIL // // TRAIL // 

//     const result = {
//         currentPosOfTarget : new THREE.Vector3(
//             targetObject.position.x,
//             targetObject.position.y,
//             targetObject.position.z,
//         ),
//         timeElapsed : t,
//         timeElapsedInSecs : t ? t / (t%60) : "Please provide arg:t in this function",
//         directionVector
//     }

//     return result
// }



export { displace }