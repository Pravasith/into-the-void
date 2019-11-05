

import * as THREE from 'three'

export default ( scene, maxRange, incDec, colorsXYZ ) => {

    let c = 0,
        xColor = colorsXYZ.x,
        yColor = colorsXYZ.y,
        zColor = colorsXYZ.z,
        reverseC = 0
        // maxRange = 12,
        // incDec = 2.5

    while(c < maxRange + 1){

    /////////////////////////////////////////////////////
        // Lines going from y = -maxRange to y =maxRange
        let yMaterial = new THREE.LineBasicMaterial({ color: yColor })
        let yGeometry = new THREE.Geometry()
        let subCY = 0,
            subCReverseY = 0

        while(subCY < maxRange + 1){
            yGeometry.vertices.push(new THREE.Vector3(subCY, -maxRange, c ))
            yGeometry.vertices.push(new THREE.Vector3(subCY, maxRange, c ))
            yGeometry.vertices.push(new THREE.Vector3(subCY, -maxRange, reverseC ))
            yGeometry.vertices.push(new THREE.Vector3(subCY, maxRange, reverseC ))

            yGeometry.vertices.push(new THREE.Vector3(subCReverseY, -maxRange, c ))
            yGeometry.vertices.push(new THREE.Vector3(subCReverseY, maxRange, c ))
            yGeometry.vertices.push(new THREE.Vector3(subCReverseY, -maxRange, reverseC ))
            yGeometry.vertices.push(new THREE.Vector3(subCReverseY, maxRange, reverseC ))

            subCY+=incDec
            subCReverseY-=incDec

            let yLine = new THREE.LineSegments( yGeometry, yMaterial )
            scene.add(yLine)
        }
    /////////////////////////////////////////////////////

    /////////////////////////////////////////////////////
        // Lines going from x = 0 to x =maxRange
        let xMaterial = new THREE.LineBasicMaterial({ color: xColor })
        let xGeometry = new THREE.Geometry()
        let subCX = 0,
            subCReverseX = 0

        while(subCX < maxRange + 1 ){
            xGeometry.vertices.push(new THREE.Vector3( subCX, c, -maxRange))
            xGeometry.vertices.push(new THREE.Vector3( subCX, c, maxRange))
            xGeometry.vertices.push(new THREE.Vector3( subCX, reverseC, -maxRange))
            xGeometry.vertices.push(new THREE.Vector3( subCX, reverseC, maxRange))

            xGeometry.vertices.push(new THREE.Vector3( subCReverseX, c, -maxRange))
            xGeometry.vertices.push(new THREE.Vector3( subCReverseX, c, maxRange))
            xGeometry.vertices.push(new THREE.Vector3( subCReverseX, reverseC, -maxRange))
            xGeometry.vertices.push(new THREE.Vector3( subCReverseX, reverseC, maxRange))

            subCX+=incDec
            subCReverseX-=incDec

            let xLine = new THREE.LineSegments( xGeometry, xMaterial )
            scene.add(xLine)
        }
    /////////////////////////////////////////////////////
    
    /////////////////////////////////////////////////////
        // Lines going from z = 0 to z =maxRange
        let zMaterial = new THREE.LineBasicMaterial({ color: zColor })
        let zGeometry = new THREE.Geometry()
        let subCZ = 0,
            subCReverseZ = 0

        while(subCZ < maxRange + 1){
            zGeometry.vertices.push(new THREE.Vector3( -maxRange, subCZ, c))
            zGeometry.vertices.push(new THREE.Vector3( maxRange, subCZ, c))
            zGeometry.vertices.push(new THREE.Vector3( -maxRange, subCZ, reverseC))
            zGeometry.vertices.push(new THREE.Vector3( maxRange, subCZ, reverseC))

            zGeometry.vertices.push(new THREE.Vector3( -maxRange, subCReverseZ, c))
            zGeometry.vertices.push(new THREE.Vector3( maxRange, subCReverseZ, c))
            zGeometry.vertices.push(new THREE.Vector3( -maxRange, subCReverseZ, reverseC))
            zGeometry.vertices.push(new THREE.Vector3( maxRange, subCReverseZ, reverseC))

            subCZ+=incDec
            subCReverseZ-=incDec

            let zLine = new THREE.LineSegments( zGeometry, zMaterial )
            scene.add(zLine)
        } 
    /////////////////////////////////////////////////////

        c+=incDec
        reverseC-=incDec
    } 
}