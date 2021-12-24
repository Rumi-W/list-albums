import { connect } from 'react-redux'
import { toggleFavorite } from '../../store/albums'
import { addFavoriteAlbum, removeFavoriteAlbum } from '../../store/favoriteAlbums'
import Album from './Album'

export default connect(null, { toggleFavorite, addFavoriteAlbum, removeFavoriteAlbum })(Album)
