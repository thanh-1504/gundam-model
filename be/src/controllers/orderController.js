const {
  handleCreateOrder,
  handleGetOrders,
} = require("../services/orderService");
const vnpayService = require("../services/vnpayService");
const prisma = require("../lib/prisma");

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

const vnpayReturn = async (req, res) => {
  const vnp_Params = req.query;

  if (vnpayService.verifyReturn(vnp_Params)) {
    const orderId = vnp_Params["vnp_TxnRef"].split("-")[1]; // Lấy ID sau dấu gạch ngang
    if (vnp_Params["vnp_ResponseCode"] === "00") {
      // Thanh toán thành công, update db
      await prisma.orders.update({
        where: { id: Number(orderId) },
        data: { status: "paid" },
      });
      return res.redirect("https://gundam-fe.netlify.app/orders?status=success");
    } else {
      // Thanh toán thất bại hoặc user hủy
      return res.redirect("https://gundam-fe.netlify.app/orders?status=failed");
    }
  } else {
    res.status(400).json({ code: "97", message: "Checksum failed" });
  }
};

module.exports = {
  getOrders,
  createOrder,
  vnpayReturn,
};