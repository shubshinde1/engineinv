
const mongoose = require("mongoose");

const SettingsSchema = new mongoose.Schema(
  {
    timesheet: {
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
    department: {
      type: [String],
      default: [],
    },
    country: {
      type: [String],
      default: [],
    },
    reportingTo: {
      type: [String],
      default: [],
    },
    designation: {
      type: [String],
      default: [],
    },

  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Setting", SettingsSchema);



// const mongoose = require("mongoose");

// const SettingsSchema = new mongoose.Schema(
//   {
//     addtimesheetlimit: {
//       type: Number,
//       default: 5,
//     },
//     updatetimesheetlimit: {
//       type: Number,
//       default: 5,
//     },
//     deletetimesheetlimit: {
//       type: Number,
//       default: 5,
//     },
//   },
//   {
//     timestamps: true,
//   }
// );

// module.exports = mongoose.model("Setting", SettingsSchema);



