const prisma = require("../lib/prisma");
const bcrypt = require("bcryptjs");
exports.getUsers = async () => {
  const users = await prisma.user.findMany();
  return users;
};

exports.handleCreateUser = async (
  username,
  password,
  email,
  avatar,
  role,
  phone,
  address,
) => {
  const newUser = await prisma.user.create({
    data: {
      username,
      password: await bcrypt.hash(password, 12),
      email,
      avatar,
      role,
      phone,
      address,
    },
  });
  return newUser;
};

exports.handleUpdateUser = async (
  id,
  username,
  password,
  email,
  avatar,
  role,
  phone,
  address,
) => {
  const updatedUser = await prisma.user.update({
    where: { id },
    data: {
      username,
      password: await bcrypt.hash(password, 12),
      email,
      avatar,
      role,
      phone,
      address,
    },
  });
  return updatedUser;
};

exports.handleDeleteUser = async (id) => {
  await prisma.user.delete({
    where: { id },
  });
};
