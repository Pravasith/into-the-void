import * as THREE from "three"

export const moveBalloon = models => {
    let balloon = models["terrain"].scene.children.filter(
            mesh => mesh.name === "balloon"
        )[0],
        crystal = balloon.children.filter(mesh => mesh.name === "crystal")[0]

    crystal.material.emissive.set("#29abe2")
    crystal.material.emissiveIntensity = 0.4

    let balloon2 = models["terrain"].scene.children.filter(
            mesh => mesh.name === "balloon2"
        )[0],
        crystal2 = balloon2.children.filter(mesh => mesh.name === "crystal2")[0]

    crystal2.material.emissive.set("#ff0352")
    crystal2.material.emissiveIntensity = 0.6

    const createPointlight = (color, intensity) => {
        let light = new THREE.PointLight(color, intensity, 50)
        return light
    }

    let crystalLight1 = createPointlight("#29abe2", 3),
        crystalLight2 = createPointlight("#fc036f", 2),
        crystalLight3 = createPointlight("#ff0352", 3),
        crystalLight4 = createPointlight("#fc036f", 2)

    crystal.add(crystalLight1)
    crystalLight1.add(crystalLight2)

    crystal2.add(crystalLight3)
    crystalLight3.add(crystalLight4)

    crystalLight1.position.set(-7, 5, -7)
    crystalLight2.position.set(7, 5, 7)

    crystalLight3.position.set(-7, 5, -7)
    crystalLight4.position.set(7, 5, 7)

    //========== the curve points we copied from Blender
    let points = [
        [-16.177091598510742, 0.0, 5.1343302726745605],
        [-16.17402458190918, 22.198022842407227, 3.2173538208007812],
        [-3.9761812686920166, 19.22789764404297, 0.39249324798583984],
        [5.84772253036499, -0.6302300095558167, 4.012020587921143],
        [-6.22534704208374, 6.000491619110107, 0.6463940143585205],
        [15.184127807617188, 12.502253532409668, 0.76607346534729],
        [11.292696952819824, 4.27727746963501, 4.3358154296875],
        [16.177091598510742, -3.1908559799194336, 4.443613529205322],
        [14.567795753479004, -12.365984916687012, 2.504903793334961],
        [2.0003585815429688, -14.892972946166992, 4.213133811950684],
        [0.0, -28.888261795043945, 3.2173538208007812],
        [-11.258038520812988, -16.82697868347168, 0.9233222007751465],
        [-13.971348762512207, -8.181129455566406, 3.901677131652832],
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
    let curvePath = new THREE.CatmullRomCurve3(points)
    let percentage = 0

    function positBalloon(obj, bufferPercent) {
        // percentage += 0.00015
        percentage += 0.00015

        let p1 = curvePath.getPointAt((percentage + bufferPercent) % 1)

        obj.position.x = p1.x
        obj.position.y = p1.y + 2
        obj.position.z = p1.z

        // balloon.lookAt(
        //     new THREE.Vector3(
        //         p2.x, p2.y + 0.2, p2.z
        //     )
        // )
    }

    let c = 0

    const rotateBalloon = (obj, moveUpAndDown) => {
        obj.rotation.y += 0.01

        if (moveUpAndDown) {
            c += 0.01
            obj.position.y = 1 + Math.sin(c) * 0.5
        }
    }

    function animate(time) {
        positBalloon(balloon, 0)

        rotateBalloon(balloon, false)
        rotateBalloon(balloon2, true)

        requestAnimationFrame(animate)
    }

    animate()
}
