import React, { Fragment, useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd'
import { makeStyles } from '@material-ui/core'
import Typography from '@material-ui/core/Typography'
import Button from '@material-ui/core/Button'
import Grid from '@material-ui/core/Grid'
import AlbumListItem from '../AlbumListItem'
import ResponsiveGrid from '../ResponsiveGrid'
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
        borderColor: 'red',
        color: 'red',
        '&:hover': {
            backgroundColor: 'rgba(255, 0, 0, 0.1)'
        }
    }
}))

const ITEM_HEIGHT = 120

const FavoriteItem = ({ item, index }) => {
    return (
        <Draggable draggableId={item.id} index={index}>
            {(provided) => (
                <div ref={provided.innerRef} {...provided.draggableProps} {...provided.dragHandleProps}>
                    <AlbumListItem item={item} maxImgHeight={ITEM_HEIGHT} />
                </div>
            )}
        </Draggable>
    )
}
const FavoriteAlbums = ({ favoriteAlbums, replaceFavoriteAlbums }) => {
    const [favorites, setFavorites] = useState([...favoriteAlbums])
    const [isCardMode, setIsCardMode] = useState(true)

    const classes = useStyles()

    useEffect(() => {
        console.log('getting favorites')
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

    const ItemList = React.memo(({ items }) => {
        return items.map((item, index) => <FavoriteItem item={item} key={item.id} index={index} />)
    })

    const onDragEnd = (results) => {
        if (!results.destination) return
        if (results.destination.index === results.source.index) return
        const reordered = reorder(results.source.index, results.destination.index)
        setFavorites(reordered)
    }

    console.log('*** render favoriteAlbums')
    return (
        <div className="fade-in">
            <Grid container justifyContent="center" classes={{ root: classes.root }}>
                <Grid item sm={12} xs={12}>
                    <div className="page-top-link">
                        <Link className="link" to="/">
                            All Albums
                        </Link>
                    </div>
                </Grid>
                <Grid item sm={12} xs={12} className="page-title">
                    <div>
                        <Typography variant="h3" align="center" component="div">
                            Favorite Albums
                        </Typography>
                        <Typography variant="subtitle1" align="center" component="div">
                            Draggable List Items
                        </Typography>
                    </div>
                </Grid>
                {!favorites ||
                    (!favorites.length && (
                        <Grid item sm={12} className="albums-wrap">
                            <div className="albums">No Albums Selected</div>
                        </Grid>
                    ))}
                {isCardMode ? (
                    <div className="album-cards-wrap">
                        <ResponsiveGrid albumItems={favorites} />
                    </div>
                ) : (
                    <Fragment>
                        <div className={classes.buttonWrap}>
                            <Button
                                size="small"
                                classes={{ outlined: classes.button }}
                                onClick={handleSaveOrder}
                                variant="outlined">
                                Save Order
                            </Button>
                        </div>
                        <div className="albums-wrap">
                            <div className="albums-list">
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
                            </div>
                        </div>
                    </Fragment>
                )}
            </Grid>
        </div>
    )
}

export default FavoriteAlbums
