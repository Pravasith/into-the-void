import { PlaneGeometry, MeshBasicMaterial, Mesh } from 'three'
import { noise } from '../../factories/waterNoise'

export const getWater = () => {
    let geometry = new PlaneGeometry(260, 260, 100, 100)

    let material = new MeshBasicMaterial({ 
        color: "#29abe2", 
        transparent: true,
        opacity: 0.65
    })

    let water = new Mesh( geometry, material )
    water.rotation.x = -Math.PI / 2
    water.position.x = 50
    water.position.y = -2
    // terrain.position.z = -2

    water.updateMatrixWorld(true)
    animateWater(water)

    return water
}

const animateWater = (water) => {

    let vertices = water.geometry.vertices,
        smoothing = 10,
        peak = 0

    

    function animate( time ) {

        vertices.map((point, i) => {
            point.z = Math.sin(peak) * 2 * noise.perlin3(
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