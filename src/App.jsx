import React, { Component } from 'react'
import Header from './components/Header'
import "./App.css"
import Todo from './components/Todo'

export class App extends Component {
  render() {
    return (
      <div> 
       <Header/>
       <Todo/>
      </div>
    )
  }
}

export default App
