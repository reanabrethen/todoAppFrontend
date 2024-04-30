import React, { Component } from 'react'
import {v4 as uuidv4} from 'uuid'
import TodoListItem from './TodoListItem'
import axios from 'axios' //able to make call to the backend; several methods that are types of requests --> axios.get, .post, .put, .delete
import Button from './common/Button'

export class Todo extends Component {
    state = {
        todoInput: "",
        todoList: [],
        error: "",
        sortByNewest: false,   //newest comes last 
        sortByDone: true,    //when it first runs, it will put not done at the top
        includeDoneItems: true 
    }

    async componentDidMount(){ //run as soon as component fully runs in
        const allTodos = await axios.get('http://localhost:3000/todos/get-all-todos')      
        this.setState({todoList: allTodos.data.payload})

    }


    handleTodoOnChange = (event) =>{
        this.setState({
            todoInput: event.target.value
        })
    }

    handleOnSubmit = async (event) =>{
        event.preventDefault()
        // this.checkIfValidTodo(this.state.todoInput)
        if(!this.state.todoInput.length <= 0 && 
            !this.state.todoList.some(item => item.todo === this.state.todoInput)){
                
                const newTodo = await axios.post('http://localhost:3000/todos/create-todo',{todo: this.state.todoInput})
                const newArr = [...this.state.todoList, newTodo.data.payload]
                this.setState({
                    todoList: newArr, 
                    todoInput: "",
                    error: ""
                })
        }else{
            this.setState({error: 'Todo already exsists or input is blank.'})
        }
        //ORGINAL CODE BEFORE USING DATA BASE --> changed all todos to the same todo when saved edit todo
        // const newArr = [...this.state.todoList, {
        //     todo: this.state.todoInput,
        //     isDone: false,
        //     date: Date.now(),
        //     id: uuidv4()
        // }]
        // this.setState({
        //     todoList: newArr,
        //     todoInput: ""
        // })
    }

    handleIsDone = async (id, isDone) => {
        const updatedTodo = await axios.put(`http://localhost:3000/todos/update-todo/${id}`,{isDone: isDone})
        const newArray = this.state.todoList.map((todo)=>{
            if(updatedTodo.data.payload._id === todo._id){
                todo.isDone = updatedTodo.data.payload.isDone
            }
            return todo
        })
        this.setState({
            todoList: newArray
        })
    }

                    //todo array, boolean : true/false
                    //filter function
                    //this.setState --> want to set sorted array as our new.toDoList
    sortByIsDone = async (array) => {
        let sorted;
        if(this.state.sortByDone){
            sorted = array.slice().sort((x, y)=> Number(x.isDone) - Number(y.isDone))
        }else{
            sorted = array.slice().sort((y, x)=> Number(x.isDone) - Number(y.isDone))
        }
        this.setState({
            todoList: sorted,
            sortByDone: !this.state.sortByDone
        })
    }

    //challenge --> will delete opposite from array
    filterByIsDone = (array) =>{
        this.setState({includeDoneItems: !this.state.includeDoneItems})
    }

                    // -1 descending, 1 asscending
                    //idea is to get an array @ the end that will sort dates by when it was added
                    //saving date in UNIX time
    sortByDate = (array) =>{
        let sorted;
        if(!this.state.sortByNewest){ //if always sorts by true --> so w/the not operator, it states if it is NOT TRUE
             sorted = array.slice().sort((y, x) => new Date(x.date) - new Date(y.date))
        }else{
            sorted = array.slice().sort((x, y) => new Date(x.date) - new Date(y.date))
        }
        this.setState({
            todoList: sorted,
            sortByNewest: !this.state.sortByNewest
        })
    }

    //OTHER WAY TO WRITE IN A CLEARER FORM
    // sortByDate = (array) =>{
    //     let sorted;
    //     if(this.state.sortByNewest){ //if always sorts by true --> so w/the not operator, it states if it is NOT TRUE
    //          sorted = array.slice().sort((x, y) => new Date(x.date) - new Date(y.date))
    //     }else{
    //         sorted = array.slice().sort((y, x) => new Date(x.date) - new Date(y.date))
    //     }
    //     this.setState({
    //         todoList: sorted,
    //         sortByNewest: !this.state.sortByNewest
    //     })
    // }


    handleOnDelete = async (id) =>{
        const deleteTodo = await axios.delete(`http://localhost:3000/todos/delete-todo/${id}`)
       
        this.setState({todoList: this.state.todoList.filter(deleteTodo => deleteTodo._id !== id)})
        //response for backend res.json message is deleted todo obj message(sanity check)
        // this.setState({todoList: this.state.todoList.filter(deleteTodo => deleteTodo._id !== deletedTodo.data.payload._id)})
    }

    handleOnEdit = async (id, text) =>{
        if(!text.length <= 0 && 
            !this.state.todoList.some(item => item.todo === text.todo)){
       
                const updateTodo = await axios.put(`http://localhost:3000/todos/update-todo/${id}`, {todo: text} ) 
                const newArr = this.state.todoList.map(item =>{
                //map through looking for todo obj; sanity checks line 70; repsonse from backend is the response we just edited
                 if(item._id === updateTodo.data.payload._id){
                    //when found, edit the todo
                    item.todo = updateTodo.data.payload.todo
                    } 
                //return new todo to list
                return item
            })
        //save list as the new state
        this.setState({
            todoList: newArr,
            error: ""
        })
    }else{
        this.setState({error: "This is not a valid todo."})
    }
}
    //same endpoint handleIsDone & handleOnEdit --> axios.put(http://localhost:3000/todos/update-todo/:id)
    //body will reflect what you are editing
    //todo or isDone property 
    //template literals

    //can call wherever we want to do a validation check as it is not checking backend
    //can promisify it the await it, but cleaner code is to do it inline
    // checkIfValidTodo = async (todo)=>{
    //     if(todo.length <= 0){
    //         this.setState({error: 'Todo must have content.'})
    //     }else if(this.state.todoList.some(item => item.todo === todo)){
    //         this.setState({error: "Todo must be unique."})
    //     }else{
    //         this.setState({error: ""})
    //     }
    // }

  render() {
    return (
      <div>
        <p className='error'>{this.state.error}</p>
        <div className='form-div'>
            <form onSubmit={this.handleOnSubmit}>
                <input name="todoInput" 
                       type="text" 
                       value = {this.state.todoInput} 
                       onChange={this.handleTodoOnChange}
                       autoFocus
                />
                <button type="submit">Submit</button>
            </form>
        </div>
        <div className='sorting'>
            <ul>
                <li>
                    <Button
                        label={'Sort by Date'}
                        clickFunction={()=>this.sortByDate(this.state.todoList)}
                        cssClass={'sort-button'}
                        />
                </li>
                <li>
                    <Button
                        label={'Sort by Done'}
                        clickFunction={()=>this.sortByIsDone(this.state.todoList)}
                        cssClass={'sort-button'}
                        />
                </li>
                <li>
                    <Button
                        label={'Filter By Done'}
                        clickFunction={this.filterByIsDone}
                        cssClass={'sort-button'}
                        />
                </li>
            </ul>
        </div>
        <div className='todo-div'>
            <ul>
                {this.state.todoList.filter(item => {
                    if(this.state.includeDoneItems){ //filter returns a copy of the arr w/all the items filtered out
                        //straight pass through
                        return true
                    }else{
                        //return only those items where isDone is false
                        //if include done items is false
                        return !item.isDone //if it is not done, then return it as true
                    }
                    //map as usual with the new filtered array
                }).map((item) => {
                    return (
                        <TodoListItem 
                            key={item._id} 
                            todo = {item}
                            handleIsDone = {this.handleIsDone}
                            handleOnDelete = {this.handleOnDelete}
                            handleOnEdit = {this.handleOnEdit}
                            />
            //             <li key={item.date}
            //                 style={{textDecoration: item.isDone ? "line-through" : "none"}}
            //                 onClick={()=>{this.handleIsDone(item)}}>{item.todo}</li>
                    )
                })}
                  
            </ul> 
        </div>
      </div>
  )}
  
}

export default Todo


//UPDATED ON EDIT TO PREVENT REPETATIVE CODE
  // handleOnEdit = async (id, updatedObj) =>{
    //    const updateTodo = await axios.put(`http://localhost:3000/todos/update-todo/${id}`, updatedObj ) 
    //    const newArr = this.state.todoList.map(item =>{
    //     //map through looking for todo obj; sanity checks line 70; repsonse from backend is the response we just edited
    //         if(item._id === updateTodo.data.payload._id){
    //             //when found, edit the todo
    //            const key = Object.keys(updatedObj)[0]
    //             grab whatever key has been fed
    
    // {isDone, todo} = updatedObj can destructure this way as well 
    //             // updatedObj === {"todo: "sdkhfsj}
    //             item[key] = updatedTodo.data.payload[key]
                    //edit the arr to refelct the chnage
    //         } 
    //         //return new todo to list
    //         return item
    //     })
    //     //save list as the new state
    //     this.setState({todoList: newArr})
    // }