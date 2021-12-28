import React, { Fragment, useEffect, useState, useCallback } from 'react'
import { useMediaQuery } from 'react-responsive'
import { useDispatch } from 'react-redux'
import { Link, useLocation } from 'react-router-dom'
import { FixedSizeList } from 'react-window'
import AutoSizer from 'react-virtualized-auto-sizer'
import { makeStyles } from '@material-ui/core'
import InputBase from '@material-ui/core/InputBase'
import Typography from '@material-ui/core/Typography'
import Hidden from '@material-ui/core/Hidden'
import Grid from '@material-ui/core/Grid'
import Button from '@material-ui/core/Button'
import SearchIcon from '@material-ui/icons/Search'
import CircularProgress from '@material-ui/core/CircularProgress'
import AlbumListItem from '../AlbumListItem'
import AlbumInfo from '../AlbumInfo'
import './styles.css'

const useStyles = makeStyles((theme) => ({
    root: {
        height: '100%',
        paddingTop: theme.spacing(2)
    },
    spinner: {
        width: '100%',
        height: '50vh'
    },
    searchWrap: {
        position: 'relative',
        display: 'flex',
        justifyContent: 'center',
        paddingBottom: theme.spacing(2)
    },
    search: {
        position: 'relative'
    },
    searchIcon: {
        padding: theme.spacing(0, 2),
        height: '100%',
        position: 'absolute',
        pointerEvents: 'none',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        color: '#008fb8',
        zIndex: 4
    },
    inputRoot: {
        borderRadius: '4px',
        color: 'inherit'
    },
    inputInput: {
        zIndex: 2,
        backgroundColor: 'white',
        padding: theme.spacing(1, 1, 1, 0),
        border: '1px solid #008fb8',
        borderRadius: '4px',
        // vertical padding + font size from searchIcon
        paddingLeft: `calc(1em + ${theme.spacing(4)}px)`,
        transition: theme.transitions.create('width'),
        width: '100%',
        '&:hover': {
            borderWidth: '2px'
        },
        [theme.breakpoints.up('md')]: {
            width: '20ch'
        }
    }
}))

const ITEM_HEIGHT = 120

const useQuery = () => new URLSearchParams(useLocation().search)

const Albums = ({ albumItems, fetchAlbums, filterAlbums, isAlbumsPending, isAlbumsSuccess }) => {
    const isScreenLgUp = useMediaQuery({ query: '(min-width: 1280px)' })
    const query = useQuery()
    const classes = useStyles()
    const dispatch = useDispatch()
    const [searchKey, setSearchKey] = useState('')
    const [selectedItem, setSelectedItem] = useState((albumItems && albumItems[0]) || {})
    const [favoriteDisplay, setFavoriteDisplay] = useState(query.get('type') || 'list')

    useEffect(() => {
        if (searchKey === '' && (!albumItems || !albumItems.length)) {
            dispatch(fetchAlbums)
        }
        /* eslint-disable-next-line */
    }, [])

    useEffect(() => {
        if (albumItems && albumItems.length && isScreenLgUp) {
            setSelectedItem((albumItems && albumItems[0]) || {})
        }
    }, [albumItems, isScreenLgUp])

    const showAlbumInfo = useCallback((item) => {
        setSelectedItem(item)
    }, [])

    const Rows = React.memo(({ index, style, ...rest }) => {
        const { id, image, artist, title, link, selected, artistFull, titleFull, price, releaseDate } =
            albumItems[index]

        const item = { id, image, artist, title, link, selected, artistFull, titleFull, price, releaseDate }

        return (
            <div style={{ ...style, width: '100%' }}>
                <AlbumListItem
                    item={item}
                    selected={(selectedItem && selectedItem.id === item.id) || false}
                    maxImgHeight={ITEM_HEIGHT}
                    showAlbumInfo={showAlbumInfo}
                />
            </div>
        )
    })

    const debounce = (fn, wait) => {
        let timeout = null

        return (...args) => {
            clearTimeout(timeout)
            timeout = setTimeout(() => {
                fn(...args)
            }, [wait])
        }
    }

    const handleSearch = debounce((key) => {
        filterAlbums(key)
    }, 250)

    const handleChange = (e) => {
        const key = e.target.value
        setSearchKey(key)
        handleSearch(key)
    }

    const clearFilter = () => {
        setSearchKey('')
        filterAlbums('')
    }

    const mainContent = (
        <div className="fade-in">
            <Grid container justifyContent="center" classes={{ root: classes.root }}>
                <Grid item xs={12}>
                    <div className="page-top-link">
                        <Link className="link" to={`/favorites?type=${favoriteDisplay}`}>
                            Favorite Albums
                        </Link>
                    </div>
                </Grid>
                <Grid item xs={12} className="page-title">
                    <div>
                        <Typography variant="h3" align="center" component="div">
                            Top 100 Albums
                        </Typography>
                        <Typography variant="h6" align="center" color="textSecondary" component="div">
                            List in Virtual Window
                        </Typography>
                    </div>
                </Grid>
                <Grid item xs={12} className={classes.searchWrap}>
                    <div className={classes.search}>
                        <div className={classes.searchIcon}>
                            <SearchIcon />
                        </div>
                        <InputBase
                            placeholder="Search…"
                            onChange={handleChange}
                            value={searchKey}
                            classes={{
                                root: classes.inputRoot,
                                input: classes.inputInput
                            }}
                            inputProps={{ 'aria-label': 'search' }}
                        />
                    </div>
                    <Button size="small" variant="outlined" onClick={clearFilter}>
                        Clear
                    </Button>
                </Grid>
            </Grid>

            <Grid container spacing={4} className="albums-wrap">
                {(!albumItems || !albumItems.length) && (
                    <Grid item xs={12} sm={10} md={8} lg={6} className="albums-list">
                        <Typography variant="h6" align="center">
                            No items
                        </Typography>
                    </Grid>
                )}
                {albumItems && albumItems.length > 0 && (
                    <Fragment>
                        <Grid item xs={12} sm={10} md={8} lg={6} className="albums-list">
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
                        </Grid>

                        <Hidden mdDown>
                            <Grid item lg={4} className="album-info">
                                {selectedItem && selectedItem.artist ? (
                                    <AlbumInfo
                                        image={selectedItem.image}
                                        artistFull={selectedItem.artistFull}
                                        titleFull={selectedItem.titleFull}
                                        price={selectedItem.price}
                                        releaseDate={selectedItem.releaseDate}
                                        link={selectedItem.link}
                                    />
                                ) : (
                                    <div className="album-info-content">
                                        <Typography align="center" gutterBottom variant="h6" component="div">
                                            No item selected
                                        </Typography>
                                    </div>
                                )}
                            </Grid>
                        </Hidden>
                    </Fragment>
                )}
            </Grid>
        </div>
    )
    //console.log('*** render albums')

    return isAlbumsPending && !isAlbumsSuccess ? (
        <Grid container justifyContent="center" alignItems="center" classes={{ root: classes.spinner }}>
            <CircularProgress color="primary" />
        </Grid>
    ) : (
        mainContent
    )
}

export default Albums
