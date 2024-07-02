const mongoose = require("mongoose");

const roleSchema = new mongoose.Schema({
  role_name: {
    type: String,
    require: true,
  },
  value: {
    type: Number,
    require: true,
  },
});

module.exports = mongoose.model("Role", roleSchema);
