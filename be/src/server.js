const cors = require("cors");
const express = require("express");
const userRoute = require("./routes/userRoute");
const app = express();
const port = 3000;

// Config
app.use(
  cors({
    origin: "*",
    methods: ["GET", "POST", "PATCH", "DELETE"],
  }),
);
app.use(express.json());

// Routes
app.use("/", (req, res) => {
  res.send("<h1>Thầy truy cập /users để xem thầy nhé :3</h1>");
});
app.use("/users", userRoute);

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
