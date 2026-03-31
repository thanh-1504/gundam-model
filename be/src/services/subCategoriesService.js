const prisma = require("../lib/prisma");
const AppError = require("../util/AppError");
const { findCategoryById } = require("./categoriesService");

const getAll = async () => {
  return await prisma.subcategories.findMany();
};

const handleCreate = async (data) => {
  const { name, category_id } = data;
  const category = await findCategoryById(category_id);
  if (!category)
    throw new AppError(`Không tìm thấy category với id = ${category_id}`, 422);
  return await prisma.subcategories.create({
    data: {
      name,
      category_id,
    },
  });
};

const handleDelete = async (id) => {
  const subCate = await prisma.subcategories.findUnique({
    where: { id: +id },
    include: { products: true },
  });
  if (!subCate)
    throw new AppError(`Không tìm thấy subcategory với id = ${id}`, 422);
  if (subCate.products && subCate.products.length > 0)
    throw new AppError(
      `Không thể xóa subcategory với id = ${id} do subcategory đang có sản phẩm`,
      422,
    );
  return await prisma.subcategories.delete({ where: { id: +id } });
};

module.exports = {
  getAll,
  handleCreate,
  handleDelete,
};
