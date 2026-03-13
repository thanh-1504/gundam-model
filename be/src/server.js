const cors = require("cors");
const express = require("express");
const userRoute = require("./routes/userRoute");
const app = express();
const port = 3000;

// Config
app.use(cors());
app.use(express.json());

// Routes
app.use("/api/users", userRoute);

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
