const {
  handleGetAll,
  handleCreate,
  handleUpdate,
  handleDelete,
} = require("../services/productService");

const getAll = async (req, res) => {
  const products = await handleGetAll();
  res.json({
    status: "success",
    result: products.length,
    data: products,
  });
};

const createProduct = async (req, res) => {
  try {
    const images = req.files;
   
    const newProduct = await handleCreate(req.body, images);
    res.json({
      status: "success",
      data: newProduct,
    });
  } catch (error) {
    console.error("Create product error:", error);
    res.status(500).json({
      status: "fail",
      message: error.message,
    });
  }
};

const updateProduct = async (req, res) => {
  const id = req.params.id;
  const images = req.files;
  const updatedProduct = await handleUpdate(id, req.body, images);
  res.json({
    status: "success",
    data: updatedProduct,
  });
};

const deleteProduct = async (req, res) => {
  const id = req.params.id;
  await handleDelete(id);
  res.json({
    status: "success",
    data: null,
  });
};

module.exports = {
  getAll,
  createProduct,
  updateProduct,
  deleteProduct,
};
