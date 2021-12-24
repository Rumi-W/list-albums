import { ADD_FAVORITE, REMOVE_FAVORITE, REPLACE_FAVORITES } from './actionTypes'

export const addFavoriteAlbum = (item) => ({
    type: ADD_FAVORITE,
    item
})

export const removeFavoriteAlbum = (id) => ({
    type: REMOVE_FAVORITE,
    id
})

export const replaceFavoriteAlbums = (favorites) => ({
    type: REPLACE_FAVORITES,
    favorites
})

const init = []
export const favoriteAlbumsReducer = (state = init, action = {}) => {
    switch (action.type) {
        case ADD_FAVORITE:
            return [...state, action.item]

        case REPLACE_FAVORITES:
            return action.favorites

        case REMOVE_FAVORITE:
            return state.filter((item) => item.id !== action.id)

        default:
            return state
    }
}

// selectors
export const favoriteAlbums = (state) => state.favoriteAlbumsReducer
