import * as THREE from 'three'

let prevKey, 
    nowKey, 
    noOfKeysPressed = 0,
    isRunning = false


export const sceneAnimations = {
    init : null, // this function initiates a few steps before staring animations the girl's movements
    globalVars : null, // this just stores some values from init function to pass them on to animateMovements
    animationControllers : null, // this is the function which does the moving stuff - should be looped in a reqAnimFrame()
    init_ES6 : function() { // a dummy function to access global 'this'

        // 'this' keyword below is local to init_ES6 function
        // console.log(this) // returns init_ES6 function

        this.init = (girl, animations) => {
            let clock = new THREE.Clock(),
                mixer = new THREE.AnimationMixer(girl.scene),
                actions = {},
                activeAction,
                previousAction,
                prevKey,
                nowKey

            let animationStates = [
                // Continuous actions
                'Idle',
                // 'Walking',
                'Running',
                // 'Dance',
        
                // One time actions
                // 'Death',
                // 'Sitting',
                // 'Standing'
            ],
            
            emotes = ['Jump', 'Yes', 'No', 'Wave', 'Punch', 'ThumbsUp'] // One time actions
        
            animations.map((clip, i) => {
        
                let action = mixer.clipAction(clip)
                actions[clip.name] = action
        
                if ( emotes.indexOf(clip.name) >= 0 || animationStates.indexOf(clip.name) >= 4 ) {
                    // One time actions
                    action.clampWhenFinished = true
                    action.loop = THREE.LoopOnce
                }
            })
        
        
            // Example - if 'W' pressed, fadeToAction('Walking', 0.2)
            function fadeToAction( name, duration ) {
                previousAction = activeAction
                activeAction = actions[name]
        
                if (previousAction !== activeAction) {
                    previousAction.fadeOut(duration)
                }

                activeAction
                .reset()
                .setEffectiveTimeScale(1)
                .setEffectiveWeight(1)
                .fadeIn(duration)
                .play()
            }

            this.globalVars = {
                mixer,
                fadeToAction,
                prevKey,
                nowKey
            }

            // Default action 
            activeAction = actions['Idle']

            activeAction.play()

            function animate( time ) {

                // Animation mixer update - START
                let delta
                delta = clock.getDelta()

                
                // Animation mixer update - END

                mixer.update(delta)
                requestAnimationFrame( animate )
               
            }

            animate()

        }

        this.animationControllers = (keyCode, keys) => {

            const { fadeToAction } =  this.globalVars

            if(keys) noOfKeysPressed = Object.keys(keys).length

            prevKey = nowKey,
            nowKey = keyCode

            if(keyCode){
                if(prevKey !== nowKey){
                    if(!isRunning) fadeToAction("Running", 0.1)
                    isRunning = true
                }
            }

            else {
                // console.log(noOfKeysPressed)
                if(noOfKeysPressed === 1){
                    fadeToAction("Idle", 0.1)
                    isRunning = false
                    // console.log(prevKey, nowKey)
                }

                // console.log(noOfKeysPressed)
            }

        }
    }
}


sceneAnimations.init_ES6()



export const girlAnimations = (girl, animations, dispatch) => {

   

    


    // KEY BINDINGS

    // if the pressed key is 87 (w) then keys[87] will be true
    // keys [87] will remain true untill the key is released (below)
    // the same is true for any other key, we can now detect multiple
    // keypresses
    // document.onkeydown = function (e) {
    //     keys[e.keyCode] = true
    // }

    // document.onkeyup = function (e) {
    //     delete keys[e.keyCode]
    // }


    const playRelevantAnimation = () => {
        
        // if(keys[87]){ // W 
        //     console.log("X") 
        // }

        // if(keys[65]){ // A
        // }

        // if(keys[83]){ // S
        // }

        // if(keys[68]){ // D
        // }
    }



    function animate(time) {
        // do updating/repeating things here
        playRelevantAnimation()
        requestAnimationFrame( animate )
    }

    animate()
}

