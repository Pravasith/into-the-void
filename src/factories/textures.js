import * as THREE from 'three'

export const attachTextures = (model, gui, textureURL) => {
    let loader = new THREE.TextureLoader()

    
    let mesh = model
    // let welcomeMesh = terrain.children.filter(mesh => mesh.name === "holder")[0]

    console.log(model)

    let newMaterial = mesh.material.clone()
    let tex = loader.load(textureURL, (texture) => {

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
        mesh.material = newMaterial


        // console.log(welcomeMesh)

        function animate(time) {

            let matUV = mesh.material.map
            matUV.offset.set(controls.u, controls.v)
            requestAnimationFrame(animate)
        }

        animate()

    })
    
    
}