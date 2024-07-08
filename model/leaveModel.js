const mongoose = require("mongoose");

const leaveModel = new mongoose.Schema({
  empid: {
    type: Number,
    require: true,
    ref: "Employee",
  },
  leavedetails: {
    totalLeaves: {
      type: Number,
      default: 28,
    },
    totalRemainingLeaves: {
      type: Number,
      default: 28,
    },
    leaves: {
      type: Number,
      default: 18,
    },
    remainingLeaves: {
      type: Number,
      default: 18,
    },
    mandatoryHolidays: {
      type: Number,
      default: 8,
    },
    remainingMandatoryHolidays: {
      type: Number,
      default: 8,
    },
    optionalHolidays: {
      type: Number,
      default: 2,
    },
    remainingOptionalHolidays: {
      type: Number,
      default: 2,
    },
  },
  leavehistory: {},
});

module.exports = mongoose.model("leave", leaveModel);
