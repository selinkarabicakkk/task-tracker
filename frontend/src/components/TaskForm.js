import React, { useState, useEffect } from "react";

const TaskForm = ({ onSubmit, onUpdate, editTask, onCancel, users }) => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [assigneeId, setAssigneeId] = useState("");
  const [priority, setPriority] = useState("");
  const [dueDate, setDueDate] = useState("");
  const [errors, setErrors] = useState({});
  const [isSubmitted, setIsSubmitted] = useState(false);

  useEffect(() => {
    if (editTask) {
      console.log("Editing task with dueDate:", editTask.dueDate);
      setTitle(editTask.title);
      setDescription(editTask.description || "");
      setAssigneeId(editTask.assigneeId || "");
      setPriority(editTask.priority || "");
      setDueDate(editTask.dueDate ? formatDateForInput(editTask.dueDate) : "");
      console.log(
        "Formatted date for input:",
        editTask.dueDate ? formatDateForInput(editTask.dueDate) : ""
      );
      setErrors({});
      setIsSubmitted(false);
    } else {
      resetForm();
    }
  }, [editTask]);

  const formatDateForInput = (isoString) => {
    if (!isoString) return "";
    try {
      const date = new Date(isoString);
      if (isNaN(date.getTime())) {
        console.error("Invalid date:", isoString);
        return "";
      }

      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, "0");
      const day = String(date.getDate()).padStart(2, "0");

      return `${year}-${month}-${day}`;
    } catch (error) {
      console.error("Error formatting date:", error);
      return "";
    }
  };

  const resetForm = () => {
    setTitle("");
    setDescription("");
    setAssigneeId("");
    setPriority("");
    setDueDate("");
    setErrors({});
    setIsSubmitted(false);
  };

  const validate = () => {
    const newErrors = {};

    if (!title.trim()) {
      newErrors.title = "This field is required.";
    }

    if (!description.trim()) {
      newErrors.description = "This field is required.";
    }

    if (!assigneeId) {
      newErrors.assigneeId = "This field is required.";
    }

    if (!priority) {
      newErrors.priority = "This field is required.";
    }

    if (!dueDate) {
      newErrors.dueDate = "This field is required.";
    } else {
      const selectedDate = new Date(dueDate);
      const selectedYear = selectedDate.getFullYear();

      if (selectedYear > 2025) {
        newErrors.dueDate = "Please enter a closer date.";
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (field, value) => {
    if (field === "title") {
      setTitle(value);
      if (isSubmitted && value.trim()) {
        setErrors({ ...errors, title: undefined });
      }
    } else if (field === "description") {
      setDescription(value);
      if (isSubmitted && value.trim()) {
        setErrors({ ...errors, description: undefined });
      }
    } else if (field === "assigneeId") {
      setAssigneeId(value);
      if (isSubmitted && value) {
        setErrors({ ...errors, assigneeId: undefined });
      }
    } else if (field === "priority") {
      setPriority(value);
      if (isSubmitted && value) {
        setErrors({ ...errors, priority: undefined });
      }
    } else if (field === "dueDate") {
      setDueDate(value);
      console.log("Due date changed to:", value);

      if (value) {
        const selectedDate = new Date(value);
        const selectedYear = selectedDate.getFullYear();

        if (selectedYear > 2025) {
          setErrors({ ...errors, dueDate: "Please enter a closer date." });
        } else if (isSubmitted) {
          setErrors({ ...errors, dueDate: undefined });
        }
      } else if (isSubmitted) {
        setErrors({ ...errors, dueDate: "This field is required." });
      }
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    setIsSubmitted(true);

    const isValid = validate();

    if (!isValid) {
      return;
    }

    let dueDateISO = null;
    if (dueDate) {
      try {
        dueDateISO = new Date(dueDate).toISOString();
        console.log("Converted dueDate to ISO:", dueDateISO);
      } catch (error) {
        console.error("Error converting date to ISO:", error);
      }
    }

    const taskData = {
      title: title.trim(),
      description: description.trim(),
      assigneeId: assigneeId || null,
      priority: priority || "medium",
      dueDate: dueDateISO,
    };

    console.log("Submitting task data:", taskData);

    if (editTask) {
      onUpdate(editTask.id, taskData);
    } else {
      onSubmit(taskData);
    }

    resetForm();
  };

  const handleCancel = () => {
    onCancel();
    resetForm();
  };

  return (
    <div className="card mb-6">
      <div
        className={`card-header ${editTask ? "bg-yellow-50" : "bg-blue-50"}`}
      >
        <h2 className="text-lg font-semibold">
          {editTask ? "Edit Task" : "Add New Task"}
        </h2>
      </div>
      <div className="card-body">
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="title" className="form-label">
              Title
            </label>
            <input
              type="text"
              id="title"
              className={`form-input ${
                isSubmitted && errors.title ? "border-red-500" : ""
              }`}
              placeholder="Task title"
              value={title}
              onChange={(e) => handleChange("title", e.target.value)}
            />
            {isSubmitted && errors.title && (
              <p className="text-red-500 text-sm mt-1">{errors.title}</p>
            )}
          </div>

          <div className="form-group">
            <label htmlFor="description" className="form-label">
              Description
            </label>
            <textarea
              id="description"
              className={`form-input ${
                isSubmitted && errors.description ? "border-red-500" : ""
              }`}
              rows="3"
              placeholder="Task description"
              value={description}
              onChange={(e) => handleChange("description", e.target.value)}
            ></textarea>
            {isSubmitted && errors.description && (
              <p className="text-red-500 text-sm mt-1">{errors.description}</p>
            )}
          </div>

          <div className="form-group">
            <label htmlFor="dueDate" className="form-label">
              Due Date
            </label>
            <input
              type="date"
              id="dueDate"
              className={`form-input ${errors.dueDate ? "border-red-500" : ""}`}
              value={dueDate}
              onChange={(e) => handleChange("dueDate", e.target.value)}
            />
            {errors.dueDate && (
              <p className="text-red-500 text-sm mt-1">{errors.dueDate}</p>
            )}
          </div>

          <div className="form-group">
            <label htmlFor="assignee" className="form-label">
              Assignee
            </label>
            <select
              id="assignee"
              className={`form-input ${
                isSubmitted && errors.assigneeId ? "border-red-500" : ""
              }`}
              value={assigneeId}
              onChange={(e) => handleChange("assigneeId", e.target.value)}
            >
              <option value="">Select Person</option>
              {users.map((user) => (
                <option key={user.id} value={user.id}>
                  {user.name}
                </option>
              ))}
            </select>
            {isSubmitted && errors.assigneeId && (
              <p className="text-red-500 text-sm mt-1">{errors.assigneeId}</p>
            )}
          </div>

          <div className="form-group">
            <label htmlFor="priority" className="form-label">
              Priority
            </label>
            <select
              id="priority"
              className={`form-input ${
                isSubmitted && errors.priority ? "border-red-500" : ""
              }`}
              value={priority}
              onChange={(e) => handleChange("priority", e.target.value)}
            >
              <option value="">Select Priority</option>
              <option value="low">Low</option>
              <option value="medium">Medium</option>
              <option value="high">High</option>
            </select>
            {isSubmitted && errors.priority && (
              <p className="text-red-500 text-sm mt-1">{errors.priority}</p>
            )}
          </div>

          <div className="flex justify-between mt-4">
            <button
              type="submit"
              className={`btn ${editTask ? "btn-warning" : "btn-primary"}`}
            >
              {editTask ? "Update" : "Add"}
            </button>
            {editTask && (
              <button
                type="button"
                className="btn btn-secondary"
                onClick={handleCancel}
              >
                Cancel
              </button>
            )}
          </div>
        </form>
      </div>
    </div>
  );
};

export default TaskForm;
