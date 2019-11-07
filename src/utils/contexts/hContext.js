import React, { useState, createContext, useReducer } from 'react'
import { incReducer } from '../reducers/hReducers'
export const HContext = createContext()



export const HContextProvider = (props) => {

    // const [ count, setCount ] = useState(1)
    // const [ compType, setCompType ] = useState("H")

    const [ inc, dispatch ] = useReducer(incReducer , {
        count : 1,
        compType : "H"
    })

    return (
        <HContext.Provider
            value = {{ inc, dispatch }}
            >
            { props.children }
        </HContext.Provider>
    )
}