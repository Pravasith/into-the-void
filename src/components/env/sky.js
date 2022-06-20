import * as THREE from "three"

export const addSkyBoxes = skyTexture => {
    let spaceMap,
        skyOpacity = 1

    let materialOptions = {
        map: skyTexture,
        side: THREE.BackSide,
        // alphaMap: texture,
        // alphaTest: 0.5,
        transparent: true,
        fog: false,
        opacity: skyOpacity,
        alphaTest: 0,
    }

    spaceMap = new THREE.MeshBasicMaterial(materialOptions)

    const spaceSkyboxGeo = new THREE.BoxGeometry(1000, 1000, 1000)
    const spaceSkybox = new THREE.Mesh(spaceSkyboxGeo, spaceMap)

    return spaceSkybox
}
