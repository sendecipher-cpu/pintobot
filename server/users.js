// users.js - simple in-memory user store
const { v4: uuidv4 } = require('uuid');

const users = new Map(); // token -> { id, name }

function createUser(name) {
  const id = uuidv4();
  const token = uuidv4();
  const user = { id, name };
  users.set(token, user);
  return { token, user };
}

function getUserByToken(token) {
  return users.get(token) || null;
}

module.exports = { createUser, getUserByToken };
