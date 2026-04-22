const cors = require("cors");
const express = require("express");
const userRoute = require("./routes/userRoute");
const { globalError } = require("./middlewares/globalError");
const productRoute = require("./routes/productRoute");
const categoriesRoute = require("./routes/categoriseRoute");
const subCategoryRoute = require("./routes/subCategoryRoute");
const orderRoute = require("./routes/orderRoute");
const path = require("node:path");
const app = express();
const port = 3000;

// Config
app.use(
  cors({
    origin: "*",
    methods: ["GET", "POST", "PATCH", "PUT", "DELETE"],
  }),
);
app.use(express.json());
app.use(express.urlencoded());
app.use(express.static("public"));
app.use(
  "/images",
  express.static(path.join(__dirname, "public/product/images"))
);

// Routes
app.use("/users", userRoute);
app.use("/categories", categoriesRoute);
app.use("/subcategories", subCategoryRoute);
app.use("/products", productRoute);
app.use("/orders", orderRoute);


app.use(globalError);

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
