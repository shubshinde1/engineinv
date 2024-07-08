const express = require("express");
const router = express();

const auth = require("../middleware/authMiddleware");

const { onlyAdminAccess } = require("../middleware/adminMiddleware");

const {
  timesheetAddValidator,
  timesheetDeleteValidator,
  timesheetUpdateValidator,
} = require("../helpers/adminValidator");

const {
  createUserValidator,
  updateUserValidator,
  deleteUserValidator,
  employeeAttendanceValidator,
  // ViewAttendanceValidator,
} = require("../helpers/validation");

const timesheetController = require("../controllers/timesheetController");

const userController = require("../controllers/userController");
const attendanceController = require("../controllers/attendanceController");

// timesheet routes
router.post(
  "/filltimesheet",
  auth,
  timesheetAddValidator,
  timesheetController.fillTimesheet
);

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
  auth,
  createUserValidator,
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
  attendanceController.employeeAttendance
);
router.post(
  "/viewattendance",
  auth,
  // ViewAttendanceValidator,
  attendanceController.viewEmployeeAttendance
);

module.exports = router;
