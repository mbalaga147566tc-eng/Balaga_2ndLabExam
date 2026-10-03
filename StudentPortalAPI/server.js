const express = require('express');
const cors = require('cors');

const app = express();

app.use(cors());
app.use(express.json());

const users = [
  {
    id: 1,
    name: 'Student User',
    email: 'student@example.com',
    password: '123456',
    role: 'student',
  },
];

app.post('/register', (req, res) => {
  const { name, email, password } = req.body;

  if (!name || !email || !password) {
    return res.status(400).json({
      message: 'Name, email, and password are required',
    });
  }

  const existingUser = users.find(
    (user) => user.email.toLowerCase() === email.toLowerCase()
  );

  if (existingUser) {
    return res.status(409).json({
      message: 'Email is already registered',
    });
  }

  const newUser = {
    id: users.length + 1,
    name,
    email,
    password,
    role: 'student',
  };

  users.push(newUser);

  const { password: _, ...userData } = newUser;

  res.status(201).json({
    message: 'Registration successful',
    user: userData,
  });
});

app.post('/login', (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({
      message: 'Email and password are required',
    });
  }

  const user = users.find(
    (item) =>
      item.email.toLowerCase() === email.toLowerCase() &&
      item.password === password
  );

  if (!user) {
    return res.status(401).json({
      message: 'Invalid email or password',
    });
  }

  const { password: _, ...userData } = user;

  res.json({
    accessToken: 'student-portal-token-123',
    user: userData,
  });
});

app.listen(3000, () => {
  console.log('API running on http://localhost:3000');
});
