import { connect } from 'react-redux'
import { allFavoriteAlbums } from '../../store/albums'
import { favoriteAlbums, replaceFavoriteAlbums } from '../../store/favoriteAlbums'
//import { savedFavoriteCards, saveFavoriteCardsInOrder } from '../../store/savedFavoriteAblumCards'
import FavoriteAlbums from './FavoriteAlbums'

const mapStateToProps = (state, props) => ({
    favoriteAlbums: favoriteAlbums(state),
    allFavoriteAlbums: allFavoriteAlbums(state)
    // savedFavoriteCards: savedFavoriteCards(state)
})

export default connect(mapStateToProps, { replaceFavoriteAlbums })(FavoriteAlbums)
