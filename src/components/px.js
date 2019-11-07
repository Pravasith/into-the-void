import React, { useContext } from 'react'
import Head from 'next/head'
import { HContext } from '../utils/contexts/hContext'



const T = () => {
    const { inc } = useContext(HContext)
    // console.log(inc)
    return <h1>This is count from {inc.compType}, it's value is {inc.count}</h1>
}

export default T