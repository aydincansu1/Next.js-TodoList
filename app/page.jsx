"use client";
import { useEffect, useState } from "react";
import { getAPI, postAPI, putAPI, deleteAPI } from "@/services/fetchAPI";
import { MdDelete } from "react-icons/md";
import { HiMiniPencilSquare } from "react-icons/hi2";
export default function Home() {
  const [todos, setTodos] = useState([]);
  const [newTodo, setNewTodo] = useState("");

  useEffect(() => {
    async function fetchTodos() {
      const data = await getAPI("/get");
      if (data && data.status === "success") {
        setTodos(data.data);
      }
    }
    fetchTodos();
  }, []);

  const handleAddTodo = async () => {
    if (newTodo.trim()) {
      await postAPI("/post", {
        task: newTodo,
        isCompleted: false,
      });
      setNewTodo("");
      // Refresh the list
      const data = await getAPI("/get");
      if (data && data.status === "success") {
        setTodos(data.data);
      }
    }
  };

  const handleUpdateTodo = async (id, updatedTask) => {
    await putAPI(`/put/${id}`, { task: updatedTask });
    // Refresh the list
    const data = await getAPI("/get");
    if (data && data.status === "success") {
      setTodos(data.data);
    }
  };

  const handleDeleteTodo = async (id) => {
    await deleteAPI(`/delete/${id}`);
    // Refresh the list
    const data = await getAPI("/get");
    if (data && data.status === "success") {
      setTodos(data.data);
    }
  };

  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-8">
      <h1 className="text-4xl text-[#232323] font-bold mb-5">Todo List</h1>
      <div className="mb-4 w-full max-w-md">
        <div className="flex">
          <input
            type="text"
            value={newTodo}
            onChange={(e) => setNewTodo(e.target.value)}
            placeholder="Add a Task"
            className="flex-1 p-2.5 border border-gray-300 rounded-l-md"
          />
          <button
            onClick={handleAddTodo}
            className="p-2.5 bg-[#232323] text-white rounded-r-md border border-[#232323]"
          >
            Add
          </button>
        </div>
      </div>

      <ul className="w-full max-w-md">
        {todos.map((todo) => (
          <li
            key={todo.id}
            className="flex justify-between items-center p-2 bg-white rounded shadow mb-2"
          >
            <span className={`${todo.isCompleted ? "line-through" : ""}`}>
              {todo.task}
            </span>
            <div className="flex items-center space-x-2">
              <HiMiniPencilSquare
                onClick={() =>
                  handleUpdateTodo(todo.id, prompt("Update task", todo.task))
                }
                className="text-gray-600 text-xl cursor-pointer hover:text-gray-700 transition"
              />

              <MdDelete
                onClick={() => handleDeleteTodo(todo.id)}
                className="text-red-500 cursor-pointer text-xl hover:text-red-600 transition"
              />
            </div>
          </li>
        ))}
      </ul>
    </main>
  );
}
