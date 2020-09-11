


// import '../src/assets/sass/global.scss' 


import "../src/assets/scss/world.scss"


export default function App({ Component, pageProps, router }) {



    
    return (
        <>
           <Component
                {...pageProps} 
                key={router.route}
            />
        </>
       
        
    )
}