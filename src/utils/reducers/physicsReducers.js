export const velocityReducer = (state, action) => {
    switch (action.type){
        case "ADD_VELOCITY":
            return {
                ...state,
                stats : action.stats
            }

        case "ADD_1":
            return {
                ...state,
                x : action.x
            }

        default :
            return state
    }
}