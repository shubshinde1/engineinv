const mongoose = require("mongoose");

const SettingsSchema = new mongoose.Schema(
  {
    addtimesheetlimit: {
      type: Number,
      default: 5,
    },
    updatetimesheetlimit: {
      type: Number,
      default: 5,
    },
    deletetimesheetlimit: {
      type: Number,
      default: 5,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Setting", SettingsSchema);
