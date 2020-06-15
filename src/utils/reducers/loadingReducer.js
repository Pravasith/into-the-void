export const loadingReducer = (state, action) => {
    switch (action.type){
        case "ON_PROGRESS":
            return {
                ...state,
                percentLoaded : action.percentLoaded
            }

        case "LOADING_COMPLETE":
            return {
                ...state,
                loadingDone : true
            }

        default :
            return state
    }
}