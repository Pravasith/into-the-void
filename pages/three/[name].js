import React from 'react'
import { useRouter } from 'next/router'


const X = () => {

    const router = useRouter()
    const { name } = router.query

    return (
        <h1>Hello {
            name
        }</h1>
    )
}

export default X