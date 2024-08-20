const express = require("express");
const router = express();

router.use(express.json());

const bodyParser = require("body-parser");
router.use(bodyParser.json());
router.use(bodyParser.urlencoded({ extended: true }));

const auth = require("../middleware/authMiddleware");

const { onlyAdminAccess } = require("../middleware/adminMiddleware");

const {
  timesheetAddValidator,
  getTimesheetByDateValidator,
  timesheetDeleteValidator,
  timesheetUpdateValidator,
} = require("../helpers/adminValidator");

const {
  createUserValidator,
  validate,
  updateUserValidator,
  deleteUserValidator,
  employeeAttendanceValidator,
  viewLeaveRecordsValidator,
  leaveApplicationValidator,
  // ViewAttendanceValidator,
} = require("../helpers/validation");

const timesheetController = require("../controllers/timesheetController");

const userController = require("../controllers/userController");
const attendanceController = require("../controllers/attendanceController");
const leaveController = require("../controllers/leaveController");

// timesheet routes
router.post(
  "/filltimesheet",
  auth,
  timesheetAddValidator,
  timesheetController.fillTimesheet
);
router.post(
  "/gettimesheetbydate",
  auth,
  getTimesheetByDateValidator,
  timesheetController.getTimesheetByDate
);
router.post(
  "/gettimesheetdays",
  auth,
  getTimesheetByDateValidator,
  timesheetController.getTimesheetdays
);

router.get("/getprojectdetails", auth, timesheetController.getProjectDetails);

router.get("/viewtimesheet", auth, timesheetController.viewTimesheet);

router.post(
  "/deletetimesheet",
  auth,
  timesheetDeleteValidator,
  timesheetController.deleteTimesheet
);

router.post(
  "/updatetimesheet",
  auth,
  timesheetUpdateValidator,
  timesheetController.updateTimesheet
);

// create user routes
router.post(
  "/createuser",
  // auth,
  createUserValidator,
  validate,
  userController.createUser
);
router.get("/viewusers", auth, userController.viewUser);
router.post(
  "/updateuser",
  auth,
  updateUserValidator,
  userController.updateUser
);
router.post(
  "/deleteuser",
  auth,
  onlyAdminAccess,
  deleteUserValidator,
  userController.deleteUser
);

//user attendance
router.post(
  "/attendance",
  auth,
  employeeAttendanceValidator,
  attendanceController.markAttendance
);
router.post(
  "/viewattendance",
  auth,
  // ViewAttendanceValidator,
  attendanceController.getAttendance
);

router.get("/resetpassword", userController.resetPassword);
router.post("/resetpassword", userController.updatePassword);
// router.post("/resetsuccess", userController.resetSuccess);

// view leave records
router.post(
  "/viewleaverecords",
  auth,
  viewLeaveRecordsValidator,
  leaveController.getLeaveDetails
);

// leave application
router.post(
  "/leaveapplication",
  auth,
  leaveApplicationValidator,
  leaveController.applyLeave
);
router.post("/leaveapplicationhistory", auth, leaveController.leavehistory);

router.post(
  "/getoptionalholidaylist",
  auth,
  leaveController.getoptinalholidaylist
);

module.exports = router;
