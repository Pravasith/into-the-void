import React, { createContext, useReducer } from 'react'
import { velocityReducer } from '../reducers/physicsReducers'

export const PhysicsContext = createContext()

export const PhysicsContextProvider = (props) => {

    const [ addVelocityStats, dispatch ] = useReducer(
        velocityReducer,
        {
            stats : {},
            x : 1
        }
    )

    return (
        <PhysicsContext.Provider
            value = {{ addVelocityStats, dispatch }}
            >
            { props.children }
        </PhysicsContext.Provider>
    )
}