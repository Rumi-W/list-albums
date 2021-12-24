import { createSelector } from 'reselect'
import { FETCH_TODOLIST_SUCCESS, FETCH_TODOLIST_FAILED, UPDATE_TASK, DELETE_TASK } from './actionTypes'
import { axiosToDoList } from '../axios'

const fetchSuccess = (tasks) => ({
    type: FETCH_TODOLIST_SUCCESS,
    tasks
})

const fetchFailed = () => ({
    type: FETCH_TODOLIST_FAILED
})

export const fetchToDoList = () => async (dispatch) => {
    try {
        const res = await axiosToDoList.get()
        if (res && res.status === 200 && res.data) {
            dispatch(fetchSuccess(res.data))
        } else {
            dispatch(fetchFailed())
        }
    } catch (e) {
        console.log('Error to do list', e)
    }
}

export const updateTask = (id, newTitle) => ({
    type: UPDATE_TASK,
    id,
    newTitle
})

export const deleteTask = (id) => ({
    type: DELETE_TASK,
    id
})

const initState = []
export const toDoListReducer = (state = initState, action = {}) => {
    switch (action.type) {
        case FETCH_TODOLIST_SUCCESS:
            return action.tasks.map((obj) => ({ ...obj, title: capitalizeFirstChar(obj.title) }))
        //return action.tasks

        case FETCH_TODOLIST_FAILED:
            return state

        case UPDATE_TASK:
            return state.map((task) => ({ id: task.id, title: task.id !== action.id ? task.title : action.newTitle }))

        case DELETE_TASK:
            return state.filter((task) => task.id !== action.id)

        default:
            return state
    }
}

// Selectors
export const toDoList = createSelector(
    (state) => state.toDoListReducer,
    (tasks) => (tasks && tasks.length ? tasks.sort() : [])
)

// Helpers
const capitalizeFirstChar = (str) => {
    const arr = str.split('')
    arr[0] = arr[0].toUpperCase()
    return arr.join('')
}

// sort array of objects
// favorites.sort(compareObj)
// const compareObj = (a, b) => {
//     return a.title > b.title ? 1 : b.title > a.title ? -1 : 0
// }
