import * as THREE from 'three'
import { noise } from '../../factories/waterNoise'

export const getSimpleWobblePlane = (options) => {
    let { aspectRatio, width, widthSections, opacity, perkiness0to10, smoothing0to10, speed0to1 } = options
    const height = width / aspectRatio
    const heightSections = widthSections / aspectRatio

    let geometry = new THREE.PlaneGeometry(width, height, widthSections, heightSections)

    

    let material = new THREE.MeshBasicMaterial({ 
        // color: "#29abe2", 
        // map : texture,
        transparent: true,
        opacity: opacity
    })

    let water = new THREE.Mesh( geometry, material )
    // scene.add(water)

    // water.rotation.x = -Math.PI / 2
    // water.position.x = 50
    // water.position.y = -2
    // terrain.position.z = -2

    water.updateMatrixWorld(true)
    animateWater(water, perkiness0to10, smoothing0to10, speed0to1)

    return water

    // loader.load(
    //     "https://xi-upload.s3.amazonaws.com/app-pics/threejs/maps/water.jpg",
    //     (texture) => {

            
    //     }
    // )

}


const animateWater = (water, perkiness0to10, smoothing0to10, speed0to1) => {

    let vertices = water.geometry.vertices,
        peak = 0,
        count = 0

    function animate( now ) {
        count = now * 0.002

        if(count){
            vertices.map((point, i) => {
                point.z = Math.sin(peak) * perkiness0to10 * noise.perlin3(
                    point.x / smoothing0to10,
                    point.y / smoothing0to10,
                    point.z / smoothing0to10
                )
            })
    
            // peak +=speed0to1
    
            // if(peak >= 2 * Math.PI) peak = 0
    
            peak = Math.sin(count) + Math.cos(count + 1)
    
            water.geometry.verticesNeedUpdate = true
            water.geometry.normalsNeedUpdate = true
        }
        

        requestAnimationFrame( animate )
    }

    animate()

    
}


// import * as THREE from 'three'
// import { noise } from '../../factories/waterNoise'

// export const getSimpleWobblePlane = (options) => {
//     let { width, height, wSecs, hSecs, opacity, perkiness0to10, smoothing0to10, speed0to1 } = options
//     let geometry = new THREE.PlaneGeometry(width, height, wSecs, hSecs)
//     const loader = new THREE.TextureLoader()

//     let material = new THREE.MeshBasicMaterial({ 
//         color: "#29abe2", 
//         // map : texture,
//         transparent: true,
//         opacity: opacity
//     })

//     let water = new THREE.Mesh( geometry, material )
//     // scene.add(water)

//     // water.rotation.x = -Math.PI / 2
//     // water.position.x = 50
//     // water.position.y = -2
//     // terrain.position.z = -2

//     water.updateMatrixWorld(true)
//     animateWater(water, perkiness0to10, smoothing0to10, speed0to1)

//     return water

//     // loader.load(
//     //     "https://xi-upload.s3.amazonaws.com/app-pics/threejs/maps/water.jpg",
//     //     (texture) => {

            
//     //     }
//     // )

// }


// const animateWater = (water, perkiness0to10, smoothing0to10, speed0to1) => {

//     let vertices = water.geometry.vertices,
//         peak = 0
        

//     function animate( time ) {

//         vertices.map((point, i) => {
//             point.z = Math.sin(peak) * perkiness0to10 * noise.perlin3(
//                 point.x / smoothing0to10,
//                 point.y / smoothing0to10,
//                 point.z / smoothing0to10
//             )
//         })

//         peak +=speed0to1

//         if(peak >= 2 * Math.PI) peak = 0

//         water.geometry.verticesNeedUpdate = true
//         water.geometry.normalsNeedUpdate = true

//         requestAnimationFrame( animate )
//     }

//     requestAnimationFrame( animate )

    
// }