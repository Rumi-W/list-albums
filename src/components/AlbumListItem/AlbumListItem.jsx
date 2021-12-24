import React, { useState, useCallback } from 'react'
import Grid from '@material-ui/core/Grid'
import Card from '@material-ui/core/Card'
import CardMedia from '@material-ui/core/CardMedia'
import CardActions from '@material-ui/core/CardActions'
import CardContent from '@material-ui/core/CardContent'
import IconButton from '@material-ui/core/IconButton'
import HeartIcon from '@material-ui/icons/FavoriteBorder'
import HeartIconFilled from '@material-ui/icons/Favorite'
import Typography from '@material-ui/core/Typography'
import { makeStyles } from '@material-ui/core'
import AlbumModal from '../AlbumModal'

const useStyles = makeStyles((theme) => ({
    listItemWrap: {
        height: '97%',
        width: '100%'
    },
    contentWrap: {
        height: '100%',
        width: '100%',
        display: 'flex ',
        flexDirection: 'row'
    },
    root: {
        padding: 0,
        width: '100%',
        height: '100%',
        border: '1px #e2e2e2 solid',
        boxShadow: 'none',
        borderRadius: 0,
        '&:hover': {
            backgroundColor: '#f2f2f2'
        },
        '&:focus, &:active': {
            boxShadow: 'rgba(0, 0, 0, 0.24) 0px 3px 8px',
            backgroundColor: '#e2e2e2',
            webkitTransform: 'scale(0.99)',
            mozTtransform: 'scale(0.99)',
            oTransform: 'scale(0.99)',
            transform: 'scale(0.99)'
        }
    },
    contentWrapInner: {
        height: '100%',
        display: 'flex ',
        flexDirection: 'row'
    },
    media: {
        width: '100%'
    },
    content: {
        display: 'flex',
        flexDirection: 'column',
        padding: theme.spacing(0, 2),

        textOverflow: 'ellipsis',
        [theme.breakpoints.only('xs')]: {
            display: 'flex ',
            flexDirection: 'column',
            width: '100%',
            height: '70%'
        }
    },
    albumTitle: {
        fontWeight: 700,
        fontSize: '1.2rem',
        [theme.breakpoints.only('xs')]: {
            fontSize: '0.9rem'
        }
    },
    link: {
        display: 'block',
        [theme.breakpoints.only('xs')]: {
            display: 'none'
        }
    },
    action: {
        height: '100%',
        display: 'flex',
        justifyContent: 'space-around',
        alignItems: 'flex-start',
        [theme.breakpoints.only('xs')]: {
            paddingRight: theme.spacing(2)
        }
    },
    icon: {
        padding: 0
    },
    heartIconFilled: {
        color: 'red'
    }
}))

const AlbumListItem = ({ item, maxImgHeight, toggleFavorite, addFavoriteAlbum, removeFavoriteAlbum }) => {
    const classes = useStyles()
    const [openModal, setOpenModal] = useState(false)

    const handleClickFavorite = useCallback(() => {
        if (item.id === '') return
        if (item.selected) {
            removeFavoriteAlbum(item.id)
        } else {
            const itemCopy = { ...item }
            itemCopy.selected = true
            addFavoriteAlbum(itemCopy)
        }
        toggleFavorite(item.id)
    }, [removeFavoriteAlbum, addFavoriteAlbum, toggleFavorite, item])

    const toggleModal = () => {
        setOpenModal((prev) => !prev)
    }

    console.log('*** render album list item')
    return (
        <div className={classes.listItemWrap}>
            <Card className={classes.root} onClick={toggleModal}>
                <Grid container className={classes.contentWrap}>
                    <Grid item xs={10} sm={9} className={classes.contentWrapInner}>
                        <CardMedia
                            className={classes.media}
                            style={{ height: maxImgHeight, width: maxImgHeight }}
                            component="img"
                            alt="Cover Image"
                            title="Cover Image"
                            image={item.image}
                        />
                        <CardContent classes={{ root: classes.content }}>
                            <Typography className={classes.albumTitle} variant="caption">
                                {item.artist}
                            </Typography>
                            <Typography variant="caption">{item.title}</Typography>
                        </CardContent>
                    </Grid>

                    <Grid item xs={2} sm={3}>
                        <CardActions className={classes.action}>
                            <a
                                href={item.link}
                                className={classes.link}
                                target="_blank"
                                size="small"
                                color="primary"
                                rel="noreferrer">
                                <Typography variant="caption">Go to Music </Typography>
                            </a>
                            <IconButton className={classes.icon} onClick={handleClickFavorite}>
                                {item.selected ? (
                                    <HeartIconFilled className={classes.heartIconFilled} />
                                ) : (
                                    <HeartIcon />
                                )}
                            </IconButton>
                        </CardActions>
                    </Grid>
                </Grid>
            </Card>
            {openModal && (
                <AlbumModal
                    openModal={openModal}
                    id={item.id}
                    image={item.image}
                    link={item.link}
                    selected={item.selected}
                    artistFull={item.artistFull}
                    titleFull={item.titleFull}
                    price={item.price}
                    releaseDate={item.releaseDate}
                    toggleModal={toggleModal}
                    handleClickFavorite={handleClickFavorite}
                />
            )}
        </div>
    )
}

export default AlbumListItem
