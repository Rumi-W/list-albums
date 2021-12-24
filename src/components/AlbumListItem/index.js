import { connect } from 'react-redux'
import { toggleFavorite } from '../../store/albums'
import { addFavoriteAlbum, removeFavoriteAlbum } from '../../store/favoriteAlbums'
import AlbumListItem from './AlbumListItem'

export default connect(null, { toggleFavorite, addFavoriteAlbum, removeFavoriteAlbum })(AlbumListItem)
