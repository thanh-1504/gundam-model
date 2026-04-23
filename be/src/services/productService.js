const prisma = require("../lib/prisma");
const AppError = require("../util/AppError");

const findProductById = async (id) => {
  return await prisma.products.findUnique({
    where: { id: +id },
    include: {
      product_images: true,
    },
  });
};

const handleGetAll = async () => {
  return await prisma.products.findMany({
    include: {
      product_images: true,
    },
    orderBy: {
      id: "desc",
    },
  });
};

const handleCreate = async (data, images) => {
  const {
    name,
    price,
    description,
    category_id,
    subcategory_id,
    location,
    tag,
    stock,
  } = data;

  const newProduct = await prisma.products.create({
    data: {
      name,
      price,
      description,
      category_id,
      subcategory_id,
      location,
      tag,
      stock,
      product_images: {
        create: images.map((img) => ({
          image_url: img.path,
        })),
      },
    },
    include: {
      product_images: true,
    },
  });
  return newProduct;
};

const handleUpdate = async (id, data, images) => {
  const {
    name,
    price,
    description,
    category_id,
    subcategory_id,
    location,
    tag,
    stock,
  } = data;
  const product = await findProductById(id);
  if (!product)
    throw new AppError(`Không tìm thấy sản phẩm với id = ${id}`, 422);

  console.log("Images in handleUpdate:", images);

  const updatedProduct = await prisma.products.update({
    where: { id: +id },
    data: {
      name,
      price,
      description,
      category_id,
      subcategory_id,
      location,
      tag,
      stock,
      ...(images &&
        images.length > 0 && {
          product_images: {
            deleteMany: {
              product_id: +id,
            },
            create: images.map((img) => {
              const imageUrl = img.path || img.secure_url || img.url;
              console.log("Mapping image:", {
                fieldname: img.fieldname,
                originalname: img.originalname,
                imageUrl,
              });
              return {
                image_url: imageUrl,
              };
            }),
          },
        }),
    },
    include: {
      product_images: true,
    },
  });

  console.log("Product updated with images:", updatedProduct);
  return updatedProduct;
};

const handleDelete = async (id) => {
  const product = await findProductById(id);
  if (!product)
    throw new AppError(`Không tìm thấy sản phẩm với id = ${id}`, 422);

  await prisma.products.delete({
    where: { id: +id },
  });

  return { message: "Xóa sản phẩm thành công" };
};

module.exports = {
  handleGetAll,
  handleCreate,
  handleUpdate,
  handleDelete,
};
