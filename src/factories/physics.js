import * as THREE from 'three'

// Use this function inside animate function (where the requestanimationframe function is)
const applyVelocity = ( directionVector, magnitude, targetObject, t, trail ) => {

    const magnitudeOfDirectionVector = Math.sqrt(
        Math.pow(directionVector.x, 2)
            +
        Math.pow(directionVector.y, 2)
            +
        Math.pow(directionVector.z, 2)
    )

    
    targetObject.position.x += magnitude * ( directionVector.x / magnitudeOfDirectionVector )
    targetObject.position.y += magnitude * ( directionVector.y / magnitudeOfDirectionVector )
    targetObject.position.z += magnitude * ( directionVector.z / magnitudeOfDirectionVector )

    // TRAIL // // TRAIL // // TRAIL // // TRAIL // // TRAIL // 
    // TRAIL // // TRAIL // // TRAIL // // TRAIL // // TRAIL // 
    if(trail){
        let dotGeometry = new THREE.Geometry()
        dotGeometry.vertices.push(new THREE.Vector3(
            targetObject.position.x,
            targetObject.position.y,
            targetObject.position.z
        ))
        let dotMaterial = new THREE.PointsMaterial({ 
            size: 1, 
            sizeAttenuation: false,
            color: trail.color ?  trail.color : targetObject.material.color
        })
        let dot = new THREE.Points( dotGeometry, dotMaterial )
        trail.scene.add( dot )
    }
    
    // TRAIL // // TRAIL // // TRAIL // // TRAIL // // TRAIL // 
    // TRAIL // // TRAIL // // TRAIL // // TRAIL // // TRAIL // 

    const result = {
        currentPosOfTarget : new THREE.Vector3(
            targetObject.position.x,
            targetObject.position.y,
            targetObject.position.z,
        ),
        timeElapsedInSecs : t ? t / (t%60) : "Please provide arg:t in this function",
        directionVector,
        // displacement : s 
    }

    return result
}

const applyAcceleration = ( directionVector, magnitude, targetObject ) => {

    applyVelocity( directionVector, magnitude , targetObject ) 
}

export { applyVelocity }