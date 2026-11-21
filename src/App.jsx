import { useState } from 'react'
import { useLocalStorage } from './hooks/useLocalStorage'

const MAX_TODOS = 100

function App() {
  const [todos, setTodos, clearTodos] = useLocalStorage('todos', [])
  const [text, setText] = useState('')
  const [dueDate, setDueDate] = useState('')

  const isFull = todos.length >= MAX_TODOS

  const addTodo = (e) => {
    e.preventDefault()
    const trimmed = text.trim()
    if (!trimmed || isFull) return
    setTodos([...todos, { id: crypto.randomUUID(), text: trimmed, done: false, dueDate }])
    setText('')
    setDueDate('')
  }

  const toggleTodo = (id) =>
    setTodos(todos.map((t) => (t.id === id ? { ...t, done: !t.done } : t)))

  const deleteTodo = (id) => setTodos(todos.filter((t) => t.id !== id))

  const clearDone = () => setTodos(todos.filter((t) => !t.done))

  const clearAll = () => {
    if (window.confirm('すべてのTODOを削除しますか?')) clearTodos()
  }

  const doneCount = todos.length - todos.filter((t) => !t.done).length
  const remaining = todos.filter((t) => !t.done).length

  return (
    <main className="app mx-auto my-12 max-w-md rounded-xl bg-white p-6 shadow">
      <h1 className="mb-4 text-2xl font-bold">TODO</h1>

      <form className="add-form flex gap-2" onSubmit={addTodo}>
        <input
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="やることを入力"
          aria-label="新しいTODO"
          disabled={isFull}
          className="flex-1 rounded-md border border-gray-300 px-3 py-2 disabled:bg-gray-100"
        />
        <input
          type="date"
          value={dueDate}
          onChange={(e) => setDueDate(e.target.value)}
          aria-label="期限日"
          disabled={isFull}
          className="rounded-md border border-gray-300 px-2 py-2 text-sm disabled:bg-gray-100"
        />
        <button
          type="submit"
          disabled={isFull}
          className="rounded-md bg-blue-600 px-3.5 py-2 text-sm text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:bg-blue-300"
        >
          追加
        </button>
      </form>
      {isFull && (
        <p className="limit mt-2 text-sm text-red-600" role="alert">
          TODOは{MAX_TODOS}件までです。不要なTODOを削除してください。
        </p>
      )}

      <ul className="todo-list my-4">
        {todos.map((todo) => (
          <li
            key={todo.id}
            className={`${todo.done ? 'done text-gray-400 line-through' : ''} flex items-center justify-between border-b border-gray-200 py-2`}
          >
            <label className="flex flex-1 cursor-pointer items-center gap-2">
              <input
                type="checkbox"
                checked={todo.done}
                onChange={() => toggleTodo(todo.id)}
              />
              <span>{todo.text}</span>
              {todo.dueDate && <time className="due">期限: {todo.dueDate}</time>}
            </label>
            <button
              type="button"
              className="delete px-2 text-lg text-red-600 hover:text-red-800"
              onClick={() => deleteTodo(todo.id)}
              aria-label={`${todo.text} を削除`}
            >
              ×
            </button>
          </li>
        ))}
      </ul>

      <footer className="footer flex items-center justify-between">
        <p className="count text-sm text-gray-500">残り {remaining} 件</p>
        <div className="actions flex gap-2">
          <button type="button" onClick={clearDone} disabled={doneCount === 0}>
            完了済みを削除
          </button>
          <button type="button" onClick={clearAll} disabled={todos.length === 0}>
            全削除
          </button>
        </div>
      </footer>
    </main>
  )
}

export default App
