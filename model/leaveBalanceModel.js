const mongoose = require("mongoose");

const leaveBalanceModel = new mongoose.Schema({
  employee_id: {
    type: mongoose.Schema.Types.ObjectId, //employee model object reference to realtion
    ref: "Employee",
  },
  leaves: {
    total: {
      type: Number,
    },
    available: {
      type: Number,
    },
    consume: {
      type: Number,
    },
  },
  optionalholiday: {
    total: {
      type: Number,
    },
    available: {
      type: Number,
    },
    consume: {
      type: Number,
    },
    optionalholidaylist: [
      {
        name: {
          type: String,
        },
        date: {
          type: String,
        },
      },
    ],
  },
  mandatoryholiday: [
    {
      name: {
        type: String,
      },
      date: {
        type: String,
      },
      greeting: {
        type: String,
      },
    },
  ],
  weekendHoliday: [
    {
      name: {
        type: String,
      },
      date: {
        type: String,
      },
      greeting: {
        type: String,
      },
    },
  ],
});

module.exports = mongoose.model("leavebalance", leaveBalanceModel);
