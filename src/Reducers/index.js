const initState = {
    name: "",
    icon: "",
    score: 0,
    room: {
        code: "",
        users: [],
        host: ""
    },
    isHost: false,
    gameGen: 0,
    numRounds: 10,
    pickPoke: 0,
}

export default function reducer(state = initState, action){
    switch(action.type){
        case "LOAD_DATA":
            return {...state, ...action.payload}

        case "CLEAR_DATA":
            return initState

        case "SET_NAME":
            console.log("SET_NAME", action.payload)
            return { ...state, name: action.payload }

        case "ADD_SCORE":
            console.log("ADD_SCORE", action.payload)
            return { ...state, score: state.score + action.payload }

        case "SET_ICON":
            console.log("SET_ICON", action.payload)
            return { ...state, icon: action.payload }

        case "CREATE_ROOM":
            console.log("CREATE_ROOM");
            return { ...state, room: { ...state.room, host: state.name }, isHost: true }

        case "JOIN_ROOM":
            const users = action.payload.users

            console.log("JOIN_ROOM", action.payload);
            return { ...state, room: { ...state.room, code: action.payload.code, users }}

        case "LEAVE_ROOM":
            console.log("LEAVE_ROOM");
            return {...state, room: initState.room, isHost: false }

        case "PICK_GEN":
            console.log("PICK_GEN");
            return {...state, gameGen: action.payload}

        case "PICK_NUM_ROUNDS":
            console.log("PICK_NUM_ROUNDS");
            return {...state, numRounds: action.payload}

        case "PICK_POKE":
            console.log("PICK_POKE");
            return {...state, pickPoke: action.payload}

        case "ADD_USER":
            console.log("ADD_USER", action.payload)
            // const {name, icon, score, index} = action.payload
            // const newUser = { name, icon, score}
            // console.log("NEW USER", newUser)
            return state

        case "UPDATE_USER":
            console.log("UPDATE_USER", action.payload)

            const index = action.payload.index - 1
            const updatedUsers = state.room.users
            updatedUsers[index] = action.payload

            return {...state, room: {...state.room, users: updatedUsers}}


        default:
            return state
    }
}
