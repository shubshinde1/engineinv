const express = require("express");
const router = express();

const auth = require("../middleware/authMiddleware");

const { onlyAdminAccess } = require("../middleware/adminMiddleware");

const {
  timesheetAddValidator,
  timesheetDeleteValidator,
  timesheetUpdateValidator,
} = require("../helpers/adminValidator");

const timesheetController = require("../controllers/timesheetController");

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

module.exports = router;
