import * as THREE from 'three'
import { noise } from '../../factories/waterNoise'

export const getWater = (Water) => {


    let textureLoader = new THREE.TextureLoader()

    var params = {
        color: '#45edff',
        scale: 1,
        flowX: 0,
        flowY: 0
    };


    // water
    let waterGeometry = new THREE.PlaneGeometry(1000, 1000, 100, 100);

    // let flowMap = textureLoader.load('https://threejs.org/examples/textures/water/Water_1_M_Flow.jpg');
	let water = new Water(waterGeometry, {
		color: params.color,
        scale: params.scale,
        flowDirection: new THREE.Vector2( params.flowX, params.flowY ),
		textureWidth: 1024,
        textureHeight: 1024,
        // side: THREE.DoubleSide,
		// flowMap: flowMap,
		normalMap0: textureLoader.load('https://threejs.org/examples/textures/water/Water_1_M_Normal.jpg'),
		normalMap1: textureLoader.load('https://threejs.org/examples/textures/water/Water_2_M_Normal.jpg')
	} )


    water.rotation.x = -Math.PI / 2
    water.position.y = -0.16
    water.updateMatrixWorld(true)

    return water
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