import React from 'react'
import Head from 'next/head'
import SolarSystem from '../src/components/solarSystem'

const SolarSystemComp = () => {
    return (
        <div>
            <Head>
                <title>Watch gravity in action</title>
                <link rel='icon' href='/favicon.ico' />
            </Head>

            <SolarSystem />
        </div>
    )
}


export default SolarSystemComp
