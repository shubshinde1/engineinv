const { check } = require("express-validator");

exports.permissionAddValidator = [
  check("permission_name", "Permission Name is required").not().isEmpty(),
];

exports.permissionDeleteValidator = [
  check("id", "Id is required to delete").not().isEmpty(),
];

exports.permissionUpdateValidator = [
  check("id", "Id is required to update").not().isEmpty(),
  check("permission_name", "Permission Name is required to update")
    .not()
    .isEmpty(),
];

exports.timesheetAddValidator = [
  check("date", "date is required").not().isEmpty().toDate(),
  check("taskName", "taskName is required").not().isEmpty(),
  check("description", "Add description to your efforts").not().isEmpty(),
  check("duration", "Specify your duration on this task").not().isEmpty(),
];

exports.timesheetDeleteValidator = [
  check("id", "Id is required to delete").not().isEmpty(),
];

exports.timesheetUpdateValidator = [
  check("id", "Id is required to delete").not().isEmpty(),
  check("taskName", "taskName is required").not().isEmpty(),
];

exports.storeRoleValidator = [
  check("role_name", "role_name is required").not().isEmpty(),
  check("value", "value is required").not().isEmpty(),
];
