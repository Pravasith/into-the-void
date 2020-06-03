import * as THREE from 'three'

export  const subdivide = (mesh, subdivisions) => {

    let geometry = mesh.geometry
    let modifier = new module.SubdivisionModifier(subdivisions)
    let smoothGeometry = modifier.modify(geometry)

    // convert to THREE.BufferGeometry

    if(mesh.geometry) mesh.geometry.dispose()

    mesh.geometry = new THREE.BufferGeometry().fromGeometry(smoothGeometry)

}