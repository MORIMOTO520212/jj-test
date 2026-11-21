import { useState } from 'react'

const MAX_TODOS = 100

function App() {
  const [todos, setTodos] = useState([])
  const [text, setText] = useState('')

  const isFull = todos.length >= MAX_TODOS

  const addTodo = (e) => {
    e.preventDefault()
    const trimmed = text.trim()
    if (!trimmed || isFull) return
    setTodos([...todos, { id: crypto.randomUUID(), text: trimmed, done: false }])
    setText('')
  }

  const toggleTodo = (id) =>
    setTodos(todos.map((t) => (t.id === id ? { ...t, done: !t.done } : t)))

  const deleteTodo = (id) => setTodos(todos.filter((t) => t.id !== id))

  const remaining = todos.filter((t) => !t.done).length

  return (
    <main className="app">
      <h1>TODO</h1>

      <form className="add-form" onSubmit={addTodo}>
        <input
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="やることを入力"
          aria-label="新しいTODO"
          disabled={isFull}
        />
        <button type="submit" disabled={isFull}>
          追加
        </button>
      </form>
      {isFull && (
        <p className="limit" role="alert">
          TODOは{MAX_TODOS}件までです。不要なTODOを削除してください。
        </p>
      )}

      <ul className="todo-list">
        {todos.map((todo) => (
          <li key={todo.id} className={todo.done ? 'done' : ''}>
            <label>
              <input
                type="checkbox"
                checked={todo.done}
                onChange={() => toggleTodo(todo.id)}
              />
              <span>{todo.text}</span>
            </label>
            <button
              type="button"
              className="delete"
              onClick={() => deleteTodo(todo.id)}
              aria-label={`${todo.text} を削除`}
            >
              ×
            </button>
          </li>
        ))}
      </ul>

      <p className="count">残り {remaining} 件</p>
    </main>
  )
}

export default App
