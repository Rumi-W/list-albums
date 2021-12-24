import { createSelector } from 'reselect'
import { SAVE_FAVORITES_CARDS_ORDER } from './actionTypes'

export const saveFavoriteCardsInOrder = (favorites) => ({
    type: SAVE_FAVORITES_CARDS_ORDER,
    favorites
})

const init = []
export const savedFavoriteCardsReducer = (state = init, action = {}) => {
    switch (action.type) {
        case SAVE_FAVORITES_CARDS_ORDER:
            console.log('SAVE', action.favorites)
            return action.favorites

        default:
            return state
    }
}

// selectors

// returns IDs in order
export const savedFavoriteCards = createSelector(
    (state) => state.savedFavoriteCardsReducer,
    (saved) => {
        return saved.map((item) => item.id)
    }
)
