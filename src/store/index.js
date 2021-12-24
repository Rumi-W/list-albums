import { combineReducers } from 'redux'
import { albumsReducer } from './albums'
import { favoriteAlbumsReducer } from './favoriteAlbums'
import { savedFavoriteCardsReducer } from './savedFavoriteAblumCards'
import { toDoListReducer } from './toDoList'

const reducers = combineReducers({ albumsReducer, toDoListReducer, favoriteAlbumsReducer, savedFavoriteCardsReducer })

export default reducers
