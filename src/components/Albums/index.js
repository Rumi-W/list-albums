import { connect } from 'react-redux'
import { albumItems, fetchAlbums } from '../../store/albums'

import Albums from './Albums'

const mapStateToProps = (state, props) => {
    return {
        albumItems: albumItems(state)
    }
}

export default connect(mapStateToProps, { fetchAlbums })(Albums)
