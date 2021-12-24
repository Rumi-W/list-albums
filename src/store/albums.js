import { createSelector } from 'reselect'
import { axiosMusic } from '../axios'
import {
    FETCH_ALBUMS_START,
    FETCH_ALBUMS_SUCCESS,
    FETCH_ALBUMS_FAILED,
    TOGGLE_FAVORITE,
    CLEAR_FAVORITES
} from './actionTypes'

// Actions -----
// Fetch
const fetchStarted = () => ({
    type: FETCH_ALBUMS_START
})

const fetchFailed = () => ({
    type: FETCH_ALBUMS_FAILED
})

const fetchSuccess = (albums) => ({
    type: FETCH_ALBUMS_SUCCESS,
    albums
})

// Favorites
export const fetchAlbums = () => async (dispatch) => {
    dispatch(fetchStarted())
    try {
        const response = await axiosMusic.get()
        if (!response || !response.data || response.status !== 200) {
            console.log('failed')
            dispatch(fetchFailed())
        } else {
            dispatch(fetchSuccess(response.data.feed.entry || []))
        }
    } catch (e) {
        console.log('Error', e)
        dispatch(fetchFailed())
    }
}

export const toggleFavorite = (id) => ({
    type: TOGGLE_FAVORITE,
    id
})

export const clearFavorites = () => ({
    type: CLEAR_FAVORITES
})

// Reducer -----
// Fetch
const initState = {
    pending: false,
    sccess: false,
    items: []
}

export const albumsReducer = (state = initState, action = {}) => {
    switch (action.type) {
        case FETCH_ALBUMS_START:
            return { ...state, pending: true }

        case FETCH_ALBUMS_SUCCESS:
            return { ...state, pending: false, success: true, items: getAlbumInfo(action.albums) }

        case FETCH_ALBUMS_FAILED:
            return initState

        case TOGGLE_FAVORITE:
            return { ...state, items: toggleSelection(state.items, action.id) }

        case CLEAR_FAVORITES:
            return initState

        default:
            return state
    }
}

// Selectors
// export const getAlbums = (state) => state.albumsReducer

// memorized selectors
export const albumItems = createSelector(
    (state) => state.albumsReducer,
    (albums) => albums.items
)

export const isAlbumsPending = createSelector(
    (state) => state.albumsReducer,
    (albums) => albums.pending
)

export const isAlbumsSuccess = createSelector(
    (state) => state.albumsReducer,
    (albums) => albums.success
)

export const allFavoriteAlbums = createSelector(albumItems, (items) => items.filter((item) => item.selected))

export const favoriteAlbumIDs = createSelector(allFavoriteAlbums, (selectedItems) =>
    selectedItems.map((selected) => selected.id)
)

// Helpers ---
const getAlbumInfo = (albums) => {
    return albums.map((item) => {
        return {
            id: item.id.attributes['im:id'],
            image: item['im:image'][2].label,
            artistFull: item['im:artist'].label,
            artist:
                item['im:artist'].label.length > 40
                    ? `${item['im:artist'].label.substring(0, 40)}...`
                    : item['im:artist'].label,
            titleFull: item['im:name'].label,
            title:
                item['im:name'].label.length > 50
                    ? `${item['im:name'].label.substring(0, 50)}...`
                    : item['im:name'].label,
            link: item.link.attributes.href,
            price: item['im:price'].label,
            releaseDate: item['im:releaseDate'].attributes ? item['im:releaseDate'].attributes.label : '',
            selected: false
        }
    })
}

const toggleSelection = (albums, selectedId) => {
    return albums.map((item) => {
        if (item.id === selectedId) {
            item.selected = !item.selected
        }
        return item
    })
}
