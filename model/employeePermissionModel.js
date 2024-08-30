const mongoose = require("mongoose");

const employeePermissionSchema = new mongoose.Schema({
  empid: {
    type: mongoose.Schema.Types.ObjectId,
    require: true,
    ref: "Employee",
  },
  permission: [
    {
      permission_name: String,
      permission_value: [Number],
    },
  ],
});

module.exports = mongoose.model("EmployeePermission", employeePermissionSchema);
