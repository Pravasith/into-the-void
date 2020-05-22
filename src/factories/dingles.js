import { totesRando } from "./math/usefulFuncs"

export const createDingles = (scene, module, num, dingle, xZCords, delta) => {
    
    dingle.scene.scale.set(0.25, 0.25, 0.25)

    let replicaDingles = new Array(num).fill("")
    replicaDingles = replicaDingles.map((item, i) => new module.SkeletonUtils.clone( dingle.scene ))

    const wavingAnimation = (skinnedMesh) => {
        let sinCount = 0, colorCount = 0
        let model = skinnedMesh.children[0].children.filter(n => n.name === "dinglePop")[0]
        let modelBones = model.skeleton.bones                
        


        function animate( time ) {

            // skinnedMesh.scale.y += Math.sin(sinCount) * totesRando(0, 0.01)

            model.material.emissive.set(
                'hsl(' + 
                Math.abs(Math.cos(colorCount + 0) * 255) 

                + ', 50%, 50%)'
            )

            sinCount+=0.05
            colorCount+=0.01

            modelBones[1].rotation.x = 0.25 * Math.sin(sinCount + 1)
            modelBones[2].rotation.x = 0.25 * Math.sin(sinCount - 1)
            modelBones[3].rotation.x = 0.25 * Math.sin(sinCount)
            modelBones[4].rotation.x = 0.25 * Math.sin(sinCount - 1)

            requestAnimationFrame( animate )
        }
    
        animate()
    }

    replicaDingles.map(item => {

        wavingAnimation(item)

        let model = item.children[0].children.filter(n => n.name === "dinglePop")[0]

        item.position.x = totesRando(xZCords.x - delta, xZCords.x + delta)
        item.position.z = totesRando(xZCords.z - delta, xZCords.z + delta)
        item.rotation.y = totesRando(0, 2 * Math.PI)
        item.scale.y = totesRando(0.1, 0.5)


        scene.add(item)
    })


}