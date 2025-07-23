import { useState, useEffect } from 'react'; // Importing 'React' itself is often not needed with modern JSX transform
import Navbar from './components/Navbar';
import { FaEdit } from "react-icons/fa";
import { AiFillDelete } from "react-icons/ai";
import { v4 as uuidv4 } from 'uuid';
// import { supabase } from '../src/supabaseClient'; // This line was causing an 'unused' error. Uncomment and use if integrating Supabase.

// FIX 1: Define an interface for your Todo item
// This tells TypeScript the expected structure of objects in your 'todos' array.
interface TodoItem {
  id: string;
  todo: string;
  isCompleted: boolean;
}

function App() {
  // FIX 2: Explicitly type your useState hooks
  const [todo, setTodo] = useState<string>("");
  const [todos, setTodos] = useState<TodoItem[]>([]); // Array of TodoItem objects
  const [showFinished, setshowFinished] = useState<boolean>(true);

  useEffect(() => {
    let todoString = localStorage.getItem("todos");
    // FIX 3: Handle the 'null' case for localStorage.getItem()
    if (todoString) {
      // Parse the string and explicitly cast it to the correct type
      try {
        let loadedTodos: TodoItem[] = JSON.parse(todoString);
        setTodos(loadedTodos);
      } catch (e) {
        console.error("Failed to parse todos from localStorage:", e);
        // Fallback to empty array if parsing fails
        setTodos([]);
      }
    }
  }, []); // Empty dependency array means this effect runs only once on mount

  // FIX 4: Removed 'params' as it was unused and caused an implicit 'any' error.
  // This function saves the current 'todos' state to localStorage.
  const saveToLS = () => {
    localStorage.setItem("todos", JSON.stringify(todos));
  };

  // FIX 5: Explicitly type the event parameter 'e'
  const toggleFinished = (e: React.ChangeEvent<HTMLInputElement>) => {
    setshowFinished(!showFinished);
  };

  // FIX 6: Explicitly type event parameter 'e' and 'id'
  const handleEdit = (e: React.MouseEvent<HTMLButtonElement>, id: string) => {
    let t = todos.filter(i => i.id === id);
    if (t.length > 0) { // Safety check to ensure item exists before accessing
      setTodo(t[0].todo);
    }
    let newTodos = todos.filter(item => {
      return item.id !== id;
    });
    setTodos(newTodos);
    saveToLS(); // Call saveToLS after state update to persist changes
  };

  // FIX 7: Explicitly type event parameter 'e' and 'id'
  const handleDelete = (e: React.MouseEvent<HTMLButtonElement>, id: string) => {
    let newTodos = todos.filter(item => {
      return item.id !== id;
    });
    setTodos(newTodos);
    saveToLS(); // Call saveToLS after state update
  };

  const handleAdd = () => {
    // Basic validation: Don't add empty or whitespace-only todos
    if (todo.trim().length === 0) {
      return;
    }
    setTodos([...todos, { id: uuidv4(), todo: todo.trim(), isCompleted: false }]);
    setTodo("");
    saveToLS(); // Call saveToLS after state update
  };

  // FIX 8: Explicitly type event parameter 'e'
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTodo(e.target.value);
  };

  // FIX 9: Explicitly type event parameter 'e'
  const handleCheckbox = (e: React.ChangeEvent<HTMLInputElement>) => {
    let id = e.target.name;
    let index = todos.findIndex(item => {
      return item.id === id;
    });
    if (index !== -1) { // Safety check to ensure item is found
      let newTodos = [...todos];
      newTodos[index].isCompleted = !newTodos[index].isCompleted;
      setTodos(newTodos);
      saveToLS(); // Call saveToLS after state update
    }
  };

  return (
    <>
      {/* Assuming Navbar component doesn't have an 'e' parameter for its prop */}
      <Navbar />
      <div className="mx-3 md:container md:mx-auto my-5 rounded-xl p-5 bg-violet-100 min-h-[80vh] md:w-[35%]">
        <h1 className='font-bold text-center text-3xl'>ZenTask - Manage your todos at one place</h1>
        <div className="addTodo my-5 flex flex-col gap-4">
          <h2 className='text-2xl font-bold'>Add a Todo</h2>
          <div className="flex">
            <input onChange={handleChange} value={todo} type="text" className='w-full rounded-full px-5 py-1' />
            {/* FIX 10: Disable button if todo text is too short after trimming whitespace */}
            <button
              onClick={handleAdd}
              disabled={todo.trim().length <= 3}
              className='bg-violet-800 mx-2 rounded-full hover:bg-violet-950 disabled:bg-violet-500 p-4 py-2 text-sm font-bold text-white'
            >
              Save
            </button>
          </div>
        </div>
        {/* FIX 11: Removed id="" from input as it's redundant if name is used for logic */}
        <input className='my-4' id='show' onChange={toggleFinished} type="checkbox" checked={showFinished} />
        <label className='mx-2' htmlFor="show">Show Finished</label>
        <div className='h-[1px] bg-black opacity-15 w-[90%] mx-auto my-2'></div>
        <h2 className='text-2xl font-bold'>Your Todos</h2>
        <div className="todos">
          {todos.length === 0 && <div className='m-5'>No Todos to display</div>}
          {todos.map(item => {
            return (showFinished || !item.isCompleted) && (
              <div key={item.id} className={"todo flex my-3 justify-between"}>
                <div className='flex gap-5'>
                  {/* FIX 12: No id="" needed here, name={item.id} is sufficient */}
                  <input name={item.id} onChange={handleCheckbox} type="checkbox" checked={item.isCompleted} />
                  <div className={item.isCompleted ? "line-through" : ""}>{item.todo}</div>
                </div>
                <div className="buttons flex h-full">
                  <button onClick={(e) => handleEdit(e, item.id)} className='bg-violet-800 hover:bg-violet-950 p-2 py-1 text-sm font-bold text-white rounded-md mx-1'><FaEdit /></button>
                  <button onClick={(e) => { handleDelete(e, item.id) }} className='bg-violet-800 hover:bg-violet-950 p-2 py-1 text-sm font-bold text-white rounded-md mx-1'><AiFillDelete /></button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </>
  );
}

export default App;
