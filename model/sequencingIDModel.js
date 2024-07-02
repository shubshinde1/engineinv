const mongoose = require("mongoose");

const CounterSchema = new mongoose.Schema({
  _id: {
    type: String,
    require: true,
  },
  seq: {
    type: Number,
    require: true,
  },
});

const Counter = mongoose.model("Counter", CounterSchema);

module.exports = { Counter };
