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
  check("employee_id", "employee_id is required").not().isEmpty(),
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

exports.addClientValidator = [
  check("clientname", "clientname is required").not().isEmpty(),
  check("companyname", "companyname is required").not().isEmpty(),
  check("email", "email is required").not().isEmpty(),
  check("phone", "phone is required").not().isEmpty(),
];

exports.updateClientValidator = [
  check("id", "Id is required to delete").not().isEmpty(),
  check("clientname", "clientname is required").not().isEmpty(),
  check("companyname", "companyname is required").not().isEmpty(),
  check("email", "email is required").not().isEmpty(),
  check("phone", "phone is required").not().isEmpty(),
];

exports.addProjectValidator = [
  check("projectname", "projectname is required").not().isEmpty(),
  check("clientid", "clientid is required").not().isEmpty(),
];
exports.updateProjectValidator = [
  check("id", "Id is required to update project details").not().isEmpty(),
  check("projectname", "projectname is required").not().isEmpty(),
];
