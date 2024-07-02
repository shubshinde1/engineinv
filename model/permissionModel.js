const mongoose = require("mongoose");

const permissionSchema = new mongoose.Schema(
  {
    permission_name: {
      type: String,
      require: true,
    },
    is_default: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Permission", permissionSchema);
