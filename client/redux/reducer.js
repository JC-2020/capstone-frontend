import { combineReducers } from 'redux';
import { ADD_USER_SKILL, SET_LOGIN, SET_LOGOUT, SET_USER_SKILLS } from './actions';



const userReducer = (state={}, action) => {
    switch (action.type){
        case SET_LOGIN:
            return action.payload.userInfo;
        case SET_LOGOUT:
            return null;
        default:
            return state;
    }   
}

const userSkillsReducer = (state=[], action) => {
    switch (action.type){
        case SET_USER_SKILLS:
            return action.payload.userSkills;
        case ADD_USER_SKILL:
            return [...state.userSkills].push(action.payload.individualSkill)
        default:
            return state;
    }
}

//? Here we will to continue to add our global state variables.App
//? Note that the keys for the functions below will be what the global state variables are named...so we will need to use these names to reference 
export const rootReducer = combineReducers({
    userInfo: userReducer,
    userSkills: userSkillsReducer,
})

//* For example, to access the state variable corresponding to the userReducer we would do the following:
//* const user = useSelector(state => state.user)