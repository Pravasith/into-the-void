import React, { useEffect, useContext } from "react"
import Head from "next/head"
import { HContext } from "../utils/contexts/hContext"

const H = () => {
    const { dispatch } = useContext(HContext)

    return (
        <div>
            <div
                onClick={() => {
                    // Do something
                    dispatch({ type: "INC_1", num: 10 })
                }}
            >
                Click to inc.
            </div>
            <div
                className="inc-2x"
                onClick={() => {
                    // Do something
                    dispatch({ type: "INC_2X" })
                }}
            >
                Click to inc 2 x
            </div>
        </div>
    )
}

export default H
