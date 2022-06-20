import React from "react"
import Head from "next/head"
import WorldBuild from "../src/components/worldBuild"
import { LoadingContextProvider } from "../src/utils/contexts/loadingContexts"

const BootesMine = () => {
    return (
        <div>
            <Head>
                <title>Neo51 by Pravas</title>
                <link rel="icon" href="/favicon.ico" />
                <link
                    href="//db.onlinewebfonts.com/c/c936f19b94fa45553ab39066333e00aa?family=Space+Age"
                    rel="stylesheet"
                    type="text/css"
                />
            </Head>

            <LoadingContextProvider>
                <WorldBuild />
            </LoadingContextProvider>
        </div>
    )
}

export default BootesMine
