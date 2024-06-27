const mongoose = require("mongoose");

const employeeSchema = new mongoose.Schema({
  name: {
    type: String,
    require: true,
  },
  email: {
    type: String,
    require: true,
  },
  password: {
    type: String,
    require: true,
  },
  phone: {
    type: Number,
    default: 0,
  },
  auth: {
    type: Number,
    default: 0,
  },
});

const Employee = (module.exports = mongoose.model("Employee", employeeSchema));
