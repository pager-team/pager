const express = require("express");
const path = require("path");
const app = express();

app.use(express.static(__dirname + "/src/"));

app.get("*", (req, res) => {
  res.sendFile(path.resolve(__dirname, "src/index.html"));
});

app.listen(3000, () => {
  console.log("listening on port 3000");
});
