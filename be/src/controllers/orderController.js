const {
  handleCreateOrder,
  handleGetOrders,
} = require("../services/orderService");

const getOrders = async (req, res) => {
  const orders = await handleGetOrders(req.query.userId);

  res.json({
    status: "success",
    result: orders.length,
    data: orders,
  });
};

const createOrder = async (req, res) => {
  const order = await handleCreateOrder(req.body);

  res.status(201).json({
    status: "success",
    data: order,
  });
};

module.exports = {
  getOrders,
  createOrder,
};