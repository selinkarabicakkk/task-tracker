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

  useEffect(() => {
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
      }
    };

    fetchData();
  }, []);

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
            <h1 className="text-xl font-bold text-gray-900">
              Team Task Tracker
            </h1>
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
              <div className="border-b border-gray-200">
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
              loading={loading}
              toggleTaskCompletion={toggleTaskCompletion}
              deleteTask={deleteTask}
              startEditTask={startEditTask}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
