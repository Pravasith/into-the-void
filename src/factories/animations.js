import * as THREE from 'three'

export const girlAnimations = (girl, animations, document) => {

    let clock,
        mixer = new THREE.AnimationMixer(girl),
        actions = {},
        activeAction,
        previousAction,
        keys = []

    let animationStates = [
        // Continuous actions
        'Idle',
        'Walking',
        'Running',
        'Dance',

        // One time actions
        'Death',
        'Sitting',
        'Standing'
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

    // Default action 
    // activeAction = actions['Idle']
	// activeAction.play()


    // KEY BINDINGS

    // if the pressed key is 87 (w) then keys[87] will be true
    // keys [87] will remain true untill the key is released (below)
    // the same is true for any other key, we can now detect multiple
    // keypresses
    document.onkeydown = function (e) {
        keys[e.keyCode] = true
    }

    document.onkeyup = function (e) {
        delete keys[e.keyCode]
    }


    const playRelevantAnimation = () => {
        
        if(keys[87]){ // W 
            console.log("X") 
        }

        if(keys[65]){ // A
        }

        if(keys[83]){ // S
        }

        if(keys[68]){ // D
        }
    }


    function animate(time) {
        // do updating/repeating things here
        playRelevantAnimation()
        requestAnimationFrame( animate )
    }

    animate()
}

