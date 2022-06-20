import React, { useState, useEffect, useContext, useRef } from "react"
import * as THREE from "three"

import Stats from "stats.js"

import createAxes from "../factories/axes"

// import { colors, skyboxGradients, albumSongs, hoardingTextures } from './resources'
// import { totesRandoInt, totesRando } from '../factories/math/usefulFuncs'
import { addSkyBoxes } from "./env/sky"

// import { noise } from '../factories/waterNoise'
import { loadModelsTexturesAndEnvMaps } from "../factories/loadModels"
import { getWater } from "./env/water"
import { movements } from "../factories/girlMovement"
import { sceneAnimations } from "../factories/animations"
import { addFloydElements } from "../factories/floydElements"

import { materialsToSeaShack } from "./assignMaterials"
import { addLights } from "./env/lights"
import { addFishes } from "../factories/animateFish"
import { moveBalloon } from "./env/balloon"
import { LoadingContext } from "../utils/contexts/loadingContexts"

// Components
import LoadingScreen from "./loadingScreen"
import { MainLogoIcon } from "../assets/images"
import SubMenu from "./subMenu"
import Volume from "./volume"
import Twitter from "./twitterLink"
import { albumSongs } from "./resources"
import Controls from "./controls"

const sound = new Howl({
    src: [albumSongs.aviators.flora],
    loop: true,
    volume: 0.5,
})

const WorldBuild = () => {
    const [scene, setScene] = useState(null)
    const [camera, setCamera] = useState(null)

    const [models, setModels] = useState(null)
    const [textures, setTextures] = useState(null)
    const [envTextures, setEnvTextures] = useState(null)

    const [clock, setClock] = useState(null)
    const [renderer, setRenderer] = useState(null)
    const [controls, setControls] = useState(null)
    const [initComplete, setInitComplete] = useState(false)
    const [animationPresets, setAnimationPresets] = useState(null)
    const [gui, setGui] = useState(null)
    const [stats, setStats] = useState(null)

    const { progress, dispatch } = useContext(LoadingContext)

    let keys = {},
        prevCurrKey = [],
        typeOfControls = "pointerLock", // trackBall or pointerLock,
        firstMouseLock = false,
        pause = false

    const canvasWrapper = useRef(null)

    useEffect(() => {
        init()
    }, [])

    useEffect(() => {
        // If init() is finished executing
        if (initComplete) {
            if (animationPresets) {
                if (typeOfControls === "pointerLock") {
                    let menu = document.getElementById("main-menu"),
                        volume = document.getElementById("volume"),
                        controlsPanel = document.getElementById("controls")

                    controls.addEventListener("lock", () => {
                        pause = false
                        if (firstMouseLock) {
                            animate()
                        } else {
                            sound.play()
                            firstMouseLock = true
                            volume.style.display = "block"
                        }

                        menu.style.display = "none"
                        controlsPanel.style.display = "block"
                    })

                    controls.addEventListener("unlock", function () {
                        pause = true
                        menu.style.display = "block"
                        controlsPanel.style.display = "none"
                    })
                }

                // movements initiation -  see girlMovement.js file
                movements.init(animationPresets)

                let girl = animationPresets.models["currentCharacter"],
                    animations =
                        animationPresets.models["currentCharacter"].animations

                sceneAnimations.init(girl, animations)

                animate()
                // pause = true
            }
        }
    }, [initComplete])

    function createStats() {
        var stats = new Stats()
        stats.setMode(0)

        stats.domElement.style.position = "absolute"
        stats.domElement.style.left = "0"
        stats.domElement.style.top = "0"

        return stats
    }

    const init = () => {
        let renderer,
            scene,
            camera,
            controls,
            mixer,
            models,
            textures,
            envTextures,
            clock = new THREE.Clock(),
            peak = 0

        setClock(clock)

        // Dynamic module importer
        dynamicallyImportPackage().then(async module => {
            // BASIC SETTINGS /////////////////////////////////////////

            // renderer
            const container = canvasWrapper.current

            let stats = createStats()
            setStats(stats)
            // document.body.appendChild(stats.domElement)

            renderer = new THREE.WebGLRenderer({
                antialias: true,
                alpha: true,
            })
            // renderer.setPixelRatio( window.devicePixelRatio )
            renderer.setSize(container.clientWidth, container.clientHeight)
            renderer.setClearColor(0x000000, 0) // Background color

            renderer.shadowMap.enabled = true
            // renderer.shadowMap.type = THREE.PCFSoftShadowMap
            // renderer.sortObjects = false

            container.appendChild(renderer.domElement)

            setRenderer(renderer)

            // scene
            scene = new THREE.Scene()
            setScene(scene)

            // Load models like terrain, character, yada yada
            await loadModelsTexturesAndEnvMaps(module, dispatch)
                .then(loadedData => {
                    models = loadedData.models
                    textures = loadedData.textures
                    envTextures = loadedData.envTextures

                    Object.keys(models).forEach(gltf => {
                        const modelData = models[gltf]
                        const model = modelData.scene
                        const scale = 1

                        // Adds terrain, charater
                        scene.add(model)

                        model.scale.set(scale, scale, scale)
                    })
                })
                .catch(e => console.error(e))

            setModels(models)
            setTextures(textures)
            setEnvTextures(envTextures)

            // GUI
            let gui = new module.GUI()
            setGui(gui)

            // TOGGLE GUI
            gui.destroy()

            // let stats = new module.Stats
            // setStats(stats)

            // console.log(module)
            // Add fog
            scene.fog = new THREE.Fog(
                "#000",
                30, // near value
                200 // far value
            )

            // TEXTURE SKYBOX - FOR WORLD ENV
            const sky = addSkyBoxes(textures.skyTexture)
            scene.add(sky)

            // Add floyd - static elements
            addFloydElements(models, scene, gui, textures, envTextures)

            // Assign materials and adds WATER too
            materialsToSeaShack(models, scene, gui, textures, envTextures)

            // Add lights
            addLights(scene)

            // createAxes( scene, maxRange, incDecStepSize, colors )
            // createAxes(
            //     scene,
            //     15,
            //     5,
            //     {
            //         x : "purple",
            //         y : "purple",
            //         z : "purple",
            //     }
            // )

            // Add water
            // const { Water } = module

            // // waterPlaneScene.children[0].material.side = THREE.FrontSide
            // const water = getWater(Water, gui)
            // scene.add(water)

            // Anchor for 3D orbit movements (mouse)
            let anchor = new THREE.Object3D()
            anchor.position.y = 10
            anchor.scale.set(0.125, 0.125, 0.125)
            scene.add(anchor)

            const limitAnchorInRAF = () => {
                function animate(time) {
                    // console.log(
                    //     anchor.rotation.x,
                    //     anchor.rotation.y,
                    //     anchor.rotation.z
                    // )

                    if (anchor.rotation.x > 0.12) anchor.rotation.x = 0.12

                    requestAnimationFrame(animate)
                }

                animate()
            }

            limitAnchorInRAF()

            // camera
            camera = new THREE.PerspectiveCamera(
                55,
                container.clientWidth / container.clientHeight,
                10,
                10000
            )
            camera.position.set(0, (2.5 / 2) * 5.5 - 7, 2.5 * 10)
            camera.rotation.x = -Math.PI / 20

            // sets camera to the state
            setCamera(camera)

            // Add fishes
            addFishes(models, clock, scene)

            window.addEventListener("resize", onWindowResize, false)

            function onWindowResize() {
                camera.aspect = window.innerWidth / window.innerHeight
                camera.updateProjectionMatrix()

                renderer.setSize(window.innerWidth, window.innerHeight)
            }

            // controls
            if (typeOfControls === "pointerLock") {
                // Pointer lock controls imported dynamically because it can only be imported in useEffect
                anchor.add(camera) // Parents camera to Anchor
                controls = new module.PointerLockControls(anchor, container)

                scene.add(controls.getObject())
            } else if (typeOfControls === "trackBall") {
                // Trackball controls imported dynamically because it can only be imported in useEffect
                controls = new module.TrackballControls(camera, container)
                controls.minDistance = 1
                controls.maxDistance = 1000
                controls.enableDamping = false // an animation loop is required when either damping or auto-rotation are enabled
            }

            // Add controls to state
            setControls(controls)

            const animPresets = {
                models,
                anchor,
                document,
                camera,
                scene,
            }

            setAnimationPresets(animPresets)

            moveBalloon(models)

            // createDingles(scene, module, 10, models.dingleBo, {
            //     x : 0,
            //     z : 0
            // }, 0.3)

            // createDingles(scene, module, 7, models.dingleBo, {
            //     x : 0.8,
            //     z : 9.3
            // }, 3)

            // createDingles(scene, module, 4, models.dingleBo, {
            //     x : -10,
            //     z : 34
            // }, 2)

            // Girl animations
            // girlAnimations(
            //     models["xtc-x"],
            //     models["xtc-x"].animations,
            //     // keys,
            //     // dispatch
            // )

            // Move girl
            // girlMovement(
            //     animationPresets
            //     // dispatch
            // )

            // let wireframe = new THREE.WireframeGeometry(geometry)
            // let line = new THREE.LineSegments(wireframe)
            // line.rotation.x = -Math.PI / 2
            // line.position.y = -0
            // line.material.color.setHex(0x000000)
            // scene.add(line)

            setInitComplete(true)
        })
    }

    const animate = now => {
        // Animation mixer update - START
        let delta
        // now *= 0.001  // make it seconds
        // Animation mixer update - END

        // console.log("STILL RUNNING")

        if (scene && camera && controls && stats) {
            stats.update()
            // Animates movements (check girlMovement.js file)
            if (Object.keys(keys).length > 0)
                movements.animateMovements(keys, prevCurrKey)

            if (clock) {
                delta = clock.getDelta()
            }

            // models["vinylPlayr"].scene.rotation.y += 0.001
            renderer.render(scene, camera)

            if (typeOfControls === "trackBall") {
                controls.update()
            }

            if (pause) return
            requestAnimationFrame(animate)
            // console.log(pause)
        }
    }

    const dynamicallyImportPackage = async () => {
        let allMods = {}

        // Importing trackball controls and GLTFLoader
        await Promise.all([
            import("three/examples/jsm/controls/TrackballControls"),
            import("three/examples/jsm/loaders/GLTFLoader.js"),
            import("three/examples/jsm/loaders/DRACOLoader.js"),
            import("three/examples/jsm/controls/PointerLockControls.js"),
            import("three/examples/jsm/objects/Water2.js"),
            import("three/examples/jsm/libs/dat.gui.module.js"),
            import("three/examples/jsm/modifiers/SubdivisionModifier.js"),
            import("three/examples/jsm/utils/SkeletonUtils.js"),
        ])
            .then(modules => {
                modules.map((item, i) => {
                    allMods = {
                        ...allMods,
                        ...item,
                    }
                })
            })
            .catch(e => console.log(e))

        return allMods
    }

    return (
        <div className="parent-class">
            <div
                ref={canvasWrapper}
                className="display-screen"
                onClick={() => {
                    if (controls && typeOfControls === "pointerLock") {
                        if (!controls.isLocked) controls.lock()
                    }
                }}
                tabIndex="1"
                onKeyDown={e => {
                    // let keyPress = keys
                    // keyPress[e.keyCode] = true

                    // setKeys({
                    //     ...keys,
                    //     ...keyPress
                    // })
                    const { keyCode } = e

                    if (
                        keyCode === 87 ||
                        keyCode === 83 ||
                        keyCode === 65 ||
                        keyCode === 68
                    )
                        sceneAnimations.animationControllers(keys)

                    keys[e.keyCode] = true

                    // Stores the prev key in [0] and current key in [1]
                    if (prevCurrKey[1] !== e.keyCode) {
                        prevCurrKey[0] = prevCurrKey[1]
                        prevCurrKey[1] = e.keyCode
                    }
                }}
                onKeyUp={e => {
                    const { keyCode } = e

                    if (
                        keyCode === 87 ||
                        keyCode === 83 ||
                        keyCode === 65 ||
                        keyCode === 68
                    )
                        sceneAnimations.animationControllers(null, keys)

                    // let keyPress = keys
                    // delete keyPress[e.keyCode]

                    // setKeys(keyPress)

                    delete keys[e.keyCode]
                }}
            >
                <LoadingScreen
                    loadingCompleted={() => {
                        // do something
                        let menu = document.getElementById("main-menu")
                        menu.style.display = "block"
                    }}
                />

                <div className="bootes-image-wrap" id="main-menu">
                    <SubMenu />
                </div>
            </div>

            <div className="volume-wrap" id="volume">
                <Volume sound={sound} />
            </div>

            <div className="twitter-wrap">
                <Twitter />
            </div>

            <div className="controls-wrap" id="controls">
                <Controls />
            </div>
        </div>
    )
}

export default WorldBuild
