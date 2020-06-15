import React from 'react'
import Head from 'next/head'
import WorldBuild from '../src/components/worldBuild'
import { LoadingContextProvider } from '../src/utils/contexts/loadingContexts'

const PravasWorld = () => {
    return (
        <div>
            <Head>
                <title>Watch gravity in action</title>
                <link rel='icon' href='/favicon.ico' />
            </Head>

            <LoadingContextProvider>
                <WorldBuild />
            </LoadingContextProvider>
        </div>
    )
}


export default PravasWorld
