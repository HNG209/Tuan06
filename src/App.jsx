import { use, useEffect, useReducer, useRef, useState } from 'react'
import Card from './components/Card'

const ACTIONS = {
  ADD_TODO: 'add-todo',
  TOGGLE_TODO: 'toggle-todo',
  DELETE_TODO: 'delete-todo',
  FETCH_TODO: 'fetch-todo'
}

function reducer(state, action) {
  switch (action.type) {
    case ACTIONS.ADD_TODO:
      return [...state, action.payload]
    case ACTIONS.TOGGLE_TODO:
      console.log('toggle todo')
    case ACTIONS.DELETE_TODO:
      return state.filter(todo => todo.id !== action.payload)
    case ACTIONS.FETCH_TODO:
      return action.payload
    default:
      return state
  }
}

function App() {
  const [todos, dispatch] = useReducer(reducer, [])

  let job = useRef()
  let des = useRef()

  useEffect(() => {
    fetch('https://67da34cd35c87309f52b67a2.mockapi.io/job')
      .then(response => response.json())
      .then(todos => {
        dispatch({ type: ACTIONS.FETCH_TODO, payload: todos })
      }
      )
  }, [])

  async function addTodo(todo) {
    const response = await fetch('https://67da34cd35c87309f52b67a2.mockapi.io/job', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ jobName: todo.name, description: todo.description })
    })

    const data = await response.json()

    dispatch({ type: ACTIONS.ADD_TODO, payload: data })
  }

  async function deleteTodo(id) {
    await fetch(`https://67da34cd35c87309f52b67a2.mockapi.io/job/${id}`, {
      method: 'DELETE'
    })

    dispatch({ type: ACTIONS.DELETE_TODO, payload: id })
  }

  return (
    <>
      <div className='flex flex-row h-screen'>

        <div className='w-1/4 flex flex-col ml-5 pr-5 mt-5 items-center border-r-2'>
          <h1 className='text-3xl font-bold my-5'>Todo App + useReducer</h1>
          <input ref={job} type="text" name="" id="" className='w-full h-10 mx-4 rounded-2xl border-2 border-blue-200 px-2 mt-2' />
          <textarea ref={des} name="" id="" cols="40" rows="20" className='w-full h-20 mx-4 rounded-2xl border-2 border-blue-200 px-2 mt-2'></textarea>
          <button className='bg-green-500 hover:bg-green-700 font-bold text-white rounded-lg w-full h-10 my-3' onClick={() => { addTodo({ name: job.current.value, description: des.current.value }) }}>Add Todo</button>
        </div>
        <div className='w-3/4 overflow-y-auto h-screen'>
          <div className='flex flex-wrap justify-center'>
            {todos.map(todo => {
              return <Card key={todo.id} jobName={todo.jobName} jobDescription={todo.description} id={todo.id} deleteTodo={deleteTodo} />
            })}
          </div>
        </div>
      </div>
    </>
  )
}

export default App
