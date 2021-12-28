import React, { memo } from 'react'
import { makeStyles, withStyles } from '@material-ui/core/styles'
import TextField from '@material-ui/core/TextField'
import IconButton from '@material-ui/core/IconButton'
import DeleteIcon from '@material-ui/icons/DeleteForeverOutlined'

const useStyles = () =>
    makeStyles((theme) => ({
        root: {
            alignItems: 'flex-start'
        }
    }))

const BlueDeleteIconBtn = withStyles({
    root: {
        //color: '#0084b4',
        color: '#6a0dad',
        position: 'absolute',
        top: 0,
        right: 0,
        cursor: 'pointer',
        zIndex: 5
    }
})(IconButton)

const StyledTextField = withStyles({
    root: {
        '& .MuiInputBase-inputMultiline': {
            paddingTop: '0.4rem',
            marginRight: '0.6rem',
            fontFamily: '"Fuzzy Bubbles", cursive',
            fontSize: '1.2rem'
        }
    }
})(TextField)

const ToDoItem = ({ item, updateSelected, deleteSelected }) => {
    const classes = useStyles()

    const debounce = (func, wait) => {
        let timeoutId = null
        return (...args) => {
            clearTimeout(timeoutId)
            timeoutId = setTimeout(() => {
                func(...args)
            }, wait)
        }
    }

    const handleChange = debounce((event) => {
        updateSelected(item.id, event.target.value)
    }, 250)

    const handleDelete = () => {
        deleteSelected(item.id)
    }

    if (!item || !item.title) return <div />

    // console.log('render item')
    return (
        <div style={{ width: '100%', height: '100%', padding: '20px' }}>
            <BlueDeleteIconBtn aria-label="delete" className={classes.iconButon} onClick={handleDelete}>
                <DeleteIcon />
            </BlueDeleteIconBtn>

            <StyledTextField
                defaultValue={item.title}
                className={classes.textField}
                style={{ width: '100%', height: '100%', overflowY: 'hidden' }}
                //value={item.title}
                multiline
                InputProps={{
                    disableUnderline: true,
                    classes: { root: classes.root }
                }}
                onChange={handleChange}
            />
        </div>
    )
}

const propEqual = (prevProps, nextProps) => {
    return prevProps.item.id === nextProps.item.id && prevProps.item.title === nextProps.item.title
}

const MemorizedToDoItem = memo(ToDoItem, propEqual)

export default MemorizedToDoItem
