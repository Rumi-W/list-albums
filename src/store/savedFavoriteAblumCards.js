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
            return action.favorites

        default:
            return state
    }
}

// selectors
const getFavoriteCards = (state) => state.savedFavoriteCardsReducer

// returns IDs in order
export const savedFavoriteCards = createSelector(getFavoriteCards, (saved) => saved.map((item) => item.id))
