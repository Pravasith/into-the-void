import * as THREE from 'three'

export const attachTextures = (model, gui, texture, panOptions) => {

    const { showGui, u, v, zoom, flipY, textureRotation, animateU, animateV } = panOptions
    let mesh = model

    let newMaterial = mesh.material.clone()
    texture.wrapS = THREE.RepeatWrapping
    texture.wrapT = THREE.RepeatWrapping


    var controls = new function() {
        this.u = u
        this.v = v
        this.repeat = zoom
    }

    if(showGui){
        gui.add(controls, 'u', 0, 1)
        gui.add(controls, 'v', 0, 1)
        gui.add(controls, 'repeat', 0, 10)
    }

    texture.offset.set(u, v)
    texture.repeat.set(zoom, zoom)
    texture.flipY = flipY
    texture.rotation = textureRotation

    newMaterial.map = texture
    mesh.material = newMaterial

    let uCount = 0, vCount = 0


    function animate(time) {
        let matUV = mesh.material.map
        matUV.offset.set(controls.u, controls.v)
        matUV.repeat.set(controls.repeat, controls.repeat)

        if(animateU || animateV || showGui){
            if(animateU){
                uCount -= 0.001
                matUV.offset.set(uCount, controls.v)
            }

            if(animateV){
                vCount -= 0.001
                matUV.offset.set(controls.u, vCount)
            }

            requestAnimationFrame(animate)
        }
        
    }

    animate()

    
    
}
