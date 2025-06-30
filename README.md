# Task Tracker

A simple team task tracking application with user authentication.

## Features

- User authentication
- Add, edit and delete tasks
- Mark tasks as completed/incomplete
- Assign tasks to team members
- View tasks as a list
- Search tasks by title
- Highlight tasks assigned to you

## Technologies

- **Frontend**: React, Tailwind CSS
- **Backend**: Node.js, Express
- **Data Storage**: JSON file

## Installation

### Requirements

- Node.js (v14+)
- npm or yarn

### Steps

1. Clone the project:

```
git clone <repo-url>
cd task-tracker
```

2. Install backend dependencies:

```
cd backend
npm install
```

3. Install frontend dependencies:

```
cd ../frontend
npm install
```

4. Start the backend:

```
cd ../backend
npm run dev
```

5. Start the frontend in a new terminal window:

```
cd ../frontend
npm start
```

6. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Usage

### Authentication

The application includes a simple authentication system. You can log in using one of the following demo accounts:

| Email                 | Password    |
| --------------------- | ----------- |
| edward@example.com    | password123 |
| emily@example.com     | password123 |
| charlotte@example.com | password123 |
| oliver@example.com    | password123 |
| george@example.com    | password123 |

### Task Management

- Use the form on the left to add new tasks
- Click the "Edit" button to edit tasks
- Click the respective button to mark tasks as completed/incomplete
- Click the "Delete" button to delete tasks
- Use the search box to find tasks by title
- Tasks assigned to the currently logged in user are highlighted in blue with a "Yours" label
