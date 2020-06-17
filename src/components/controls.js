const { WButtonIcon, MouseButtonIcon, AButtonIcon, SButtonIcon, DButtonIcon, EscButtonIcon } = require("../assets/images")


const Controls = () => {
    return (
        <div className="controls main-box dummy-abs">
            <div className="controls-box sub-box">
                <h5 className="controls-text">Controls</h5>

                <div className="key-wrap">
                    <div className="key-icon">
                        <MouseButtonIcon/>
                    </div>
                    <p className="key-text">Enter the void</p>
                </div>

                <div className="key-wrap simp-buttons">
                    <div className="key-icon">
                        <WButtonIcon/>
                    </div>
                    <p className="key-text">Move forward</p>
                </div>

                <div className="key-wrap simp-buttons">
                    <div className="key-icon">
                        <AButtonIcon/>
                    </div>
                    <p className="key-text">Move left</p>
                </div>

                <div className="key-wrap simp-buttons">
                    <div className="key-icon">
                        <SButtonIcon/>
                    </div>
                    <p className="key-text">Move forward</p>
                </div>

                <div className="key-wrap">
                    <div className="key-icon">
                        <DButtonIcon/>
                    </div>
                    <p className="key-text">Move right</p>
                </div>

                <div className="key-wrap">
                    <div className="key-icon ">
                        <EscButtonIcon/>
                    </div>
                    <p className="key-text">Escape the void</p>
                </div>
            </div>
        </div>
    )
}

export default Controls