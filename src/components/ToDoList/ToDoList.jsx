import React, { useEffect, useState, useCallback } from 'react'
import { Responsive, WidthProvider } from 'react-grid-layout'
import Grid from '@material-ui/core/Grid'
import Typography from '@material-ui/core/Typography'

import ToDoItem from './ToDoItem'

import './styles.css'
import 'react-grid-layout/css/styles.css'
import 'react-resizable/css/styles.css'

const ResponsiveGridLayout = WidthProvider(Responsive)

const ToDoList = ({ toDoList, fetchToDoList, updateTask, deleteTask }) => {
    const [layout, setLayout] = useState({})
    const [windowWidth, setWindowWidth] = useState(1200)

    const getWindowWidth = useCallback(() => {
        return (window && window.innerWidth) || 1200
    }, [])

    const makeLayout = useCallback(() => {
        console.log('****set layout')
        const colNum = 3
        const width = 1

        setLayout(
            toDoList.map((item, index) => {
                // x: 2 grid wide, y: 1 grid tall
                // 4 columns per row
                return {
                    i: item.id,
                    x: (index % colNum) * width,
                    y: Math.floor(index / colNum) * 1,
                    w: width,
                    h: 1
                }
            })
        )
    }, [toDoList])

    useEffect(() => {
        console.log('onload')
        setWindowWidth(getWindowWidth())
    }, [getWindowWidth])

    useEffect(() => {
        if (!toDoList || !toDoList.length) {
            console.log('fetching')
            fetchToDoList()
        }
    }, [fetchToDoList, toDoList])

    useEffect(() => {
        makeLayout()
    }, [makeLayout, toDoList])

    useEffect(() => {
        const handleResize = () => {
            const width = getWindowWidth()
            if (windowWidth !== width) setWindowWidth(width)
        }
        window.addEventListener('resize', handleResize)
        return () => window.removeEventListener('resize', handleResize)
    }, [getWindowWidth, windowWidth, makeLayout])

    const deleteSelected = useCallback(
        (id) => {
            deleteTask(id)
        },
        [deleteTask]
    )

    const updateSelected = useCallback(
        (id, title) => {
            console.log('update')
            updateTask(id, title)
        },
        [updateTask]
    )

    const handleBreakpointChange = (breakpoint) => {
        console.log(breakpoint)
    }

    if (!toDoList.length || !layout || !layout.length) return <div>No items</div>

    console.log('*** render list')

    return (
        <div className="to-do">
            <Grid item xs={12} className="title-wrap">
                <div>
                    <Typography variant="h3" align="center" component="div">
                        ToDo List
                    </Typography>
                    <Typography variant="h6" align="center" component="div">
                        Editable, Resizable and Repositionable
                    </Typography>
                </div>
            </Grid>
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
                onBreakpointChange={handleBreakpointChange}>
                {toDoList.map((item, i) => (
                    <div className="contents" key={item.id}>
                        <ToDoItem
                            key={item.id}
                            item={item}
                            updateSelected={updateSelected}
                            deleteSelected={deleteSelected}
                        />
                    </div>
                ))}
            </ResponsiveGridLayout>
        </div>
    )
}

export default ToDoList
