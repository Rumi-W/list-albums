import React, { Fragment, useEffect, useState, useCallback } from 'react'
import { Responsive, WidthProvider } from 'react-grid-layout'
import Button from '@material-ui/core/Button'
import { makeStyles } from '@material-ui/core'
import Album from '../Album'

import './styles.css'
import 'react-grid-layout/css/styles.css'
import 'react-resizable/css/styles.css'

const ResponsiveGridLayout = WidthProvider(Responsive)

const useStyles = makeStyles((theme) => ({
    buttonWrap: {
        width: '100%',
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

const ResponsiveGrid = ({ albumItems, savedFavoriteCards, saveFavoriteCardsInOrder }) => {
    const [layout, setLayout] = useState([])
    const [currentBreakpoint, setBreakpoint] = useState(null)
    const [windowWidth, setWindowWidth] = useState(1200)

    const classes = useStyles()

    const getWindowWidth = useCallback(() => {
        return (window && window.innerWidth) || 1200
    }, [])

    const makeLayout = useCallback(() => {
        console.log('****set layout')
        if (albumItems.length === 0) {
            saveFavoriteCardsInOrder([])
        }

        let albumItemsInOrder = []
        if (savedFavoriteCards && savedFavoriteCards.length) {
            savedFavoriteCards.forEach((savedId) => {
                albumItems.forEach((item) => {
                    if (savedId === item.id) {
                        albumItemsInOrder.push(item)
                    }
                })
            })
            const unsavedItems = albumItems.filter((item) => !savedFavoriteCards.includes(item.id))
            albumItemsInOrder = [...albumItemsInOrder, ...unsavedItems]
        }

        const colNum = 3
        const width = 1
        const height = 1
        let albumsLayout = []
        if (albumItemsInOrder.length > 1) {
            albumsLayout = albumItemsInOrder.map((item, index) => {
                // x: 2 grid wide, y: 1 grid tall
                // 4 columns per row
                return {
                    i: item.id,
                    x: (index % colNum) * width,
                    y: Math.floor(index / colNum) * 1,
                    w: width,
                    h: height
                }
            })
        } else {
            albumsLayout = albumItems.map((item, index) => {
                return {
                    i: item.id,
                    x: (index % colNum) * width,
                    y: Math.floor(index / colNum) * 1,
                    w: width,
                    h: height
                }
            })
        }
        const albumLayout = setLayout(albumsLayout)
    }, [albumItems, savedFavoriteCards, saveFavoriteCardsInOrder])

    const updatetGridHeightLookup = () => {
        const heights = {}
        setGridHeightLookup(heights)
    }

    useEffect(() => {
        setWindowWidth(getWindowWidth())
    }, [getWindowWidth])

    useEffect(() => {
        console.log('data change')
        makeLayout()
    }, [makeLayout])

    useEffect(() => {
        const handleResize = () => {
            const width = getWindowWidth()
            if (windowWidth !== width) setWindowWidth(width)
        }
        window.addEventListener('resize', handleResize)
        return () => window.removeEventListener('resize', handleResize)
    }, [getWindowWidth, windowWidth, makeLayout])

    const handleBreakpointChange = (breakpoint) => {
        if (breakpoint !== currentBreakpoint) {
            console.log('breakpoint chnaged')
            setBreakpoint(breakpoint)
        }
    }

    const handleLayoutChange = (currentLayout, allLayout) => {
        console.log('layout changed')
        setLayout([...currentLayout])
    }

    const handleSaveLayout = () => {
        console.log('layout', layout)
        console.log('save', layout)
        const col = 3
        let favoritesInSavedOrder = []

        const yMax = Math.max(...layout.map((item) => item.y))
        console.log('yMax', yMax)

        for (let i = 0; i <= yMax; i++) {
            favoritesInSavedOrder = [
                ...favoritesInSavedOrder,
                ...layout
                    .filter((item) => item.y === i)
                    .sort((a, b) => {
                        return a.x > b.x ? 1 : b.x > a.x ? -1 : 0
                    })
            ]
        }
        favoritesInSavedOrder = favoritesInSavedOrder.map((item, i) => ({ id: item.i, order: i }))
        saveFavoriteCardsInOrder(favoritesInSavedOrder)
    }

    if (!albumItems.length || !layout || !layout.length) return null

    console.log('*** render responsive grids')
    return (
        <Fragment>
            <div className={classes.buttonWrap}>
                <Button
                    size="small"
                    classes={{ outlined: classes.button }}
                    onClick={handleSaveLayout}
                    variant="outlined">
                    Save Order
                </Button>
            </div>
            <ResponsiveGridLayout
                className="layout"
                layouts={{
                    lg: layout,
                    md: layout,
                    sm: layout,
                    xs: layout
                }}
                breakpoints={{ lg: 1200, md: 996, sm: 768, xs: 360 }}
                containerPadding={{ lg: [80, 60], md: [80, 60], sm: [60, 60], xs: [10, 20] }}
                cols={{ lg: 3, md: 3, sm: 3, xs: 3 }}
                resizeHandles={['s']}
                onBreakpointChange={handleBreakpointChange}
                onLayoutChange={handleLayoutChange}>
                {albumItems.map((item, i) => (
                    <div className="contents" key={item.id}>
                        <Album item={item} height={layout[i].h} beakpoint={currentBreakpoint} />
                    </div>
                ))}
            </ResponsiveGridLayout>
        </Fragment>
    )
}

export default ResponsiveGrid
