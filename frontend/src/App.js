import React, { useState, useEffect } from "react";
import TaskForm from "./components/TaskForm";
import TaskList from "./components/TaskList";
import axios from "axios";

function App() {
  const [tasks, setTasks] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [editTask, setEditTask] = useState(null);
  const [activeTab, setActiveTab] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [isSearching, setIsSearching] = useState(false);

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      if (searchTerm) {
        searchTasks(searchTerm);
      } else {
        fetchData();
      }
    }, 500);

    return () => clearTimeout(delayDebounceFn);
  }, [searchTerm]);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [tasksResponse, usersResponse] = await Promise.all([
        axios.get("/api/tasks"),
        axios.get("/api/users"),
      ]);

      setTasks(tasksResponse.data);
      setUsers(usersResponse.data);
      setError(null);
    } catch (err) {
      console.error("Error loading data:", err);
      setError("An error occurred while loading data.");
    } finally {
      setLoading(false);
      setIsSearching(false);
    }
  };

  const searchTasks = async (query) => {
    try {
      setIsSearching(true);
      const response = await axios.get(
        `/api/tasks?search=${encodeURIComponent(query)}`
      );
      setTasks(response.data);
    } catch (err) {
      console.error("Error searching tasks:", err);
      setError("An error occurred while searching tasks.");
    } finally {
      setIsSearching(false);
    }
  };

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const clearSearch = () => {
    setSearchTerm("");
    fetchData();
  };

  const addTask = async (task) => {
    try {
      const response = await axios.post("/api/tasks", task);
      setTasks([...tasks, response.data]);
    } catch (err) {
      console.error("Error adding task:", err);
      setError("An error occurred while adding the task.");
    }
  };

  const updateTask = async (id, updatedTask) => {
    try {
      console.log("Updating task with data:", updatedTask);

      if (updatedTask.dueDate && typeof updatedTask.dueDate === "string") {
        if (!updatedTask.dueDate.includes("T")) {
          updatedTask.dueDate = new Date(updatedTask.dueDate).toISOString();
        }
      }

      const response = await axios.put(`/api/tasks/${id}`, updatedTask);

      console.log("Server response:", response.data);

      setTasks(tasks.map((task) => (task.id === id ? response.data : task)));
      setEditTask(null);
    } catch (err) {
      console.error("Error updating task:", err);
      setError("An error occurred while updating the task.");
    }
  };

  const deleteTask = async (id) => {
    try {
      await axios.delete(`/api/tasks/${id}`);
      setTasks(tasks.filter((task) => task.id !== id));
    } catch (err) {
      console.error("Error deleting task:", err);
      setError("An error occurred while deleting the task.");
    }
  };

  const toggleTaskCompletion = async (id, completed) => {
    try {
      const taskToUpdate = tasks.find((task) => task.id === id);
      if (!taskToUpdate) {
        console.error("Task not found:", id);
        return;
      }
      const response = await axios.put(`/api/tasks/${id}`, {
        ...taskToUpdate,
        completed: !completed,
      });

      setTasks(tasks.map((task) => (task.id === id ? response.data : task)));
    } catch (err) {
      console.error("Error toggling task completion:", err);
      setError("An error occurred while changing task status.");
    }
  };

  const startEditTask = (task) => {
    console.log("Editing task:", task);
    setEditTask(task);
  };

  const cancelEdit = () => {
    setEditTask(null);
  };

  const getFilteredTasks = () => {
    switch (activeTab) {
      case "active":
        return tasks.filter((task) => !task.completed);
      case "completed":
        return tasks.filter((task) => task.completed);
      default:
        return tasks;
    }
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            <h1 className="text-xl font-bold text-gray-900">Task Tracker</h1>
            <div className="flex items-center">
              <span className="relative inline-block">
                <span className="inline-flex items-center px-3 py-1 rounded-md bg-blue-50 text-sm font-medium text-blue-700">
                  {tasks.length} Tasks
                </span>
              </span>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {error && (
          <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-6">
            <div className="flex">
              <div className="flex-shrink-0">
                <svg
                  className="h-5 w-5 text-red-400"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                  aria-hidden="true"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
              <div className="ml-3">
                <p className="text-sm text-red-700">{error}</p>
              </div>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          <div className="lg:col-span-1">
            <TaskForm
              addTask={addTask}
              updateTask={updateTask}
              editTask={editTask}
              cancelEdit={cancelEdit}
              users={users}
            />
          </div>

          <div className="lg:col-span-3">
            <div className="bg-white shadow rounded-lg mb-6">
              <div className="p-4 border-b border-gray-200">
                <div className="flex items-center mb-2">
                  <div className="relative flex-grow">
                    <input
                      type="text"
                      placeholder="Search tasks by title..."
                      className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
                      value={searchTerm}
                      onChange={handleSearchChange}
                    />
                    <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                      <svg
                        className="h-5 w-5 text-gray-400"
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                        aria-hidden="true"
                      >
                        <path
                          fillRule="evenodd"
                          d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z"
                          clipRule="evenodd"
                        />
                      </svg>
                    </div>
                    {searchTerm && (
                      <div className="absolute inset-y-0 right-0 flex items-center pr-3">
                        <button
                          onClick={clearSearch}
                          className="text-gray-400 hover:text-gray-500 focus:outline-none"
                        >
                          <svg
                            className="h-5 w-5"
                            xmlns="http://www.w3.org/2000/svg"
                            viewBox="0 0 20 20"
                            fill="currentColor"
                          >
                            <path
                              fillRule="evenodd"
                              d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                              clipRule="evenodd"
                            />
                          </svg>
                        </button>
                      </div>
                    )}
                  </div>
                </div>
                <nav className="-mb-px flex" aria-label="Tabs">
                  <button
                    onClick={() => setActiveTab("all")}
                    className={`${
                      activeTab === "all"
                        ? "border-blue-500 text-blue-600"
                        : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                    } whitespace-nowrap py-4 px-4 border-b-2 font-medium text-sm flex-1 text-center`}
                  >
                    All Tasks
                  </button>
                  <button
                    onClick={() => setActiveTab("active")}
                    className={`${
                      activeTab === "active"
                        ? "border-yellow-500 text-yellow-600"
                        : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                    } whitespace-nowrap py-4 px-4 border-b-2 font-medium text-sm flex-1 text-center`}
                  >
                    In Progress
                  </button>
                  <button
                    onClick={() => setActiveTab("completed")}
                    className={`${
                      activeTab === "completed"
                        ? "border-green-500 text-green-600"
                        : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                    } whitespace-nowrap py-4 px-4 border-b-2 font-medium text-sm flex-1 text-center`}
                  >
                    Completed
                  </button>
                </nav>
              </div>
            </div>

            <TaskList
              tasks={getFilteredTasks()}
              users={users}
              loading={loading || isSearching}
              toggleTaskCompletion={toggleTaskCompletion}
              deleteTask={deleteTask}
              startEditTask={startEditTask}
              searchTerm={searchTerm}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
