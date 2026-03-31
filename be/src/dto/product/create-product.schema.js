const Joi = require("joi");
exports.createProductSchema = Joi.object({
  name: Joi.string()
    .required()
    .messages({ "any.required": "Bắt buộc phải có field name" }),
  price: Joi.number().required().messages({
    "number.base": "price phải là số",
    "any.required": "Vui lòng nhập price",
  }),
  description: Joi.string(),
  category_id: Joi.number().required().messages({
    "number.base": "category_id phải là số",
    "any.required": "Vui lòng nhập category id",
  }),
  subcategory_id: Joi.number().required().messages({
    "number.base": "subcategory_id phải là số",
    "any.required": "Vui lòng nhập subcategory_id id",
  }),
  location: Joi.string().default(""),
  tag: Joi.string().default(""),
  stock: Joi.number().default(0),
}).rename("NAME", "name", {
  ignoreUndefined: true,
  override: true,
});
