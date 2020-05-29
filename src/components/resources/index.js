import React from 'react'

export const colors = [
    "#ff6c52",
    "#ff842b",
    "#ffd12b",
    "#bcff2b",
    "#59ff2b",

    "#2bffb8",
    "#2bd5ff",
    "#457aff",
    "#7961ff",
    "#c552ff",

    "#ff3dfc",
    "#ff3d5a"
]

const baseS3URL = 'https://xi-upload.s3.amazonaws.com/app-pics/threejs/'

export const s3URLs = {
    songs : baseS3URL + "songs/",
    mapsAndImages : baseS3URL + "maps/",
    models : baseS3URL + "models/",
}

const mapsPath = "https://xi-upload.s3.amazonaws.com/app-pics/threejs/maps/"
const songsPath = "https://xi-upload.s3.amazonaws.com/app-pics/threejs/songs/"
const modelsPath = 'https://xi-upload.s3.amazonaws.com/app-pics/threejs/models/'


export const modelLinkURLs = {
    terrain : "pravasPlanet.gltf",
    // currentCharacter : "animations-clean-x.gltf",
    currentCharacter : "mainCharacter.gltf",

    darkSidePrism : "darkSideAlbumArt.gltf",
    vinylPlayr : "vinylPlayr.gltf",
    // "dingle",
    // "dingleBo"
}

export const imageLinkURLs = {
    // Simple image texture links
    skyTexture: "space-background-pravasith-2U.png",
    mainHoarding: "pinkFloydHoarding.png",
    psyTexture: "psyTexture.png",
    psyCloth: "psyCloth.png",
    woodTexture: "wood.png",
    darkSideCDTex: "darkSideTex.png",
    songList: "darkSideOfTheMoonSongList.png",
}

export const envMapURLs = {
    // Env maps || cube maps
    sceneEnv : [
        s3URLs.mapsAndImages + "posX.jpg",
        s3URLs.mapsAndImages + "negX.jpg",

        s3URLs.mapsAndImages + "negY.jpg",
        s3URLs.mapsAndImages + "posY.jpg",

        s3URLs.mapsAndImages + "posZ.jpg",
        s3URLs.mapsAndImages + "negZ.jpg",
    ],

    skyBoxEnv : new Array(6).fill(s3URLs.mapsAndImages + "space-background-pravasith-2U.png")
}




// export const skyboxGradients = [
//     {
//         image : "https://xi-upload.s3.amazonaws.com/app-pics/threejs/space-background-pravasith-2U.png",
//         name : "spaceBgd"
//     },
//     {
//         image : "https://xi-upload.s3.amazonaws.com/app-pics/threejs/gradient/gradient-background-pravasith-2DN.png",
//         name : "gradBgd_Down"
//     },
//     {
//         image : "https://xi-upload.s3.amazonaws.com/app-pics/threejs/gradient/gradient-background-pravasith.png",
//         name : "gradBgd"
//     },
//     {
//         image : "https://xi-upload.s3.amazonaws.com/app-pics/threejs/gradient/gradient-background-pravasith-2UP.png",
//         name : "gradBgd_Up"
//     }
// ]

export const SideBarButton = (props) => (
    <a href="#" className="cta">
        <span>{props.children}</span>
        <svg width="13px" height="10px" viewBox="0 0 13 10">
            <path d="M1,5 L11,5"></path>
            <polyline points="8 1 12 5 8 9"></polyline>
        </svg>
    </a>
)



export const albumSongs = {
    darkSideOfTheMoon: {
        speakToMe : songsPath + "speakToMe.mp3",
        breatheInTheAir : songsPath + "breatheInTheAir.mp3",
        onTheRun : songsPath + "onTheRun.mp3",
        time : songsPath + "time.mp3",
        theGreatGigInTheSky : songsPath + "theGreatGigInTheSky.mp3",
        money : songsPath + "money.mp3",
        usAndThem: songsPath + "usAndThem.mp3",
        anyColorYouLike : songsPath + "anyColorYouLike.mp3",
        brainDamage : songsPath + "brainDamage.mp3",
        eclipse : songsPath + "eclipse.mp3",
    }
}