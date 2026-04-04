const prisma = require("../lib/prisma");
const AppError = require("../util/AppError");

const mapPaymentStatus = (paymentMethod) =>
  paymentMethod === "cod" ? "pending" : "paid";

const normalizeItems = (items) =>
  items.map((item) => ({
    productId: Number(item.productId),
    quantity: Number(item.quantity),
  }));

const handleGetOrders = async (userId) => {
  const where = {};

  if (userId) {
    where.user_id = Number(userId);
  }

  return prisma.orders.findMany({
    where,
    orderBy: { created_at: "desc" },
    include: {
      order_items: {
        include: {
          products: true,
        },
      },
      users: true,
    },
  });
};

const handleCreateOrder = async (payload) => {
  const {
    userId,
    receiverName,
    phone,
    address,
    paymentMethod,
    items,
  } = payload;

  const normalizedItems = normalizeItems(items);
  const productIds = [...new Set(normalizedItems.map((item) => item.productId))];

  if (!normalizedItems.length) {
    throw new AppError("Vui lòng chọn ít nhất một sản phẩm để thanh toán", 400);
  }

  const products = await prisma.products.findMany({
    where: { id: { in: productIds } },
  });

  if (products.length !== productIds.length) {
    throw new AppError("Có sản phẩm trong giỏ không còn tồn tại", 422);
  }

  const productMap = new Map(products.map((product) => [product.id, product]));

  for (const item of normalizedItems) {
    const product = productMap.get(item.productId);

    if (!product) {
      throw new AppError(`Không tìm thấy sản phẩm với id = ${item.productId}`, 422);
    }

    if (product.stock < item.quantity) {
      throw new AppError(
        `Sản phẩm ${product.name} không đủ số lượng trong kho`,
        422,
      );
    }
  }

  const orderItemsData = normalizedItems.map((item) => {
    const product = productMap.get(item.productId);

    return {
      product_id: product.id,
      quantity: item.quantity,
      price: product.price,
    };
  });

  const totalPrice = orderItemsData.reduce((sum, item) => {
    return sum + Number(item.price) * item.quantity;
  }, 0);

  const order = await prisma.$transaction(async (tx) => {
    const createdOrder = await tx.orders.create({
      data: {
        user_id: userId ? Number(userId) : null,
        total_price: totalPrice,
        status: mapPaymentStatus(paymentMethod),
        receiver_name: receiverName,
        phone,
        address,
        order_items: {
          create: orderItemsData.map((item) => ({
            product_id: item.product_id,
            quantity: item.quantity,
            price: item.price,
          })),
        },
      },
      include: {
        order_items: {
          include: {
            products: true,
          },
        },
        users: true,
      },
    });

    await Promise.all(
      normalizedItems.map((item) =>
        tx.products.update({
          where: { id: item.productId },
          data: {
            stock: {
              decrement: item.quantity,
            },
          },
        }),
      ),
    );

    return createdOrder;
  });

  return order;
};

module.exports = {
  handleCreateOrder,
  handleGetOrders,
};