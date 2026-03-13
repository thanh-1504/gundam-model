const cors = require("cors");
const express = require("express");
const userRoute = require("./routes/userRoute");
const app = express();
const port = 3000;

// Config
app.use(cors({
  origin: '*', // Cho phép tất cả các nguồn truy cập
  methods: ['GET', 'POST', 'PATCH', 'DELETE'],
}));
app.use(express.json());

// Routes
app.use("/users", userRoute);

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
