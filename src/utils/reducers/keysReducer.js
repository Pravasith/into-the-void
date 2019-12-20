export const keysReducer = (state, action) => {
    switch (action.type){
        case "W_PRESSED":
            return {
                ...state,
                keyCode: action.keyCode
            }

        case "A_PRESSED":
            return {
                ...state,
                keyCode: action.keyCode
            }

        case "S_PRESSED":
            return {
                ...state,
                keyCode: action.keyCode
            }

        case "D_PRESSED":
            return {
                ...state,
                keyCode: action.keyCode
            }

        default :
            return state
    }
}