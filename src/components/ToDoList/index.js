import { connect } from 'react-redux'
import { toDoList, fetchToDoList, updateTask, deleteTask } from '../../store/toDoList'
import ToDoList from './ToDoList'

const mapStateToProps = (state, props) => ({
    toDoList: toDoList(state)
})

export default connect(mapStateToProps, { fetchToDoList, updateTask, deleteTask })(ToDoList)
