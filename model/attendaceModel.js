const mongoose = require("mongoose");

const attendanceSchema = new mongoose.Schema(
  {
    employee_id: {
      type: mongoose.Schema.Types.ObjectId, //employee model object reference to realtion
      ref: "Employee",
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
    intime: {
      type: Date,
      require: true,
    },
    inlocation: {
      type: {
        latitude: { type: Number, required: true },
        longitude: { type: Number, required: true },
      },
      default: { latitude: 0, longitude: 0 }, // Default values can be adjusted
    },
    outtime: {
      type: Date,
      require: true,
    },
    outlocation: {
      type: {
        latitude: { type: Number, required: true },
        longitude: { type: Number, required: true },
      },
      default: { latitude: 0, longitude: 0 }, // Default values can be adjusted
    },
    totalhrs: {
      type: Number, // this hrs will fill when emp send mark = "Out" (intime and outtime's addition)
    },
    attendancestatus: {
      type: Number,
      default: 0, //0 = absent, 1 = present full day(totalhrs > 4), 2= half day(totalhrs < 4hrs)
    },
  },
  { timestamps: true }
);

// Middleware to calculate totalhrs and attendancestatus
attendanceSchema.pre("save", function (next) {
  if (this.mark === "Out" && this.intime && this.outtime) {
    this.totalhrs = this.outtime - this.intime; // store total time in milliseconds
    this.attendancestatus = this.totalhrs >= 4 * 60 * 60 * 1000 ? 1 : 2;
  }
  next();
});

module.exports = mongoose.model("Attendance", attendanceSchema);
