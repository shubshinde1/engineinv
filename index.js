require("dotenv").config();
const mongoose = require("mongoose");
mongoose.connect(process.env.DB_CONNECT);
// mongoose.connect("mongodb://localhost:27017/invhrms");

let ejs = require("ejs");

const port = 4000;

const express = require("express");
const cors = require("cors");
const app = express();

app.set("view engine", "ejs");
app.set("views", "./views");

const allowedOrigins = [
  "http://192.168.1.37:5173",
  "http://localhost:5173/login",
  "http://172.30.32.1:5173",
  "https://invezzahrms.shub.space",
  "https://web.postman.co/workspace/invezzahrms~2566b061-a24b-4da1-8e29-cbe4f4d92ade/request/create?requestId=475e63c0-f4e9-481d-92f5-0e56c1458108",
  "https://engineinv-shubshinde1s-projects.vercel.app/api/login",
];

const corsOptions = {
  origin: "*" || allowedOrigins,
  methodS: "GET, POST, PUT, DELETE, PATCH, HEAD",
  credentials: true,
};

app.use(cors(corsOptions));
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

app.listen(process.env.PORT, () => {
  console.log(`Server is works on port http://localhost:${process.env.PORT}`);
});
