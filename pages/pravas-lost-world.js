import React from 'react'
import Head from 'next/head'
import WorldBuild from '../src/components/worldBuild'
import { PhysicsContextProvider } from '../src/utils/contexts/physicsContexts'

const SolarSystemComp = () => {
    return (
        <div>
            <Head>
                <title>Watch gravity in action</title>
                <link rel='icon' href='/favicon.ico' />
            </Head>

            <PhysicsContextProvider>
                <WorldBuild />
            </PhysicsContextProvider>
        </div>
    )
}


export default SolarSystemComp