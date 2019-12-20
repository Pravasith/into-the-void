import React, { createContext, useReducer } from 'react'
import { keysReducer } from '../reducers/keysReducer'

export const WorldContext = createContext()

export const WorldContextProvider = (props) => {

    const [keys, dispatch] = useReducer(
        keysReducer, 
        {
            keyCode : {}
        }
    )

    return (
        <WorldContext.Provider
            value = {{keys, dispatch}}
            >
            {props.children}
        </WorldContext.Provider>
    )
}