import * as THREE from 'three'
import { noise } from '../../factories/waterNoise'

export const getSimpleWater = (scene) => {
    let geometry = new THREE.PlaneGeometry(260, 260, 100, 100)
    const loader = new THREE.TextureLoader()

    let material = new THREE.MeshBasicMaterial({ 
        color: "#29abe2", 
        // map : texture,
        transparent: true,
        opacity: 0.65
    })

    let water = new THREE.Mesh( geometry, material )
    scene.add(water)

    water.rotation.x = -Math.PI / 2
    water.position.x = 50
    water.position.y = -2
    // terrain.position.z = -2

    water.updateMatrixWorld(true)
    animateWater(water)

    // loader.load(
    //     "https://xi-upload.s3.amazonaws.com/app-pics/threejs/maps/water.jpg",
    //     (texture) => {

            
    //     }
    // )

}


const animateWater = (water) => {

    let vertices = water.geometry.vertices,
        smoothing = 10,
        peak = 0

    function animate( time ) {

        vertices.map((point, i) => {
            point.z = Math.sin(peak) * 1 * noise.perlin3(
                point.x / smoothing,
                point.y / smoothing,
                point.z / smoothing
            )
        })

        peak +=0.05

        if(peak >= 2 * Math.PI) peak = 0

        water.geometry.verticesNeedUpdate = true
        water.geometry.normalsNeedUpdate = true

        requestAnimationFrame( animate )
    }

    requestAnimationFrame( animate )

    
}