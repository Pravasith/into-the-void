import React, { useEffect, useRef, useContext, useState } from 'react'
import { LoadingIcon } from '../assets/images'
import { LoadingContext } from '../utils/contexts/loadingContexts'
import gsap from 'gsap'


const LoadingScreen = (props) => {


    const { progress, dispatch } = useContext(LoadingContext)
    // const [ loadingDone, setLoadingDone ] = useState(false)


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
                onComplete : done
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
    
    // useEffect(() => {
    //     if(loadingDone === true){

    //         dispatch({
    //             type : "LOADING_COMPLETE", 
    //             loadingDone : true
    //         })
    //     }
    // }, [loadingDone])

  
 
    const done = () => {
        let c = 0

        if(progress.percentLoaded === 100){
            dispatch({
                type : "LOADING_COMPLETE", 
                loadingDone : true
            })
        }
    }

    return (
        <div className="main-logo flexCol-Centre">
            <div className="loading-items flexCol-Centre">
                <div className="loading-icon">
                    <LoadingIcon/>
                </div>

                

                <div className="main-loading-text">
                    <h2 className="loading-title">
                        Tunneling
                    </h2>
                    <h2 className="loading-percentage">
                        {
                            Math.floor(progress.percentLoaded) + "%"
                        }
                    </h2>
                </div>

            </div>
        </div>
    )
}

export default LoadingScreen