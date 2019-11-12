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

export const textureImages = [
    "https://xi-upload.s3.amazonaws.com/app-pics/threejs/space-background-pravasith-2.png",
    "https://xi-upload.s3.amazonaws.com/app-pics/threejs/space-background-pravasith-4.png",
    "https://xi-upload.s3.amazonaws.com/app-pics/threejs/space-background-pravasith-2U.png",
    "https://xi-upload.s3.amazonaws.com/app-pics/threejs/space-background-pravasith-2D.png",
    "https://xi-upload.s3.amazonaws.com/app-pics/threejs/space-background-pravasith-3.png",
    "https://xi-upload.s3.amazonaws.com/app-pics/threejs/space-background-pravasith-1.png"
]

export const SideBarButton = (props) => (
    <a href="#" className="cta">
        <span>{props.children}</span>
        <svg width="13px" height="10px" viewBox="0 0 13 10">
            <path d="M1,5 L11,5"></path>
            <polyline points="8 1 12 5 8 9"></polyline>
        </svg>
    </a>
)