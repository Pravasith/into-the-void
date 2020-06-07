import * as THREE from 'three'

export const addFishes = (models, clock, scene) => {
    let fish1 = models["fish"],
        fish2 = models["fish2"]

    // fish.scene.rotation.x = Math.PI / 2
    let mixer1 = new THREE.AnimationMixer(fish1.scene),
        mixer2 = new THREE.AnimationMixer(fish2.scene)

    let fishAction1 = mixer1.clipAction(fish1.animations[0]),
        fishAction2 = mixer2.clipAction(fish2.animations[0])

    fishAction1.play()
    fishAction2.play()


    const assignEmissiveColors = (fish, color) => {
        fish.scene.traverse(o => {
            if(o.isMesh){
    
                // o.rotation.z = -Math.PI / 2
    
                if(o.name === "glowGroups"){
                    // console.log(o)
                    o.material.emissive.set(color)
                    o.material.emissiveIntensity = 1
                }
    
                else {
                    // console.log(o)
                    o.material.emissive.set(color)
                    o.material.emissiveIntensity = 0.3
                }
            }
        })    
    }

    assignEmissiveColors(fish1, "green")
    assignEmissiveColors(fish2, "red")


    
    

    //========== the curve points we copied from Blender
    let points = [
        [7.840808391571045, 9.138572692871094, -8.588556289672852] ,
        [6.315013408660889, 7.250797271728516, -7.08076810836792] ,
        [7.314347743988037, 7.250797271728516, -1.2246267795562744] ,
        [9.20889949798584, 6.597029685974121, -0.46953025460243225] ,
        [7.662227153778076, 4.196202278137207, -0.6078819036483765] ,
        [6.314749240875244, 2.29794979095459, -0.6078819036483765] ,
        [3.8813302516937256, 1.475649356842041, -0.6078819036483765] ,
        [2.733250617980957, -0.6978874206542969, -0.6078819036483765] ,
        [2.376345157623291, 0.5043058395385742, -0.6078819036483765] ,
        [4.383208274841309, 3.273730754852295, -0.6078819036483765] ,
        [4.795004844665527, 5.409926414489746, -0.6078819036483765] ,
        [4.795004844665527, 6.861509323120117, -0.6078819036483765] ,
        [6.215703964233398, 9.224193572998047, -0.6078819036483765] ,
        [6.709859848022461, 6.228372573852539, -0.6078819036483765] ,
        [4.795004844665527, 7.417436122894287, -0.6078819036483765] ,
        [6.037710189819336, 8.58271598815918, -0.6078819036483765] ,
        [7.095919609069824, 7.448321342468262, -1.3969635963439941] ,
        [6.040226936340332, 6.881688594818115, -2.204130172729492] ,
        [6.114058017730713, 7.227829456329346, -8.208955764770508] ,
        [4.223977565765381, 4.821332931518555, -7.856879711151123] ,
        
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
    let radius = 0.05

    //========== Create a tube geometry that represents our curve
    let geometry = new THREE.TubeGeometry( curvePath, 600, radius, 10, true )
    //========== Set a different color for each face of the tube. (a triangle represents 1 face in WebGL)

    for(let i=0, j=geometry.faces.length; i<j; i++){
        geometry.faces[i].color = new THREE.Color("hsl("+Math.floor(Math.random()*290)+",50%,50%)")
    }


    //========== add tube to the scene
    let material = new THREE.MeshBasicMaterial({
        vertexColors : THREE.FaceColors, 
        side: THREE.DoubleSide, 
        transparent:true, 
        opacity: 1
    })

    let tube = new THREE.Mesh( geometry, material )
    // scene.add( tube )



    
    let percent1 = 0,
        percent2 = 50


    let greenFishMesh = fish1.scene.children.filter((group, i) => {
            return group.name === "GreenFishAnim"
        })[0],
        redFishMesh = fish2.scene.children.filter((group, i) => {
            return group.name === "RedFishAnim"
        })[0]

    const createPointlight = (color, intensity) => {
        let light = new THREE.PointLight( color, intensity, 50 )
        return light

    }

    let light1 = createPointlight("green", 2),
        light2 = createPointlight("red", 2)

        greenFishMesh.add(light1)
        redFishMesh.add(light2)

    const moveFish = (fishMesh, bufferPercent, fish1Or2) => {

        let percentage

        if(fish1Or2 === 1){
            percentage = percent1
            percentage += 0.00015 
            percent1 = percentage
        }

        else if(fish1Or2 === 2){
            percentage = percent2
            percentage += 0.00015 
            percent2 = percentage
        }        
        

        let p1 = curvePath.getPointAt((percentage + bufferPercent) % 1)
        let p2 = curvePath.getPointAt((percentage + bufferPercent + 0.01) % 1)

      
        fishMesh.position.x = p1.x
        fishMesh.position.y = p1.y + 0.2
        fishMesh.position.z = p1.z

        fishMesh.lookAt(
            new THREE.Vector3(
                p2.x, p2.y + 0.2, p2.z
            )
        )
    }

    
    
    function animate( time ) {
    
        // Animation mixer update - START
        let delta
        delta = clock.getDelta()
    
        // console.log("XX")
        // Animation mixer update - END
    
        moveFish(greenFishMesh, 0, 1)
        moveFish(redFishMesh, 0.5, 2)


        mixer1.update(delta)
        mixer2.update(delta)

        requestAnimationFrame( animate )
        
    }
    
    animate()
}
            
