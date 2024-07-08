const mongoose = require("mongoose");

const attendanceSchema = new mongoose.Schema({
  employee_id: {
    type: mongoose.Schema.Types.ObjectId, //employee model object reference to realtion
    ref: "Employee",
  },
  attendanceHistory: [
    {
      intime: {
        type: String,
        require: true,
      },
      outtime: {
        type: String,
        require: true,
      },
      date: {
        type: String,
        require: true,
      },
      mark: {
        type: String,
        enum: ["In", "Out"],
        require: true,
      },
    },
  ],
});

module.exports = mongoose.model("Attendance", attendanceSchema);
