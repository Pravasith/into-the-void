import * as THREE from "three"
import gsap from "gsap"

export const addLights = scene => {
    function createPointlight(color, intensity) {
        let light = new THREE.PointLight(color, intensity, 50)
        return light
    }

    // Lights
    const lightDistance = 5
    const ambientLight = new THREE.AmbientLight("#ffffff", 0.8),
        dirLight = new THREE.DirectionalLight("#ffffff", 0.2)

    dirLight.position.set(lightDistance + 20, lightDistance + 20, lightDistance)

    // spotLight.target.position.x = 6
    // spotLight.target.position.y = 0
    // spotLight.target.position.z = 12

    scene.add(ambientLight)
    scene.add(dirLight)
    // scene.add(lightHelperS)

    dirLight.castShadow = true

    dirLight.shadow.mapSize.width = 2048
    dirLight.shadow.mapSize.height = 2048

    var d = 35

    dirLight.shadow.camera.left = -d
    dirLight.shadow.camera.right = d
    dirLight.shadow.camera.top = d
    dirLight.shadow.camera.bottom = -d

    dirLight.shadow.camera.far = 3500
    dirLight.shadow.bias = -0.00005

    let dirLightHeper = new THREE.DirectionalLightHelper(dirLight, 10)
    // scene.add( dirLightHeper )

    let light1 = createPointlight("green", 2)

    scene.add(
        light1
        // light2,
        // light3
    )

    let sinCount = 0
    gsap.ticker.add(() => {
        light1.position.y = Math.sin(sinCount)
        sinCount += 0.01
    })
}
