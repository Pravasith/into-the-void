import { TwitterIcon } from "../assets/images"



const Twitter = () => {
    return (
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
    )
}

export default Twitter