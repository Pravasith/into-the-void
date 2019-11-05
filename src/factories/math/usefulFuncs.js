// RANDOM ARBITRARY NUMBER // NAME INSPIRED FROM SARAH DRASNER :D
const totesRando = ( min, max ) => {
    return Math.random() * ( max - min ) + min
}

// RANDOM INTEGER // NAME INSPIRED FROM SARAH DRASNER :D
const totesRandoInt = ( min, max ) => {
    min = Math.ceil( min )
    max = Math.floor( max )
    return Math.floor( Math.random() * ( max - min + 1 ) ) + min
}

export { totesRando, totesRandoInt }

