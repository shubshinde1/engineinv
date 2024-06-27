const mongoose = require("mongoose");

const attendanceSchema = new mongoose.Schema({
  empid: {
    type: mongoose.Schema.Types.ObjectId,
    require: true,
    ref: "Employee",
  },
  date: {
    type: Date,
    require: true,
  },
  mark: {
    type: String,
    enum: ["Present", "Absent"],
    default: "Absent",
    require: true,
  },
  attendanceHistory: [
    {
      date: {
        type: Date,
        require: true,
      },
      mark: {
        type: String,
        enum: ["Present", "Absent"],
        default: "Absent",
        require: true,
      },
    },
  ],
  leaveDetails: {
    totalLeaves: {
      type: Number,
      default: 28,
      require: true,
    },
    totalRemainingLeaves: {
      type: Number,
      default: 28,
      require: true,
    },
    leaves: {
      type: Number,
      default: 18,
      require: true,
    },
    remainingLeaves: {
      type: Number,
      default: 18,
      require: true,
    },
    mandatoryHolidays: {
      type: Number,
      default: 8,
      require: true,
    },
    remainingMandatoryHolidays: {
      type: Number,
      default: 8,
      require: true,
    },
    optionalHolidays: {
      type: Number,
      default: 2,
      require: true,
    },
    remainingOptionalHolidays: {
      type: Number,
      default: 2,
      require: true,
    },
  },
});

module.exports = mongoose.model("Attendance", attendanceSchema);
