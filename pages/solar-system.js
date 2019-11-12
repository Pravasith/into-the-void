import React from 'react'
import Head from 'next/head'
import SolarSystem from '../src/components/solarSystem'
import { PhysicsContextProvider } from '../src/utils/contexts/physicsContexts'

const SolarSystemComp = () => {
    return (
        <div>
            <Head>
                <title>Watch gravity in action</title>
                <link rel='icon' href='/favicon.ico' />
            </Head>

            <PhysicsContextProvider>
                <SolarSystem />
            </PhysicsContextProvider>
        </div>
    )
}


export default SolarSystemComp
