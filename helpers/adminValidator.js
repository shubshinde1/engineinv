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
  check("date", "date is required and should be within the last 5 days")
    .not()
    .isEmpty()
    .toDate()
    .custom((value) => {
      const inputDate = new Date(value);
      const currentDate = new Date();
      const fiveDaysAgo = new Date(currentDate);
      fiveDaysAgo.setDate(currentDate.getDate() - 5);

      if (inputDate > currentDate) {
        throw new Error("Date cannot be in the future");
      }
      if (inputDate < fiveDaysAgo) {
        throw new Error(
          "Sorry.. tasks cannot be added for dates older than 5 days."
        );
      }
      return true;
    }),
  check("taskName", "Task Name is required").not().isEmpty(),
  check("description", "Add description to your task").not().isEmpty(),
  check("duration", "Add duration of your task").not().isEmpty(),
  check("project", "Specify your working project").not().isEmpty(),
  check("remark", "Specify your task status").not().isEmpty(),
];

exports.getTimesheetByDateValidator = [
  check("employee_id", "employee_id is required").not().isEmpty(),
];

exports.timesheetDeleteValidator = [
  check("timesheetId", "timesheetId is required to delete").not().isEmpty(),
  check("taskId", "taskId is required to delete").not().isEmpty(),
  check("date", "date is required and should be within the last 5 days")
    .not()
    .isEmpty()
    .toDate()
    .custom((value) => {
      const inputDate = new Date(value);
      const currentDate = new Date();
      const fiveDaysAgo = new Date(currentDate);
      fiveDaysAgo.setDate(currentDate.getDate() - 5);

      if (inputDate < fiveDaysAgo) {
        throw new Error("You can not delete task older than 5 days");
      }
      return true;
    }),
];

exports.timesheetUpdateValidator = [
  check("timesheet_id", "timesheet_id is required to update").not().isEmpty(),
  check("task_id", "task_id is required to update").not().isEmpty(),
  check("taskName", "taskName is required").not().isEmpty(),
  check("date", "date is required")
    .not()
    .isEmpty()
    .isISO8601()
    .withMessage("Invalid date format")
    .toDate()
    .custom((value) => {
      const inputDate = new Date(value);
      const currentDate = new Date();
      const fiveDaysAgo = new Date(
        currentDate.setDate(currentDate.getDate() - 5)
      );
      if (inputDate < fiveDaysAgo) {
        throw new Error("Sorry.. You can not update task older than 5 days");
      }
      return true;
    }),
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
