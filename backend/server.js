const express = require("express");
const cors = require("cors");
const fs = require("fs");
const path = require("path");
const { v4: uuidv4 } = require("uuid");

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Veri dosyası yolu
const DATA_FILE = path.join(__dirname, "tasks.json");

// Başlangıç verilerini oluştur (eğer dosya yoksa)
const initializeData = () => {
  if (!fs.existsSync(DATA_FILE)) {
    const initialData = {
      tasks: [],
      users: [
        {
          id: 1,
          name: "Edward Sinclair",
          email: "edward@example.com",
          password: "password123",
        },
        {
          id: 2,
          name: "Emily Clarke",
          email: "emily@example.com",
          password: "password123",
        },
        {
          id: 3,
          name: "Charlotte Hastings",
          email: "charlotte@example.com",
          password: "password123",
        },
        {
          id: 4,
          name: "Oliver Fitzgerald",
          email: "oliver@example.com",
          password: "password123",
        },
        {
          id: 5,
          name: "George Wentworth",
          email: "george@example.com",
          password: "password123",
        },
      ],
    };
    fs.writeFileSync(DATA_FILE, JSON.stringify(initialData, null, 2));
    return initialData;
  }

  const rawData = fs.readFileSync(DATA_FILE);
  return JSON.parse(rawData);
};

// Veriyi kaydet
const saveData = (data) => {
  fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2));
};

// Veriyi oku
let data = initializeData();

// Tarih doğrulama fonksiyonu
const validateDate = (dateString) => {
  if (!dateString) return null;

  try {
    const date = new Date(dateString);
    const year = date.getFullYear();

    if (year > 2025) {
      return { error: "Please enter a closer date (year 2025 or earlier)." };
    }
    return null;
  } catch (error) {
    return { error: "Invalid date format." };
  }
};

// Authentication endpoints
app.post("/api/auth/login", (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ error: "Email and password are required" });
  }

  // Find user by email
  const user = data.users.find((user) => user.email === email);

  if (!user) {
    return res.status(401).json({ error: "Invalid email or password" });
  }

  // Simple password check (not secure for production)
  if (user.password !== password) {
    return res.status(401).json({ error: "Invalid email or password" });
  }

  // Remove password from response
  const { password: _, ...userWithoutPassword } = user;

  return res.status(200).json({
    message: "Login successful",
    user: userWithoutPassword,
  });
});

app.get("/api/auth/user", (req, res) => {
  const { userId } = req.query;

  if (!userId) {
    return res.status(400).json({ error: "User ID is required" });
  }

  const user = data.users.find((user) => user.id === parseInt(userId));

  if (!user) {
    return res.status(404).json({ error: "User not found" });
  }

  // Remove password from response
  const { password, ...userWithoutPassword } = user;

  return res.status(200).json(userWithoutPassword);
});

app.get("/api/tasks", (req, res) => {
  const { search, userId } = req.query;

  let filteredTasks = [...data.tasks];

  if (search) {
    const searchLowerCase = search.toLowerCase();
    filteredTasks = filteredTasks.filter((task) =>
      task.title.toLowerCase().includes(searchLowerCase)
    );
  }

  return res.json(filteredTasks);
});

app.get("/api/users", (req, res) => {
  // Return users without passwords
  const usersWithoutPasswords = data.users.map(
    ({ password, ...userData }) => userData
  );
  res.json(usersWithoutPasswords);
});

app.post("/api/tasks", (req, res) => {
  const { title, description, assigneeId, priority, dueDate } = req.body;

  if (!title) {
    return res.status(400).json({ error: "Title is required" });
  }

  if (dueDate) {
    const dateValidation = validateDate(dueDate);
    if (dateValidation) {
      return res.status(400).json({ error: dateValidation.error });
    }
  }

  const newTask = {
    id: uuidv4(),
    title,
    description: description || "",
    completed: false,
    assigneeId: assigneeId || null,
    createdAt: new Date().toISOString(),
    priority: priority || "medium",
    dueDate: dueDate || null,
  };

  data.tasks.push(newTask);
  saveData(data);

  res.status(201).json(newTask);
});

// Görevi güncelle
app.put("/api/tasks/:id", (req, res) => {
  const { id } = req.params;
  const { title, description, completed, assigneeId, priority, dueDate } =
    req.body;

  const taskIndex = data.tasks.findIndex((task) => task.id === id);

  if (taskIndex === -1) {
    return res.status(404).json({ error: "Task not found" });
  }

  if (dueDate !== undefined) {
    const dateValidation = validateDate(dueDate);
    if (dateValidation) {
      return res.status(400).json({ error: dateValidation.error });
    }
  }

  const updatedTask = {
    ...data.tasks[taskIndex],
    title: title !== undefined ? title : data.tasks[taskIndex].title,
    description:
      description !== undefined
        ? description
        : data.tasks[taskIndex].description,
    completed:
      completed !== undefined ? completed : data.tasks[taskIndex].completed,
    assigneeId:
      assigneeId !== undefined ? assigneeId : data.tasks[taskIndex].assigneeId,
    priority:
      priority !== undefined ? priority : data.tasks[taskIndex].priority,
    dueDate: dueDate !== undefined ? dueDate : data.tasks[taskIndex].dueDate,
  };

  data.tasks[taskIndex] = updatedTask;
  saveData(data);

  res.json(updatedTask);
});

// Görevi sil
app.delete("/api/tasks/:id", (req, res) => {
  const { id } = req.params;

  const taskIndex = data.tasks.findIndex((task) => task.id === id);

  if (taskIndex === -1) {
    return res.status(404).json({ error: "Task not found" });
  }

  data.tasks.splice(taskIndex, 1);
  saveData(data);

  res.json({ message: "Task deleted" });
});

// Sunucuyu başlat
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
