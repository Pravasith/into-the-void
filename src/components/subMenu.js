
import React, { useState, useEffect, useContext, useRef } from 'react'
import { HeadPhonesIcon, VolumeUpIcon, PlanetInfoIcon, TwitterIcon, MainLogoIcon, PlayButtonIcon, VolumeDownIcon } from '../assets/images'
import { Howl, Howler } from 'howler'
import { albumSongs } from './resources'


const SubMenu = () => {


    const [ isMuted, setIsMuted ] = useState(false)

    let pause = true

    let sound = new Howl({
        src: [
            albumSongs.aviators.flora
        ],
        loop: true,
        volume: 0.5
    })


    useEffect(() => {

        // Adding event listener in vanilla JS instead of React events
        // because howler and react dont work well together

        document.getElementsByClassName("volume")[0]
        .addEventListener('click', function (event) {
            // do something

            if(pause){
                sound.play()
                pause = false
                setIsMuted(true)
            }
            else {
                sound.pause()
                pause = true
                setIsMuted(false)
            }
        })

    }, [])

    useEffect(() => {
        console.log(isMuted)
    },
    [isMuted]
    )
    



    return (
        <div className="wrapper-main-div">
            <div className="div-wrap">
                <div className="centre-div dummy-abs">
                    <div className="centre-div-box flexCol-Centre">
                        <div className="centre-div-inner flexCol-Centre">
                            <div className="main-title">
                                <MainLogoIcon/>
                            </div>

                            <p className="sub-title">
                                Weekend project still in development. I released it as a part of my portfolio projects. If you like my work and want to say Hi, feel free to email me at <a href="mailto:pravasith@gmail.com" target="_top">pravasith@gmail.com</a>
                            </p>

                            <div className="play-action">
                                <div className="play-button flexCol-Centre">
                                    <PlayButtonIcon/>
                                </div>

                                <h5 className="click-to-play">
                                    Click here to play
                                </h5>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="head-phones main-box dummy-abs">
                    <div className="head-phones-box sub-box">
                        <div className="headphone-icon box-icon">
                            <HeadPhonesIcon/>
                        </div>
                        <p className="headphone-text">Use headphones for max awesomeness in experience</p>
                    </div>
                </div>

                <div 
                    className="volume main-box dummy-abs"
                    >
                    <div className="volume-box sub-box">
                        <div 
                            className="volume-icon box-icon"
                            >
                            {
                                isMuted
                                ?
                                <VolumeUpIcon/>
                                :
                                <VolumeDownIcon/>
                            }
                        </div>
                        <p className="volume-text">Muted. Click to unmute.</p>
                    </div>
                </div>

                <div className="planet-info main-box dummy-abs">
                    <div className="planet-info-box sub-box">
                        <div className="planet-info-icon box-icon">
                            <PlanetInfoIcon/>
                        </div>
                        <p className="planet-info-text">Planet info</p>
                    </div>
                </div>

                <div 
                    className="twitter main-box dummy-abs"
                    
                    >
                    <a href="https://twitter.com/pravasith" target="_blank" rel="noopener noreferrer">
                        <div className="twitterbox sub-box">
                            <div className="twitter-icon box-icon">
                                <TwitterIcon/>
                            </div>
                            <p className="twitter-text">/pravasith</p>
                        </div>
                    </a>
                </div>
            </div>
        
        </div>
    )
}

export default SubMenu