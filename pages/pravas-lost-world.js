import React from 'react'
import Head from 'next/head'
import WorldBuild from '../src/components/worldBuild'
import { PhysicsContextProvider } from '../src/utils/contexts/physicsContexts'
import { WorldContextProvider } from '../src/utils/contexts/worldContext'

const PravasWorld = () => {
    return (
        <div>
            <Head>
                <title>Watch gravity in action</title>
                <link rel='icon' href='/favicon.ico' />
            </Head>

            <PhysicsContextProvider>                
                <WorldContextProvider>
                    <WorldBuild />
                </WorldContextProvider>
            </PhysicsContextProvider>
        </div>
    )
}


export default PravasWorld
