// server/index.js
const express = require("express");
const cors = require("cors");
const http = require("http");
const { Server } = require("socket.io");

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: { origin: "*" },
});

app.use(cors());
app.use(express.json());

// Simple in-memory store
const users = {};

// Join endpoint
app.post("/api/join", (req, res) => {
  const { name } = req.body;
  if (!name) return res.status(400).json({ error: "Name required" });

  const token = Math.random().toString(36).substr(2);
  users[token] = { id: token, name };
  res.json({ token, user: { id: token, name } });
});

// Socket.io connection
io.on("connection", (socket) => {
  const token = socket.handshake.auth.token;
  const user = users[token] || { name: "Unknown" };

  // Notify system
  socket.emit("system", { message: `Welcome ${user.name}!` });
  socket.broadcast.emit("system", { message: `${user.name} joined the chat` });

  socket.on("message", (msg) => {
    io.emit("message", { from: user.name, text: msg.text });
  });

  socket.on("disconnect", () => {
    io.emit("system", { message: `${user.name} left the chat` });
  });
});

const PORT = 4000;
server.listen(PORT, () => console.log(`PintoBot server running on http://localhost:${PORT}`));
