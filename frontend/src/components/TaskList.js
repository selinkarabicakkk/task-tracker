import React from "react";

const TaskList = ({
  tasks,
  users,
  loading,
  toggleTaskCompletion,
  deleteTask,
  startEditTask,
  searchTerm,
}) => {
  const getUserName = (userId) => {
    if (!userId) return "Unassigned";
    const user = users.find((user) => user.id === parseInt(userId));
    return user ? user.name : "Unknown User";
  };

  const getPriorityClass = (priority) => {
    switch (priority) {
      case "high":
        return "bg-red-100 text-red-800";
      case "medium":
        return "bg-blue-100 text-blue-800";
      case "low":
        return "bg-gray-100 text-gray-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return "No date";

    const date = new Date(dateString);
    return new Intl.DateTimeFormat("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    }).format(date);
  };

  const isDueDatePassed = (dateString) => {
    if (!dateString) return false;

    const dueDate = new Date(dateString);
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    return dueDate < today;
  };

  const getDueDateClass = (dateString, completed) => {
    if (completed) return "text-gray-500";
    if (!dateString) return "text-gray-500";

    if (isDueDatePassed(dateString)) {
      return "text-red-600 font-medium";
    }

    const dueDate = new Date(dateString);
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    const nextWeek = new Date(today);
    nextWeek.setDate(nextWeek.getDate() + 7);

    if (dueDate <= tomorrow) {
      return "text-red-600 font-medium";
    } else if (dueDate <= nextWeek) {
      return "text-yellow-600 font-medium";
    } else {
      return "text-green-600";
    }
  };

  // Arama terimini başlıkta vurgulama fonksiyonu
  const highlightSearchTerm = (text, term) => {
    if (!term || !text) return text;

    const regex = new RegExp(`(${term})`, "gi");
    const parts = text.split(regex);

    return (
      <>
        {parts.map((part, index) =>
          regex.test(part) ? (
            <span key={index} className="bg-yellow-200">
              {part}
            </span>
          ) : (
            part
          )
        )}
      </>
    );
  };

  // Görevlerin eşleşme derecesine göre sıralanması
  const getSortedTasks = () => {
    if (!searchTerm) return tasks;

    const searchTermLower = searchTerm.toLowerCase();

    return [...tasks].sort((taskA, taskB) => {
      // Başlıkta eşleşme var mı kontrol et
      const titleAMatch = taskA.title.toLowerCase().includes(searchTermLower);
      const titleBMatch = taskB.title.toLowerCase().includes(searchTermLower);

      // Her iki görevde de eşleşme varsa, eşleşme pozisyonuna göre sırala
      if (titleAMatch && titleBMatch) {
        const posA = taskA.title.toLowerCase().indexOf(searchTermLower);
        const posB = taskB.title.toLowerCase().indexOf(searchTermLower);
        return posA - posB;
      }

      // Sadece bir görevde eşleşme varsa, onu yukarı taşı
      if (titleAMatch) return -1;
      if (titleBMatch) return 1;

      return 0;
    });
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center p-8 bg-white rounded-lg shadow">
        <div className="w-12 h-12 border-4 border-t-accent rounded-full animate-spin"></div>
        <p className="mt-4 text-accent font-medium">Loading tasks...</p>
      </div>
    );
  }

  if (tasks.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center p-8 bg-white rounded-lg shadow text-center">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-16 w-16 text-gray-400 mb-4"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
          />
        </svg>
        <h3 className="text-xl font-medium text-gray-500 mb-1">
          No Tasks Found
        </h3>
        <p className="text-gray-500">
          {searchTerm
            ? `No tasks match "${searchTerm}"`
            : "There are no tasks yet. Add a new task!"}
        </p>
      </div>
    );
  }

  // Görevleri sırala
  const sortedTasks = getSortedTasks();

  return (
    <div className="bg-white rounded-lg shadow overflow-hidden">
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                TITLE
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                STATUS
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                PRIORITY
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                DUE DATE
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                ASSIGNEE
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                ACTIONS
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {sortedTasks.map((task) => (
              <tr
                key={task.id}
                className={`${task.completed ? "bg-green-50" : ""} ${
                  searchTerm &&
                  task.title.toLowerCase().includes(searchTerm.toLowerCase())
                    ? "bg-blue-50"
                    : ""
                }`}
              >
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm font-medium text-gray-900">
                    {searchTerm
                      ? highlightSearchTerm(task.title, searchTerm)
                      : task.title}
                  </div>
                  {task.description && (
                    <div className="text-sm text-gray-500 truncate max-w-xs">
                      {task.description}
                    </div>
                  )}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span
                    className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      task.completed
                        ? "bg-green-100 text-green-800"
                        : "bg-yellow-100 text-yellow-800"
                    }`}
                  >
                    {task.completed ? "Completed" : "In Progress"}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span
                    className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getPriorityClass(
                      task.priority
                    )}`}
                  >
                    {task.priority
                      ? task.priority.charAt(0).toUpperCase() +
                        task.priority.slice(1)
                      : "Medium"}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span
                    className={getDueDateClass(task.dueDate, task.completed)}
                  >
                    {formatDate(task.dueDate)}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {getUserName(task.assigneeId)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                  <button
                    onClick={() =>
                      toggleTaskCompletion(task.id, task.completed)
                    }
                    className={`inline-flex items-center px-2.5 py-1.5 border border-transparent text-xs font-medium rounded ${
                      task.completed
                        ? "text-yellow-700 bg-yellow-100 hover:bg-yellow-200"
                        : "text-green-700 bg-green-100 hover:bg-green-200"
                    }`}
                  >
                    {task.completed ? "Mark Incomplete" : "Mark Complete"}
                  </button>
                  <button
                    onClick={() => startEditTask(task)}
                    className="inline-flex items-center px-2.5 py-1.5 border border-transparent text-xs font-medium rounded text-blue-700 bg-blue-100 hover:bg-blue-200"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => {
                      if (
                        window.confirm(
                          "Are you sure you want to delete this task?"
                        )
                      ) {
                        deleteTask(task.id);
                      }
                    }}
                    className="inline-flex items-center px-2.5 py-1.5 border border-transparent text-xs font-medium rounded text-red-700 bg-red-100 hover:bg-red-200"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default TaskList;
