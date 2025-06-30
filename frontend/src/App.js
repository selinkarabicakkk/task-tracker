import React, { useState, useEffect } from "react";
import TaskForm from "./components/TaskForm";
import TaskList from "./components/TaskList";
import Login from "./components/Login";
import UserProfile from "./components/UserProfile";
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
  const [currentUser, setCurrentUser] = useState(null);

  useEffect(() => {
    // Check if user is already logged in from localStorage
    const savedUser = localStorage.getItem("user");
    if (savedUser) {
      try {
        setCurrentUser(JSON.parse(savedUser));
      } catch (e) {
        console.error("Error parsing saved user:", e);
        localStorage.removeItem("user");
      }
    }
  }, []);

  useEffect(() => {
    if (currentUser) {
      fetchData();
    } else {
      // If no user is logged in, reset tasks
      setTasks([]);
      setUsers([]);
      setLoading(false);
    }
  }, [currentUser]);

  useEffect(() => {
    if (!currentUser) return;

    const delayDebounceFn = setTimeout(() => {
      if (searchTerm) {
        searchTasks(searchTerm);
      } else {
        fetchData();
      }
    }, 500);

    return () => clearTimeout(delayDebounceFn);
  }, [searchTerm, currentUser]);

  const fetchData = async () => {
    if (!currentUser) return;

    try {
      setLoading(true);
      const [tasksResponse, usersResponse] = await Promise.all([
        axios.get(`/api/tasks`),
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
    if (!currentUser) return;

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
    if (!currentUser) return;

    try {
      const response = await axios.post("/api/tasks", task);
      setTasks([...tasks, response.data]);
    } catch (err) {
      console.error("Error adding task:", err);
      setError("An error occurred while adding the task.");
    }
  };

  const updateTask = async (id, updatedTask) => {
    if (!currentUser) return;

    try {
      if (updatedTask.dueDate && typeof updatedTask.dueDate === "string") {
        if (!updatedTask.dueDate.includes("T")) {
          updatedTask.dueDate = new Date(updatedTask.dueDate).toISOString();
        }
      }

      const response = await axios.put(`/api/tasks/${id}`, updatedTask);
      setTasks(tasks.map((task) => (task.id === id ? response.data : task)));
      setEditTask(null);
    } catch (err) {
      console.error("Error updating task:", err);
      setError("An error occurred while updating the task.");
    }
  };

  const deleteTask = async (id) => {
    if (!currentUser) return;

    try {
      await axios.delete(`/api/tasks/${id}`);
      setTasks(tasks.filter((task) => task.id !== id));
    } catch (err) {
      console.error("Error deleting task:", err);
      setError("An error occurred while deleting the task.");
    }
  };

  const toggleTaskCompletion = async (id, completed) => {
    if (!currentUser) return;

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

  const handleLogin = (user) => {
    setCurrentUser(user);
  };

  const handleLogout = () => {
    localStorage.removeItem("user");
    setCurrentUser(null);
    setTasks([]);
    setError(null);
  };

  // If no user is logged in, show login screen
  if (!currentUser) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="bg-white shadow">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between h-16 items-center">
              <h1 className="text-xl font-bold text-gray-900">Task Tracker</h1>
            </div>
          </div>
        </div>
        <Login onLogin={handleLogin} onError={(msg) => setError(msg)} />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            <h1 className="text-xl font-bold text-gray-900">Task Tracker</h1>
            <div className="flex items-center space-x-4">
              <span className="relative inline-block">
                <span className="inline-flex items-center px-3 py-1 rounded-md bg-blue-50 text-sm font-medium text-blue-700">
                  {tasks.length} Tasks
                </span>
              </span>
              <UserProfile user={currentUser} onLogout={handleLogout} />
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
          <div className="col-span-1">
            <TaskForm
              onSubmit={addTask}
              users={users}
              editTask={editTask}
              onUpdate={updateTask}
              onCancel={cancelEdit}
            />
          </div>

          <div className="col-span-1 lg:col-span-3">
            <div className="bg-white shadow rounded-lg">
              <div className="p-4 border-b border-gray-200 flex flex-col sm:flex-row justify-between items-start sm:items-center space-y-2 sm:space-y-0">
                <div className="flex space-x-2">
                  <button
                    className={`px-3 py-1.5 text-sm font-medium rounded-md ${
                      activeTab === "all"
                        ? "bg-blue-50 text-blue-700"
                        : "text-gray-500 hover:text-gray-700"
                    }`}
                    onClick={() => setActiveTab("all")}
                  >
                    All Tasks
                  </button>
                  <button
                    className={`px-3 py-1.5 text-sm font-medium rounded-md ${
                      activeTab === "active"
                        ? "bg-blue-50 text-blue-700"
                        : "text-gray-500 hover:text-gray-700"
                    }`}
                    onClick={() => setActiveTab("active")}
                  >
                    Active
                  </button>
                  <button
                    className={`px-3 py-1.5 text-sm font-medium rounded-md ${
                      activeTab === "completed"
                        ? "bg-blue-50 text-blue-700"
                        : "text-gray-500 hover:text-gray-700"
                    }`}
                    onClick={() => setActiveTab("completed")}
                  >
                    Completed
                  </button>
                </div>

                <div className="relative w-full sm:w-64">
                  <input
                    type="text"
                    className="block w-full rounded-md border-0 py-1.5 pl-3 pr-10 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-blue-600 sm:text-sm sm:leading-6"
                    placeholder="Search tasks..."
                    value={searchTerm}
                    onChange={handleSearchChange}
                  />
                  {searchTerm && (
                    <button
                      type="button"
                      className="absolute inset-y-0 right-0 flex items-center pr-3"
                      onClick={clearSearch}
                    >
                      <svg
                        className="h-5 w-5 text-gray-400"
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
                    </button>
                  )}
                </div>
              </div>

              <TaskList
                tasks={getFilteredTasks()}
                users={users}
                onDelete={deleteTask}
                onToggleComplete={toggleTaskCompletion}
                onEdit={startEditTask}
                loading={loading}
                isSearching={isSearching}
                searchTerm={searchTerm}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
