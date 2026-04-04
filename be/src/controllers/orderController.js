const {
  handleCreateOrder,
  handleGetOrders,
} = require("../services/orderService");
const vnpayService = require("../services/vnpayService");
const momoService = require("../services/momoService");
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

const momoReturn = async (req, res) => {
  const queryData = req.query;

  // Chữ ký hợp lệ
  if (momoService.verifySignature(queryData)) {
    // Mã resultCode = 0 có nghĩa là giao dịch thành công
    if (queryData.resultCode === "0") {
      const orderIdStr = queryData.orderId.split("-").pop(); // Lấy ID cuối cùng
      const orderId = Number(orderIdStr);

      await prisma.orders.update({
        where: { id: orderId },
        data: { status: "paid" },
      });
      return res.redirect("https://gundam-fe.netlify.app/orders?status=success");
    } else {
      // Thanh toán momo thất bại hoặc huỷ
      return res.redirect("https://gundam-fe.netlify.app/orders?status=failed");
    }
  } else {
    // Sai chữ ký
    return res.redirect("https://gundam-fe.netlify.app/orders?status=invalid_signature");
  }
};

const momoIpn = async (req, res) => {
  // Webhook được momo gọi ngầm (server-to-server)
  const bodyData = req.body;
  if (momoService.verifySignature(bodyData)) {
    if (bodyData.resultCode === 0) {
      const orderIdStr = bodyData.orderId.split("-").pop();
      const orderId = Number(orderIdStr);

      await prisma.orders.update({
        where: { id: orderId },
        data: { status: "paid" },
      });
    }
    return res.status(204).json({});
  }
  return res.status(400).json({});
};

module.exports = {
  getOrders,
  createOrder,
  vnpayReturn,
  momoReturn,
  momoIpn,
};