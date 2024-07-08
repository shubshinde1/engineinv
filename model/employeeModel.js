const mongoose = require("mongoose");
const mongoSequence = require("mongoose-sequence");

const employeeSchema = new mongoose.Schema(
  {
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
    status: {
      type: Number,
      default: 1, // 1 = active, 0 = inactive
    },
    auth: {
      type: Number,
      default: 0, //0 emp 1 admin
    },
  },
  {
    timestamps: true,
  }
);

employeeSchema.plugin(mongoSequence(mongoose), { inc_field: "empid" });

module.exports = mongoose.model("Employee", employeeSchema);
