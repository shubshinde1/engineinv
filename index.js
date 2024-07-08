require("dotenv").config();
const mongoose = require("mongoose");
mongoose.connect(process.env.DB_CONNECT);
// mongoose.connect("mongodb://localhost:27017/invhrms");

const port = 4000;

const express = require("express");
const app = express();

app.use(express.json());

app.use(express.static("public"));

//admin routes
const adminRoute = require("./routes/adminRoute");
app.use("/api/admin", adminRoute);

//main emp loging routes
const authRoute = require("./routes/authRoute");
app.use("/api", authRoute);

//common routes
const commonRoute = require("./routes/commonRoute");
app.use("/api", commonRoute);

app.listen(port, () => {
  console.log(`Server is works on port http://localhost:${port}`);
});
