
import React from 'react'
import { HeadPhonesIcon, TwitterIcon, MainLogoIcon, PlayButtonIcon } from '../assets/images'



const SubMenu = (props) => {

    const returnMenu = () => {
        return (

            // <MainLogoIcon/>



            <div className="sub-menu">
                <div className="sub-menu-screen">
                    <div className="menu-wrap">
                        <div className="centre-div dummy-abs centre-main">
                            <div className="centre-div-box flexCol-Centre">
                                <div className="centre-div-inner flexCol-Centre">
                                    <div className="main-title">
                                        <MainLogoIcon/>
                                    </div>

                                    <p className="sub-title">
                                        Weekend project still in development. I released it as a part of my portfolio projects.
                                    </p>

                                    <div className="play-action">
                                        <div className="play-button flexCol-Centre">
                                            <PlayButtonIcon/>
                                        </div>

                                        <h5 className="click-to-play">
                                            Click to start
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

                    </div>
                
       
                </div>
            </div>
            
 
        )
    }

    return (
        <div className="wrapper-main-div">
            {
                returnMenu()
            }
        </div>
    )
}

export default SubMenu