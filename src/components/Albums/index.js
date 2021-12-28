import { connect } from 'react-redux'
import { albumItems, fetchAlbums, filterAlbums, isAlbumsPending, isAlbumsSuccess } from '../../store/albums'

import Albums from './Albums'

const mapStateToProps = (state) => {
    return {
        albumItems: albumItems(state),
        isAlbumsPending: isAlbumsPending(state),
        isAlbumsSuccess: isAlbumsSuccess(state)
    }
}

// const makeMapStateToProps = () => {
//     const getFilteredAlbums = makeFilteredAlbums()
//     const mapStateToProps = (state, props) => {
//         return {
//             albumItems: albumItems(state),
//             filteredAlbums: getFilteredAlbums(state, props)
//         }
//     }
//     return mapStateToProps
//}

export default connect(mapStateToProps, { fetchAlbums, filterAlbums })(Albums)
