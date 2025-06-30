# Task Tracker

A modern, responsive task management application designed for teams to efficiently track and organize their tasks. Built with React and Node.js, this application offers a clean user interface with powerful task management features.

![Task Tracker Screenshot](![image](https://github.com/user-attachments/assets/c511ed38-9c5a-4caf-80fb-56d8c16f81f5)
)

## Features

- **Elegant User Interface**: Modern, responsive design with a clean aesthetic using Tailwind CSS
- **User Authentication**: Secure login system with user-specific views
- **Task Management**:
  - Create, edit, and delete tasks
  - Mark tasks as completed or active
  - Set priority levels (High, Medium, Low)
  - Assign due dates with visual indicators
  - Assign tasks to team members
- **Task Organization**:
  - Filter tasks by status (All, Active, Completed)
  - Search tasks by title with real-time results
  - Tasks assigned to the current user are highlighted
- **Visual Indicators**:
  - Color-coded priority levels
  - Due date highlighting based on urgency
  - Completion status indicators
  - Personal task highlighting

## Technology Stack

### Frontend

- **React 19**: Modern UI library for building interactive interfaces
- **Tailwind CSS**: Utility-first CSS framework for custom designs
- **Axios**: Promise-based HTTP client for API requests

### Backend

- **Node.js**: JavaScript runtime environment
- **Express**: Web application framework for Node.js
- **JSON Storage**: Lightweight data persistence using JSON files

## Installation

### Prerequisites

- Node.js (v14 or higher)
- npm or yarn

### Setup Steps

1. **Clone the repository**

   ```
   git clone <repository-url>
   cd task-tracker
   ```

2. **Install backend dependencies**

   ```
   cd backend
   npm install
   ```

3. **Install frontend dependencies**

   ```
   cd ../frontend
   npm install
   ```

4. **Start the backend server**

   ```
   cd ../backend
   npm run dev
   ```

5. **Start the frontend development server**

   ```
   cd ../frontend
   npm start
   ```

6. **Access the application**  
   Open your browser and navigate to [http://localhost:3000](http://localhost:3000)

## Usage Guide

### Authentication

The application includes a demo authentication system with the following accounts:

| Email                 | Password    | Role            |
| --------------------- | ----------- | --------------- |
| edward@example.com    | password123 | Team Member     |
| emily@example.com     | password123 | Project Manager |
| charlotte@example.com | password123 | Team Lead       |
| oliver@example.com    | password123 | Developer       |
| george@example.com    | password123 | QA Engineer     |

### Task Management

1. **Creating Tasks**

   - Fill out the task form on the left panel
   - Add title, description, priority, due date, and assignee
   - Click "Add Task" to create

2. **Managing Tasks**

   - Use the "Mark Done/Undone" button to toggle completion status
   - Click "Edit" to modify task details
   - Click "Delete" to remove a task

3. **Filtering and Searching**
   - Use the tabs at the top to filter by status (All/Active/Completed)
   - Use the search box to find tasks by title
   - Tasks assigned to you are highlighted in blue with a "Yours" label

## Project Structure

```
task-tracker/
├── backend/               # Backend server code
│   ├── server.js          # Express server and API endpoints
│   ├── tasks.json         # JSON data storage
│   └── package.json       # Backend dependencies
│
└── frontend/              # React frontend application
    ├── public/            # Static files
    └── src/               # Source code
        ├── components/    # React components
        │   ├── Login.js           # Authentication component
        │   ├── TaskForm.js        # Task creation/editing form
        │   ├── TaskList.js        # Task display component
        │   └── UserProfile.js     # User information component
        ├── App.js         # Main application component
        └── index.js       # Application entry point
```

## API Endpoints

| Method | Endpoint        | Description                          |
| ------ | --------------- | ------------------------------------ |
| POST   | /api/auth/login | User authentication                  |
| GET    | /api/auth/user  | Get user information                 |
| GET    | /api/tasks      | Get all tasks (with optional search) |
| POST   | /api/tasks      | Create a new task                    |
| PUT    | /api/tasks/:id  | Update an existing task              |
| DELETE | /api/tasks/:id  | Delete a task                        |
| GET    | /api/users      | Get all users                        |

## Future Enhancements

- Task categories and labels
- User registration system
- Team management features
- Task comments and attachments
- Advanced reporting and analytics
- Dark mode support

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgments

- Icons and design inspiration from Tailwind UI
- All team members who contributed to the project
