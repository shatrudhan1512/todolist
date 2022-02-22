import { useState } from "react";
import './toDoList.css'

export function ToDoList() {

    const [toDoList, setToDoList] = useState([])
    const [value, setValue] = useState("")
    const [editValue, setEditValue] = useState("")
    const [deletedList, setDeletedList] = useState([]) 

    function addTaskList() {
        if (!value)
            return

        let addTask = { 
            id: Date.now(),
            task: value,
            isCompleted: false,
            saveUndoData: false,
            editing: false,
            isDeleted: false,
            isUndo: false,
            isRedo:false, 
            undo:[],
            redo:[]
        }
        setToDoList([...toDoList, addTask])
        setValue("")
    }
    function onChnageHandle(event) {
        setValue((event.target.value).trim())
    }
    function editOnChnageHandle(event) {
        setEditValue((event.target.value).trim())

    }
    function completeTask(id) {
        let cmtTask = toDoList.find(element => element.id === id)
        cmtTask.isCompleted = true
        setToDoList([...toDoList])
    }
    function removeTask(id) {

        setToDoList(toDoList.filter(element => element.id !== id))
        const remove = toDoList.find(element => element.id === id)
        remove.isDeleted = true
        setDeletedList([...deletedList, remove])
    }
    function editTask(id) {
        let editTask = toDoList.find(element => element.id === id)
        if(!editTask.isCompleted) {
            editTask.editing = true
            editTask.isUndo = false
            editTask.isRedo = false
           editTask.undo.push(editTask.task)
            setToDoList([...toDoList])
        }
       
    }
    function saveTask(id) {
        
        let editTask = toDoList.find(element => element.id === id)
        editTask.editing = false
        editTask.isUndo = true
        editTask.task = editValue
        editTask.isRedo = true
        setToDoList([...toDoList])  

    }
    function undoTask(id) {
        const undoData = toDoList.find(element => element.id === id)
        
        if(undoData.undo.length >0) {
            const lastElement = undoData.undo.pop()
            undoData.redo.push((undoData.task))
            undoData.task = lastElement
            setToDoList([...toDoList])
        }
    }

    function redoTask(id){
        const redoData = toDoList.find(element => element.id === id)
        if(redoData.redo.length >0) {
            const lastElement = redoData.redo.pop()
            redoData.undo.push((redoData.task))
            redoData.task = lastElement
            setToDoList([...toDoList])
        }
    }
    

    function deletedUndoTask(id) {
        const undoTask = deletedList.find(element => element.id === id)
        undoTask.isDeleted = false
        setToDoList([...toDoList, undoTask])
        deletedList.splice(deletedList.indexOf(undoTask), 1)
        setDeletedList([...deletedList])
    }
    return (
        <body >
        
            <div className="container" >
                <h1>New To DO List</h1>

                <h2>{`Pending Task (${toDoList.filter(element => !element.isCompleted).length})`}</h2>


                {toDoList.map(toDoElement =>
                    <div className="divContainer">
                        {toDoElement.editing ? <input type='text' className="editTaskInp" onChange={editOnChnageHandle} /> :
                         <span id='spanId' contentEditable={toDoElement.editing} style={{ textDecoration: toDoElement.isCompleted ? 'line-through' : '' }} >{toDoElement.task}</span>}
                       
                        <button className="btnComplete" onClick={() => completeTask(toDoElement.id)}>Complete</button>
                        <button className="btnX" onClick={() => removeTask(toDoElement.id)}>x</button>
                        <button className="btnEdit" onClick={() => editTask(toDoElement.id)}>edit</button>

                        {toDoElement.editing && <button className="saveBtn" onClick={() => saveTask(toDoElement.id)}>Save</button>}
                        {toDoElement.isUndo && <button className="btnUndo" onClick={() => undoTask(toDoElement.id)}>Undo</button>}
                        {toDoElement.isRedo && <button className="btnRedo" onClick={() => redoTask(toDoElement.id)}>Redo</button>}

                    </div>)
                }

                <div className="inpDiv">
                    <input type='text' className="addTaskInp" value={value} placeholder="Add a New Task" onChange={onChnageHandle} />
                    <button className="addTaskBtn" onClick={addTaskList}>Add List</button>


                </div>

            </div>
            <div className="delTaskContainer">
            <h1>Trash</h1>
                {deletedList.map(deletedElement =>
                    <div className="delTask" >   
                        {deletedElement.isDeleted && <span id="delSpanId">{deletedElement.task}</span>}
                        {deletedElement.isDeleted && <button className="undoBtn" onClick={() => deletedUndoTask(deletedElement.id)}>undo</button>}
                    </div>
                )}
            </div>
        </body>
    )
}