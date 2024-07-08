const mongoose = require("mongoose");

const timesheetSchema = new mongoose.Schema(
  {
    employee_id: {
      type: mongoose.Schema.Types.ObjectId, //employee model object reference to realtion
      ref: "Employee",
    },
    empid: {
      type: Number, //employee model reference to store builted empid
      ref: "Employee",
      require: true,
    },
    date: {
      type: String,
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
      type: String,
      require: true,
    },
  },
  {
    timestamps: true,
  }
);

timesheetSchema.set("toObject", { getters: true });
timesheetSchema.set("toJSON", { getters: true });

module.exports = mongoose.model("TimeSheet", timesheetSchema);
