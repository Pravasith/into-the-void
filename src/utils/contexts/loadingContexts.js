import React, { createContext, useReducer } from 'react'
import { loadingReducer } from '../reducers/loadingReducer'

export const LoadingContext = createContext()

export const LoadingContextProvider = (props) => {

    const [ progress, dispatch ] = useReducer(
        loadingReducer, 
        {
            percentLoaded : 0,
            loadingDone : false
        }
    )

    return (
        <LoadingContext.Provider
            value = {{ progress, dispatch }}
            >
            { props.children }
        </LoadingContext.Provider>
    )
}