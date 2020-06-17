import React, { useEffect, useRef, useContext, useState } from 'react'
import { LoadingIcon } from '../assets/images'
import { LoadingContext } from '../utils/contexts/loadingContexts'
import gsap from 'gsap'


const LoadingScreen = (props) => {


    const { progress, dispatch } = useContext(LoadingContext)
    const [ loadingDone, setLoadingDone ] = useState(false)


    useEffect(() => {

        const { percentLoaded } = progress

        gsap.to(
            ".loading-percentage",
            {
                duration : 0.2,
                scale: 1 + Math.floor(percentLoaded) / 100
            }
        )

        if(percentLoaded === 100){

            let tl = gsap.timeline({
                onComplete : () => {

                    setLoadingDone(true)
                    props.loadingCompleted()
                }
            })
            let duration = 0.8

            tl
            .to(
                ".loading-icon",
                {
                    duration,
                    y : -10,
                    opacity : 0,
                    ease : "power4.out"
                },
                "0"
            )
            .to(
                ".loading-title",
                {
                    duration,
                    x : -5,
                    opacity : 0,
                    ease : "power4.out"
                },
                "0"
            )
            .to(
                ".loading-percentage",
                {
                    duration,
                    x : 5,
                    opacity : 0,
                    ease : "power4.out"
                },
                "0"
            )
            
        }

        
    }, [progress])
    

    return (

        <div
            className = {
                !loadingDone
                ?
                "loading-screen"
                :
                "loading-screen hide"
            }
            >
            <div className="main-loading-wrap flexCol-Centre" >
                <div className="loading-items flexCol-Centre">
                    <div className="loading-icon">
                        <LoadingIcon/>
                    </div>

                    

                    <div className="main-loading-text">
                        <h2 className="loading-title">
                            Tunnelling
                        </h2>
                        <h2 className="loading-percentage">
                            {
                                Math.floor(progress.percentLoaded) + "%"
                            }
                        </h2>
                    </div>

                </div>
            </div>
        </div>

        
    )
}

export default LoadingScreen