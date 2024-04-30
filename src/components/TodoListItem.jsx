import React, { Component } from 'react'
import Button from './common/Button'
import PropTypes from "prop-types"

export class TodoListItem extends Component {
    state = {
        todoInput: this.props.todo.todo,
        canEdit: false
    }
   
  render() {
       const {isDone, todo, _id} = this.props.todo
       const {handleIsDone, handleOnDelete, handleOnEdit} = this.props
    return (
        <div className='todoList-div'>
            {this.state.canEdit ? (
                <input type="text"
                 onChange={(event)=> this.setState({todoInput: event.target.value})}
                 value = {this.state.todoInput}/>
            ) : (
                 <li className="li-style"
                    style={{cursor: 'pointer', textDecoration: isDone ? "line-through" : "none"}} 
                    onClick={() => handleIsDone(_id, !isDone)}> 
                    {todo}
                </li>
            )}
                

            <Button label={this.state.canEdit ? "Save" :  "Edit"}
                    cssClass={this.state.canEdit ?  "done-button" : "edit-button" }
                    clickFunction={this.state.canEdit ? 
                        ()=>{
                            this.setState({canEdit: false}) 
                            handleOnEdit(_id, this.state.todoInput)
                            this.setState({todoInput: this.props.todo.todo})
                        }:
                        ()=>{
                            this.setState({canEdit: true})
                            
                        }}
                    
                    />

            <Button label={"Delete"} 
                    cssClass={"delete-button"} 
                    clickFunction={() =>handleOnDelete(_id)}/>
            {/* <button onClick={()=>handleOnDelete(id)}>Delete</button> */}
        </div>
   
    )
  }
}

//PROPS VALIDATION --> 'handles in place'
TodoListItem.propTypes = {
    todo : PropTypes.object.isRequired,
    handleOnDelete: PropTypes.func.isRequired,
    handleOnEdit: PropTypes.func.isRequired,
    handleIsDone: PropTypes.func.isRequired
}




export default TodoListItem



//to make everything to use down here
    //KYLE'S CODE FOR HANDLING 3 BUTTONS {submit, edit & delete}
    //handleOnEditClick()=>{
    //     if(this.state.canEdit){ //check if text box is up
    //         this.props.handleOnEdit(this.props.todo.id, this.state.todoInput)
    //     }//handle an edit save if text box is up
    //     this.setState({canEdit: !this.state,canEdit}) //toggle button label back
    // }

// {this.state.canEdit ? (
//     <Button
//     label= "Done",
//     cssClass={"done-button"}
//     clickFunction={this.handleOnEditClick}
//     ):

// }


//REMOVING PARAMETERS ON LINE ABOVE TO HELP PREVENT REPETATIVE CODE
//onClick={() => handleOnEdit(_id, {isDone: !isDone})}