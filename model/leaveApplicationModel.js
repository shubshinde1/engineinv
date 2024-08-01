const mongoose = require("mongoose");

const leaveApplicationModel = new mongoose.Schema({
  employee_id: {
    type: mongoose.Schema.Types.ObjectId, //employee model object reference to realtion
    ref: "Employee",
  },
  fromdate: {
    type: String,
  },
  todate: {
    type: String,
  },
  leavetype: {
    type: String,
  },
  reason: {
    type: String,
  },
  status: {
    type: Number, //0 pending, 1 approve, 2 reject
    default: 0,
  },
});

module.exports = mongoose.model("leaveapplication", leaveApplicationModel);
