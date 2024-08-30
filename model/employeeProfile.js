const mongoose = require("mongoose");

const employeeProfileSchema = new mongoose.Schema(
  {
    employee_id: {
      type: String,
    },
    profileUrl: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Employeeprofile", employeeProfileSchema);
