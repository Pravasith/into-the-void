import * as THREE from 'three'

export const attachTextures = (scene, models, gui) => {
    let loader = new THREE.TextureLoader()

    // Terrain
    let terrain = models["tinker-4"].scene
    let welcomeMesh = terrain.children.filter(mesh => mesh.name === "holder")[0]

    let newMaterial = welcomeMesh.material.clone()
    let texture = loader.load("https://xi-upload.s3.amazonaws.com/app-pics/threejs/maps/welcome.jpg")
    texture.wrapS = THREE.RepeatWrapping
    texture.wrapT = THREE.RepeatWrapping

    var controls = new function() {
        this.u = 0.876
        this.v = 0.735
    }

    gui.add(controls, 'u', 0, 1)
    gui.add(controls, 'v', 0, 1)


    texture.repeat.set( 4.5, 4.5 );

    texture.flipY = false
    texture.rotation = Math.PI / 2
    // texture.offset.set(0.876, 0.735)
    newMaterial.map = texture
    welcomeMesh.material = newMaterial


    // console.log(welcomeMesh)

    function animate(time) {

        let matUV = welcomeMesh.material.map
        matUV.offset.set(controls.u, controls.v)
        requestAnimationFrame(animate)
    }

    animate()
    
}