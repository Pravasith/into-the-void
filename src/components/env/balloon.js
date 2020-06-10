
import * as THREE from 'three'

export const moveBalloon = (models) => {
    let balloon = models["terrain"].scene.children.filter(mesh => mesh.name === "balloon")[0],
        crystal =  balloon.children.filter(mesh => mesh.name === "crystal")[0]

    const createPointlight = (color, intensity) => {
        let light = new THREE.PointLight( color, intensity, 50 )
        return light
    }

    crystal.material.emissive = "#29abe2"
    crystal.material.emissiveIntensity = 0.7

    let crystalLight = createPointlight("#29abe2", 5)
    crystal.add(crystalLight)


    //========== the curve points we copied from Blender
    let points = [
        [-15.864727020263672, 20.019498825073242, 1.1991803646087646] ,
        [-10.206042289733887, 20.019498825073242, 1.1991803646087646] ,
        [14.122605323791504, 11.68978500366211, 1.6080012321472168] ,
        [15.293538093566895, 1.4762248992919922, 2.677096128463745] ,
        [-2.2389841079711914, 2.173431396484375, 1.3749806880950928] ,
        [15.88077449798584, -4.203508377075195, 4.208217620849609] ,
        [6.553418159484863, -11.728780746459961, 5.346242904663086] ,
        [-10.45313835144043, -18.094257354736328, 1.665771245956421] ,
        [-15.22360610961914, -7.912998199462891, 3.298128128051758] ,
        [-14.953625679016113, -2.7865638732910156, 7.15889835357666] ,
    ]
    //========== scale the curve to make it as large as you want
    let scale = 1
    //========== Convert the array of points into vertices (in Blender the z axis is UP so we swap the z and y)

    for (let i = 0; i < points.length; i++) {
        let x = points[i][0] * scale
        let y = points[i][1] * scale
        let z = points[i][2] * scale

        points[i] = new THREE.Vector3(x, z, -y)
    }

    //========== Create a path from the points
    let curvePath =  new THREE.CatmullRomCurve3(points)
    let percentage = 0,
        bufferPercent = 0

    function positBalloon() {
        // percentage += 0.00015
        percentage += 0.00015


        let p1 = curvePath.getPointAt((percentage + bufferPercent) % 1)

      
        balloon.position.x = p1.x
        balloon.position.y = p1.y + 0.2
        balloon.position.z = p1.z

        // balloon.lookAt(
        //     new THREE.Vector3(
        //         p2.x, p2.y + 0.2, p2.z
        //     )
        // )
    }

    function animate( time ) {

        positBalloon()

        requestAnimationFrame( animate )
        
    }
    
    animate()

    

}