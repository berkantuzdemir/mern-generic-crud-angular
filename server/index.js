const express = require("express");
const cors = require("cors");
require("dotenv").config();
const bodyParser = require("body-parser");
const database = require("./database")();
const path = require("path");

const app = express();
app.use(cors());
const port = process.env.PORT || 5000;

app.use(express.static(__dirname + "/client/build"));
app.use("/img", express.static(__dirname + "/images"));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

const userRouter = require("./routes/user");
app.use("/api/user", userRouter);

const accountRouter = require("./routes/login");
app.use("/api/account", accountRouter);

const dynamicRouter = require("./routes/dynamic");
app.use("/api/dynamic", dynamicRouter);


app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
