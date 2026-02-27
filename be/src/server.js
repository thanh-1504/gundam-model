const cors = require("cors");
const express = require("express");
const app = express();
const port = 3000;

app.use(cors());
app.get("/", (req, res) => {
  res.json({
    data: [
      { id: 1, name: "Thanh" },
      { id: 2, name: "Test" },
      { id: 3, name: "Thanh Ha" },
    ],
  });
  res.send("Hello World!");
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
