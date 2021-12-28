import { createSelector } from 'reselect'
import { axiosMusic } from '../axios'
import {
    FETCH_ALBUMS_START,
    FETCH_ALBUMS_SUCCESS,
    FETCH_ALBUMS_FAILED,
    TOGGLE_FAVORITE,
    CLEAR_FAVORITES,
    FILTER_ALBUMS
} from './actionTypes'

// Actions -----
// Fetch
const fetchStarted = () => ({
    type: FETCH_ALBUMS_START
})

const fetchFailed = () => ({
    type: FETCH_ALBUMS_FAILED
})

const fetchSuccess = (albums, copy) => ({
    type: FETCH_ALBUMS_SUCCESS,
    albums,
    copy
})

export const filterAlbums = (searchKey) => ({
    type: FILTER_ALBUMS,
    searchKey
})

// Favorites
export const fetchAlbums = () => async (dispatch) => {
    dispatch(fetchStarted())
    try {
        const response = await axiosMusic.get()
        if (!response || !response.data || response.status !== 200) {
            dispatch(fetchFailed())
        } else {
            const albums = (response.data.feed.entry && getAlbumInfo(response.data.feed.entry)) || []
            const copy = deepCopy(albums)
            dispatch(fetchSuccess(albums, copy))
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
    success: false,
    items: [],
    origItems: [] // keep the original copy
}

let origItems = []

export const albumsReducer = (state = initState, action = {}) => {
    let filtered = null
    switch (action.type) {
        case FETCH_ALBUMS_START:
            return { ...state, pending: true }

        case FETCH_ALBUMS_SUCCESS:
            origItems = action.copy
            return {
                ...state,
                pending: false,
                success: true,
                items: action.albums
            }

        case FETCH_ALBUMS_FAILED:
            return initState

        case FILTER_ALBUMS:
            filtered =
                action.searchKey === '' ? deepCopy(origItems) : filterByKey(deepCopy(origItems), action.searchKey)
            return { ...state, items: filtered }

        case TOGGLE_FAVORITE:
            origItems = toggleSelection([...origItems], action.id)
            return {
                ...state,
                items: toggleSelection([...state.items], action.id)
            }

        case CLEAR_FAVORITES:
            return initState

        default:
            return state
    }
}

// Selectors
export const getAlbums = (state) => state.albumsReducer

// memorized selectors
export const albumItems = createSelector(getAlbums, (albums) => albums.items)

export const isAlbumsPending = createSelector(getAlbums, (albums) => albums.pending)

export const isAlbumsSuccess = createSelector(getAlbums, (albums) => albums.success)

export const allFavoriteAlbums = createSelector(albumItems, (items) => items.filter((item) => item.selected))

// Helpers ---
// Deep copy array of obj - otherwise the copy will maintain the reference to the original array
const deepCopy = (array) => (!array.length ? [] : array.map((obj) => ({ ...obj })))

const filterByKey = (items, key) => {
    const regexKey = new RegExp(key, 'i')
    return items.filter((item) => item.artist.match(regexKey) || item.title.match(regexKey))
}

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

const toggleSelection = (albums, selectedId) =>
    albums.map((item) => {
        if (item.id === selectedId) {
            item.selected = !item.selected
        }
        return item
    })
