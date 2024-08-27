const { attendaceCheck } = require("../controllers/attendanceController");
const { jobAddLeaves } = require("../controllers/admin/leaveAddController");
const {
  jobUpdateOptional,
} = require("../controllers/admin/leaveAddController");

const startJobs = () => {
  attendaceCheck.start();
    jobAddLeaves.start();
    jobUpdateOptional.start();
};

module.exports = startJobs;
