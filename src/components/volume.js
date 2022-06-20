import React, { useState, useEffect } from "react"
import { Howl, Howler } from "howler"

import { VolumeUpIcon, VolumeDownIcon } from "../assets/images"

import { albumSongs } from "./resources"

const Volume = props => {
    const [isMuted, setIsMuted] = useState(true)
    let pause = false

    const { sound } = props

    useEffect(() => {
        // Adding event listener in vanilla JS instead of React events
        // because howler and react dont work well together
        document
            .getElementsByClassName("volume")[0]
            .addEventListener("click", function (event) {
                // do something

                if (pause) {
                    sound.play()
                    // pause = false
                    setIsMuted(true)
                } else {
                    sound.pause()
                    // pause = true
                    setIsMuted(false)
                }

                pause = !pause
            })
    }, [])

    return (
        <div className="volume main-box dummy-abs">
            <div className="volume-box sub-box">
                <div className="volume-icon box-icon">
                    {isMuted ? <VolumeUpIcon /> : <VolumeDownIcon />}
                </div>
                <p className="volume-text">
                    {isMuted
                        ? "Click here to mute."
                        : "Muted. Click here to unmute."}
                </p>
            </div>
        </div>
    )
}

export default Volume
