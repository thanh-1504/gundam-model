const {
  handleGetAll,
  handleCreate,
  findCategoryById,
  handleDelete,
} = require("../services/categoriesService");
const AppError = require("../util/AppError");

const getAll = async (req, res) => {
  const categories = await handleGetAll();
  res.json({
    status: "success",
    result: categories.length,
    data: categories,
  });
};

const createCategory = async (req, res) => {
  //   if (!req.body?.name)
  //     throw new AppError("Cung cấp tên loại hàng bạn nhé!", 422);
  const { name } = req.body;
  const newCategory = await handleCreate(name);
  res.json({
    status: "success",
    data: newCategory,
  });
};

const deleteCategory = async (req, res) => {
  await handleDelete(req.params.id);
  res.json({
    status: "sucess",
    data: null,
  });
};

module.exports = {
  getAll,
  createCategory,
  deleteCategory,
};
