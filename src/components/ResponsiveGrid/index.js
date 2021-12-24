import { connect } from 'react-redux'
import { savedFavoriteCards, saveFavoriteCardsInOrder } from '../../store/savedFavoriteAblumCards'
import ResponsiveGrid from './ResponsiveGrid'

const mapStateToProps = (state, props) => ({
    savedFavoriteCards: savedFavoriteCards(state)
})
export default connect(mapStateToProps, { saveFavoriteCardsInOrder })(ResponsiveGrid)
