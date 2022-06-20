export const incReducer = (state, action) => {
    switch (action.type) {
        case "INC_1":
            return {
                ...state,
                count: state.count + action.num,
            }

        case "INC_2X":
            return {
                ...state,
                count: state.count * 2,
            }

        default:
            return state
    }
}
