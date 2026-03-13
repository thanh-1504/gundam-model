const e = require("cors");
const prisma = require("../lib/prisma");
const {
  getUsers,
  handleCreateUser,
  handleUpdateUser,
  handleDeleteUser,
} = require("../services/userService");

exports.getUsers = async (req, res) => {
  const users = await getUsers();
  res.json({
    status: "success",
    result: users.length,
    data: users,
  });
};

exports.createUser = async (req, res) => {
  const { username, password, email, avatar, role, phone, address } = req.body;
  const newUser = await handleCreateUser(
    username,
    password,
    email,
    avatar,
    role,
    phone,
    address,
  );
  res.status(201).json({
    status: "succes",
    data: newUser,
  });
};

exports.updateUser = async (req, res) => {
  const id = +req.params.id;
  const { username, password, email, avatar, role, phone, address } = req.body;
  const updatedUser = await handleUpdateUser(
    id,
    username,
    password,
    email,
    avatar,
    role,
    phone,
    address,
  );
  res.status(201).json({
    status: "succes",
    data: updatedUser,
  });
};

exports.deleteUser = async (req, res) => {
  const id = +req.params.id;
  await handleDeleteUser(id);
  res.status(204).json({
    status: "succes",
    message: "Deleted successfully",
  });
};
