import * as THREE from 'three'


// Add masses to your scenes
const addMass = (scene, positionVector, mass, color) => {
    // material and geometry
    let geometryS1 = new THREE.SphereGeometry( mass, 6, 5, 0, 6.3, 0, 3.1 )
    let materialS1 = new THREE.MeshToonMaterial({
        color: color
    })
    let sphere = new THREE.Mesh( geometryS1, materialS1 )

    sphere.position.x = positionVector.x
    sphere.position.y = positionVector.y
    sphere.position.z = positionVector.z

    // >>>>>>> MAIN_PART >>>>
    scene.add( sphere )

    return sphere
}

const removeMass = (scene, objectToRemove) => {
    scene.remove(objectToRemove)
}

export { addMass, removeMass }