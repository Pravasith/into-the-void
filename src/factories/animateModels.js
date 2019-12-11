
import { TweenMax } from 'gsap'
import { Vector3 } from 'three'

export const animateModels = (character, document, camera) => {

    let model = character.modelData.scene
    

   


    // Key bindings / keybindings / keybinder
    // Arrow key movement. Repeat key five times a second
    // I don't know this, copied from stack over flow
    // because long press events by traditional methods
    // were too delayed
    // link - https://stackoverflow.com/questions/3691461/remove-key-press-delay-in-javascript
    KeyboardController({
        87: function() { characterAction('w') },
        65: function() { characterAction('a') },
        83: function() { characterAction('s') },
        68: function() { characterAction('d') }
    }, 10, document)

    
    const characterAction = (key) => {

        let pi = Math.PI
        // let tl = new TimelineLite()
        let timestep = 0.1 // Time step between animations
        let positionStep = 0.075


        if(key === "w"){
            model.position.z -= positionStep
            updateCameraPosition(camera, model) // camera, relative object
            // TweenMax.to(model.rotation, timestep, {
            //     y : 0
            // })
        }

        if(key === "a"){
            model.position.x -= positionStep
            updateCameraPosition(camera, model) // camera, relative object
            // TweenMax.to(model.rotation, timestep, {
            //     y : pi / 2
            // })
        }

        if(key === "s"){
            model.position.z += positionStep
            updateCameraPosition(camera, model) // camera, relative object
            // TweenMax.to(model.rotation, timestep, {
            //     y : pi
            // })
        }

        if(key === "d"){
            model.position.x += positionStep
            updateCameraPosition(camera, model) // camera, relative object
            // TweenMax.to(model.rotation, timestep, {
            //     y : -pi / 2
            // })
        }

        
    }


    

    // Key bindings / keybindings / keybinder
    // document.onkeydown = (e) => {
    // const x = (e) => {
    //     // e.preventDefault()
    //     console.log(e.key)
    //     // Characters
   
    // }

    // document.addEventListener("keydown", x)
}

const updateCameraPosition = (camera, obj) => {
    // function animate( time ) {
    //     let distance = 10

    //     let cameraPos = new Vector3(
    //         obj.position.x + distance,
    //         obj.position.y + distance,
    //         obj.position.z + distance
    //     )

        
       

    //     requestAnimationFrame( animate )
    // }

    // requestAnimationFrame( animate )
    // let distance = 10

    camera.position.set(
        obj.position.x,
        obj.position.y + 20,
        obj.position.z + 15
    )
}



// Keyboard input with customisable repeat (set to 0 for no key repeat)
// I don't know this, copied from stack over flow
// because long press events by traditional methods
// were too delayed
// link - https://stackoverflow.com/questions/3691461/remove-key-press-delay-in-javascript
function KeyboardController(keys, repeat, document) {
    // Lookup of key codes to timer ID, or null for no repeat
    //
    var timers= {}

    // When key is pressed and we don't already think it's pressed, call the
    // key action callback and set a timer to generate another one after a delay
    //
    document.onkeydown= function(event) {
        console.log(event.keyCode)
        var key= (event || window.event).keyCode
        if (!(key in keys))
            return true
        if (!(key in timers)) {
            timers[key]= null
            keys[key]()
            if (repeat!==0)
                timers[key]= setInterval(keys[key], repeat)
        }
        return false
    }

    // Cancel timeout and mark key as released on keyup
    //
    document.onkeyup= function(event) {
        var key= (event || window.event).keyCode
        if (key in timers) {
            if (timers[key]!==null)
                clearInterval(timers[key])
            delete timers[key]
        }
    }

    // When window is unfocused we may not get key events. To prevent this
    // causing a key to 'get stuck down', cancel all held keys
    //
    window.onblur= function() {
        for (key in timers)
            if (timers[key]!==null)
                clearInterval(timers[key])
        timers= {}
    }
}