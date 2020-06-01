import * as THREE from 'three'
import { noise } from '../../factories/waterNoise'

export const getWater = (Water, gui) => {


    let textureLoader = new THREE.TextureLoader()

    var params = {
        color: '#45edff',
        scale: 0.2,
        flowX: 0,
        flowY: 0
    }

    

    // console.log(waterGeo)

    // water
    // let waterGeometry = new THREE.PlaneBufferGeometry( 200, 200 )
    // console.log(waterGeometry, waterScene.children[0].geometry)

    let xTs = new THREE.PlaneBufferGeometry( 10, 20 )

    
    // waterGeometry.index.array  = xTs.index.array
    // waterGeometry.attributes.position.array = xTs.attributes.position.array

    // console.log(xTs.index.array, waterGeometry.index.array)
    // console.log(xTs.attributes.position.array, waterGeometry.attributes.position.array)

    // let flowMap = textureLoader.load('https://threejs.org/examples/textures/water/Water_1_M_Flow.jpg');
	let water = new Water(xTs, {
		color: params.color,
        scale: params.scale,
        flowDirection: new THREE.Vector2( params.flowX, params.flowY ),
		textureWidth: 1024/2,
        textureHeight: 1024/2,
        // side: THREE.DoubleSide,
		// flowMap: flowMap,
		normalMap0: textureLoader.load('https://threejs.org/examples/textures/water/Water_1_M_Normal.jpg'),
		normalMap1: textureLoader.load('https://threejs.org/examples/textures/water/Water_2_M_Normal.jpg')
	} )


    water.rotation.x = - Math.PI /2
    water.rotation.z = 2.4

    water.position.y = -0.3
    water.position.x = 5.3
    water.position.z = -4.4



    // var controls = new function() {
    //     this.x = 5.3
    //     this.z = -4.4
    //     this.y = -0.3

    //     this.rZ = 2.4

    // }

    // gui.add(controls, 'x', -10, 10)
    // gui.add(controls, 'z', -10, 10)
    // gui.add(controls, 'y', -10, 10)
    // gui.add(controls, 'rZ', -Math.PI, Math.PI)




    // function animate(time) {
    //     water.rotation.z = controls.rZ

    //     water.position.x = controls.x
    //     water.position.z = controls.z
    //     water.position.y = controls.y

    //     requestAnimationFrame(animate)
        
    // }

    // animate()












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