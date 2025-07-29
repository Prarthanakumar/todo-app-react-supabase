import { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import { FaEdit } from "react-icons/fa";
import { AiFillDelete } from "react-icons/ai";
import { v4 as uuidv4 } from 'uuid';

interface TodoItem {
  id: string;
  todo: string;
  isCompleted: boolean;
}

function App() {
  const [todo, setTodo] = useState<string>("");
  const [todos, setTodos] = useState<TodoItem[]>([]);
  const [showFinished, setShowFinished] = useState<boolean>(true);

  useEffect(() => {
    const todoString = localStorage.getItem("todos");
    if (todoString) {
      try {
        const loadedTodos: TodoItem[] = JSON.parse(todoString);
        setTodos(loadedTodos);
      } catch (e) {
        console.error("Failed to parse todos from localStorage:", e);
        setTodos([]);
      }
    }
  }, []);

  const saveToLS = () => {
    localStorage.setItem("todos", JSON.stringify(todos));
  };

  const toggleFinished = () => {
    setShowFinished(!showFinished);
  };

  const handleEdit = (_event: React.MouseEvent<HTMLButtonElement>, id: string) => {
    const t = todos.find(item => item.id === id);
    if (t) {
      setTodo(t.todo);
      const updatedTodos = todos.filter(item => item.id !== id);
      setTodos(updatedTodos);
      saveToLS();
    }
  };

  const handleDelete = (_event: React.MouseEvent<HTMLButtonElement>, id: string) => {
    const updatedTodos = todos.filter(item => item.id !== id);
    setTodos(updatedTodos);
    saveToLS();
  };

  const handleAdd = () => {
    if (todo.trim().length === 0) return;
    const newTodo: TodoItem = { id: uuidv4(), todo: todo.trim(), isCompleted: false };
    const updatedTodos = [...todos, newTodo];
    setTodos(updatedTodos);
    setTodo("");
    localStorage.setItem("todos", JSON.stringify(updatedTodos));
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTodo(e.target.value);
  };

  const handleCheckbox = (e: React.ChangeEvent<HTMLInputElement>) => {
    const id = e.target.name;
    setTodos(prevTodos => {
      const updated = prevTodos.map(item =>
        item.id === id ? { ...item, isCompleted: !item.isCompleted } : item
      );
      localStorage.setItem("todos", JSON.stringify(updated));
      return updated;
    });
  };

  return (
    <>
      <Navbar />
      <div className="mx-3 md:container md:mx-auto my-5 rounded-xl p-5 bg-violet-100 min-h-[80vh] md:w-[35%]">
        <h1 className='font-bold text-center text-3xl'>ZenTask - Manage your todos at one place</h1>

        <div className="addTodo my-5 flex flex-col gap-4">
          <h2 className='text-2xl font-bold'>Add a Todo</h2>
          <div className="flex">
            <input
              onChange={handleChange}
              value={todo}
              type="text"
              className='w-full rounded-full px-5 py-1'
              placeholder="Write your task..."
            />
            <button
              onClick={handleAdd}
              disabled={todo.trim().length <= 3}
              className='bg-violet-800 mx-2 rounded-full hover:bg-violet-950 disabled:bg-violet-500 p-4 py-2 text-sm font-bold text-white'
            >
              Save
            </button>
          </div>
        </div>

        <div className="flex items-center my-4">
          <input id='show' onChange={toggleFinished} type="checkbox" checked={showFinished} />
          <label className='mx-2' htmlFor="show">Show Finished</label>
        </div>

        <div className='h-[1px] bg-black opacity-15 w-[90%] mx-auto my-2'></div>

        <h2 className='text-2xl font-bold'>Your Todos</h2>

        <div className="todos">
          {todos.length === 0 && <div className='m-5'>No Todos to display</div>}
          {todos.map(item => (
            (showFinished || !item.isCompleted) && (
              <div key={item.id} className="todo flex my-3 justify-between">
                <div className='flex gap-5'>
                  <input
                    name={item.id}
                    onChange={handleCheckbox}
                    type="checkbox"
                    checked={item.isCompleted}
                  />
                  <div className={item.isCompleted ? "line-through" : ""}>{item.todo}</div>
                </div>
                <div className="buttons flex h-full">
                  <button
                    onClick={(_event) => handleEdit(_event, item.id)}
                    className='bg-violet-800 hover:bg-violet-950 p-2 py-1 text-sm font-bold text-white rounded-md mx-1'
                  >
                    <FaEdit />
                  </button>
                  <button
                    onClick={(_event) => handleDelete(_event, item.id)}
                    className='bg-violet-800 hover:bg-violet-950 p-2 py-1 text-sm font-bold text-white rounded-md mx-1'
                  >
                    <AiFillDelete />
                  </button>
                </div>
              </div>
            )
          ))}
        </div>
      </div>
    </>
  );
}

export default App;

