const mongoose = require("mongoose");

const timesheetSchema = new mongoose.Schema({
  empid: {
    type: mongoose.Schema.Types.ObjectId,
    require: true,
    ref: "Employee",
  },
  date: {
    type: Date,
    require: true,
  },
  taskName: {
    type: String,
    require: true,
  },
  subTaskName: {
    type: String,
  },
  description: {
    type: String,
    require: true,
  },
  duration: {
    type: Number,
    require: true,
  },
});

module.exports = mongoose.model("TimeSheet", timesheetSchema);
