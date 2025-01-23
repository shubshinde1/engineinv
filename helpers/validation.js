const { check, validationResult } = require("express-validator");

exports.registerValidator = [
  check("name", "Name is required").not().isEmpty(),
  check("email", "Email is required").isEmail().normalizeEmail({
    gmail_remove_dots: true,
  }),
  check("password", "Password is required").not().isEmpty(),
];

exports.loginValidator = [
  check("email", "Email is required").isEmail().normalizeEmail({
    gmail_remove_dots: true,
  }),
  check("password", "Password is required").not().isEmpty(),
];
exports.otpValidator = [
  check("email", "Email is required").isEmail().normalizeEmail({
    gmail_remove_dots: true,
  }),
  check("otp", "otp is required").not().isEmpty(),
];

exports.forgotPasswordValidator = [
  check("email", "Email is required").isEmail().normalizeEmail({
    gmail_remove_dots: true,
  }),
  // check("password", "Password is required").not().isEmpty(),
];

exports.createUserValidator = [
  check("name", "Name is required").not().isEmpty(),
  check("phone", "Phone is required").not().isEmpty(),
  // check("password", "password is required").not().isEmpty(),
  check("email", "Email is required")
    .isEmail()
    .normalizeEmail({
      gmail_remove_dots: true,
    })
    .custom((value) => {
      if (!value.endsWith("@invezzatechnologies.com")) {
        return res.status(400).json({
          success: false,
          msg: "Outside mail ID is not acceptable",
          errors: errors.array(),
        });
      }
      return true;
    }),
];

exports.validate = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      msg: "Your mail should ends with @invezzatechnologies.com",
      errors: errors.array(),
    });
  }
  next();
};

exports.updateUserValidator = [
  check("id", "id is required").not().isEmpty(),
  check("name", "Name is required").not().isEmpty(),
];

exports.deleteUserValidator = [check("id", "id is required").not().isEmpty()];

exports.employeeAttendanceValidator = [
  check("employee_id", "employee_id is required").not().isEmpty(),
];

exports.addemployeeDetailsValidator = [
  check("eid", "id is required").not().isEmpty(),
  check("gender", "gender is required").not().isEmpty(),
];

exports.addLeavesValidator = [
  check("optionalholiday", "Add atleast one Optional holidays ")
    .isArray()
    .custom(
      (value) =>
        value.length > 0 &&
        value.every((holiday) => holiday.name && holiday.date)
    ),
  check("mandatoryholiday", "Add atleast one Mandatory holidays")
    .isArray()
    .custom(
      (value) =>
        value.length > 0 &&
        value.every(
          (holiday) => holiday.name && holiday.date && holiday.greeting
        )
    ),
];

exports.addHolidayValidator = [];

exports.viewLeaveRecordsValidator = [
  check("employee_id", "employee_id is required").not().isEmpty(),
];

exports.leaveApplicationValidator = [
  check("leavetype", "leavetype is required").not().isEmpty(),
  check("fromdate", "fromdate is required").not().isEmpty(),
  check("todate", "todate is required").not().isEmpty(),
];

exports.deleteLeaveApplicationValidator = [
  check("Employee_id", "Employee_id is required").not().isEmpty(),
  check("applicationId", "applicationId is required").not().isEmpty(),
];

exports.uploadProfilePicValidator = [
  check("Employee_id", "Employee_id is required").not().isEmpty(),
];

exports.viewProfilePicValidator = [
  check("Employee_id", "Employee_id is required").not().isEmpty(),
];
