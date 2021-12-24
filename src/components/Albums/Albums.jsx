import React, { useEffect, useState } from 'react'
import { useDispatch } from 'react-redux'
import { Link } from 'react-router-dom'
import { FixedSizeList } from 'react-window'
import AutoSizer from 'react-virtualized-auto-sizer'
import { makeStyles } from '@material-ui/core'
import Typography from '@material-ui/core/Typography'
import Grid from '@material-ui/core/Grid'
import AlbumListItem from '../AlbumListItem'
import ResponsiveGrid from '../ResponsiveGrid'
import './styles.css'

const useStyles = makeStyles((theme) => ({
    root: {
        height: '100%',
        paddingTop: theme.spacing(2)
    }
}))

const ITEM_HEIGHT = 120

const Albums = ({ albumItems, fetchAlbums }) => {
    const classes = useStyles()
    const dispatch = useDispatch()
    const [isCardMode, setIsCardMode] = useState(false)

    useEffect(() => {
        if (!albumItems || !albumItems.length) {
            console.log('fetching')
            dispatch(fetchAlbums)
        }
    }, [dispatch, fetchAlbums, albumItems])

    const Rows = React.memo(({ index, style, ...rest }) => {
        const { id, image, artist, title, link, selected, artistFull, titleFull, price, releaseDate } =
            albumItems[index]

        const item = { id, image, artist, title, link, selected, artistFull, titleFull, price, releaseDate }

        return (
            <div style={{ ...style, width: '100%' }}>
                <AlbumListItem item={item} maxImgHeight={ITEM_HEIGHT} />
            </div>
        )
    })

    if (!albumItems || !albumItems.length) return null

    console.log('*** render albums')
    return (
        <div className="fade-in">
            <Grid container justifyContent="center" classes={{ root: classes.root }}>
                {!isCardMode && (
                    <Grid item sm={12} xs={12}>
                        <div className="page-top-link">
                            <Link className="link" to="/myalbums">
                                Favorite Albums
                            </Link>
                        </div>
                    </Grid>
                )}
                <Grid item sm={12} xs={12} className="page-title">
                    <div>
                        <Typography variant="h3" align="center" component="div">
                            Top 100 Albums
                        </Typography>
                        {!isCardMode ? (
                            <Typography variant="subtitle1" align="center" component="div">
                                List in Virtual Window
                            </Typography>
                        ) : (
                            <Typography variant="subtitle1" align="center" component="div">
                                Resizable and Repositionable
                            </Typography>
                        )}
                    </div>
                </Grid>
                {!isCardMode ? (
                    <div className="albums-wrap">
                        <div className="albums-list">
                            <AutoSizer>
                                {({ height, width }) => (
                                    <FixedSizeList
                                        className="List"
                                        height={height}
                                        itemCount={albumItems.length}
                                        itemSize={ITEM_HEIGHT}
                                        width={width}>
                                        {Rows}
                                    </FixedSizeList>
                                )}
                            </AutoSizer>
                        </div>
                    </div>
                ) : (
                    <div className="album-cards-wrap">
                        <ResponsiveGrid albumItems={albumItems} />
                    </div>
                )}
            </Grid>
        </div>
    )
}

export default Albums
