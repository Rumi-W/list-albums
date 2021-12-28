import React, { useState, useEffect, useCallback } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd'
import { makeStyles } from '@material-ui/core'
import Typography from '@material-ui/core/Typography'
import Button from '@material-ui/core/Button'
import Grid from '@material-ui/core/Grid'
import Hidden from '@material-ui/core/Hidden'
import AlbumListItem from '../AlbumListItem'
import ResponsiveGrid from '../ResponsiveGrid'
import AlbumInfo from '../AlbumInfo'
import '../Albums/styles.css'

const useStyles = makeStyles((theme) => ({
    root: {
        height: '100%',
        paddingTop: theme.spacing(2)
    },
    buttonWrap: {
        width: '40vw',
        display: 'flex',
        justifyContent: 'center'
    },
    button: {
        marginTop: theme.spacing(2),
        borderColor: 'rgb(216, 155, 24)',
        color: 'rgb(241, 140, 8)',
        margin: theme.spacing(0, 0.5),
        '&:hover': {
            backgroundColor: 'rgba(241, 140, 8, 0.1)'
        }
    }
}))

const ITEM_HEIGHT = 120

const useQuery = () => new URLSearchParams(useLocation().search)

const FavoriteAlbums = ({ favoriteAlbums, replaceFavoriteAlbums }) => {
    const query = useQuery()
    const [favorites, setFavorites] = useState([...favoriteAlbums])
    const [isCardMode, setIsCardMode] = useState(query.get('type') === 'card')
    const [selectedItem, setSelectedItem] = useState((favoriteAlbums && favoriteAlbums[0]) || {})

    const classes = useStyles()

    useEffect(() => {
        setFavorites([...favoriteAlbums])
    }, [favoriteAlbums])

    const reorder = (sourceIndex, destIndex) => {
        const array = [...favorites]
        const [removed] = array.splice(sourceIndex, 1)
        array.splice(destIndex, 0, removed)
        return array
    }

    const handleSaveOrder = () => {
        const IDs1 = favoriteAlbums.map((item) => item.id)
        const IDs2 = favorites.map((item) => item.id)

        // No updates
        if (IDs1.toString() === IDs2.toString()) return
        replaceFavoriteAlbums(favorites)
    }

    const showAlbumInfo = useCallback((item) => {
        setSelectedItem(item)
    }, [])

    const ItemList = React.memo(({ items }) => {
        return items.map((item, index) => (
            <Draggable draggableId={item.id} index={index} key={item.id}>
                {(provided) => (
                    <div ref={provided.innerRef} {...provided.draggableProps} {...provided.dragHandleProps}>
                        <AlbumListItem
                            item={item}
                            selected={(selectedItem && selectedItem.id === item.id) || false}
                            maxImgHeight={ITEM_HEIGHT}
                            showAlbumInfo={showAlbumInfo}
                        />
                    </div>
                )}
            </Draggable>
        ))
    })

    const onDragEnd = (results) => {
        if (!results.destination) return
        if (results.destination.index === results.source.index) return
        const reordered = reorder(results.source.index, results.destination.index)
        setFavorites(reordered)
    }

    const toggleDisplayType = () => {
        setIsCardMode((prev) => !prev)
    }

    const toggleDisplayButton = (
        <Button size="small" classes={{ outlined: classes.button }} onClick={toggleDisplayType} variant="outlined">
            {`Display in ${isCardMode ? 'List' : 'Cards'}`}
        </Button>
    )

    //console.log('*** render favorites')
    return (
        <div className="fade-in">
            <Grid container justifyContent="center" classes={{ root: classes.root }}>
                <Grid item sm={12} xs={12}>
                    <div className="page-top-link">
                        <Link className="link" to={`/?type=${isCardMode ? 'card' : 'list'}`}>
                            All Albums
                        </Link>
                    </div>
                </Grid>
                <Grid item xs={12} className="page-title">
                    <div>
                        <Typography variant="h3" align="center" component="div">
                            Favorite Albums
                        </Typography>
                        <Typography variant="h6" align="center" color="textSecondary" component="div">
                            {isCardMode ? 'Draggable and Resizable Cards' : 'Draggable List Items'}
                        </Typography>
                    </div>
                </Grid>
                {!favorites || !favorites.length ? (
                    <Grid item sm={12} className="albums-wrap">
                        <div className="albums">No favorite albums selected</div>
                    </Grid>
                ) : isCardMode ? (
                    <div className="album-cards-wrap">
                        <ResponsiveGrid albumItems={favorites}>{toggleDisplayButton}</ResponsiveGrid>
                    </div>
                ) : (
                    <Grid container spacing={4} className="albums-wrap">
                        <div className={classes.buttonWrap}>
                            {toggleDisplayButton}
                            <Button
                                size="small"
                                classes={{ outlined: classes.button }}
                                onClick={handleSaveOrder}
                                variant="outlined">
                                Save List Order
                            </Button>
                        </div>
                        <div className="albums-wrap">
                            <Grid item xs={12} sm={10} md={8} lg={6} className="albums-list">
                                <DragDropContext onDragEnd={onDragEnd}>
                                    <Droppable droppableId="list">
                                        {(provided) => (
                                            <div ref={provided.innerRef} {...provided.droppableProps}>
                                                <ItemList items={favorites} />
                                                {provided.placeholder}
                                            </div>
                                        )}
                                    </Droppable>
                                </DragDropContext>
                            </Grid>

                            <Hidden mdDown>
                                {selectedItem && selectedItem.artist ? (
                                    <Grid item lg={4} className="album-info">
                                        <AlbumInfo
                                            image={selectedItem.image}
                                            artistFull={selectedItem.artistFull}
                                            titleFull={selectedItem.titleFull}
                                            price={selectedItem.price}
                                            releaseDate={selectedItem.releaseDate}
                                            link={selectedItem.link}
                                        />
                                    </Grid>
                                ) : (
                                    <div className="album-info-content">
                                        <Typography align="center" gutterBottom variant="h6" component="div">
                                            No item selected
                                        </Typography>
                                    </div>
                                )}
                            </Hidden>
                        </div>
                    </Grid>
                )}
            </Grid>
        </div>
    )
}

export default FavoriteAlbums
