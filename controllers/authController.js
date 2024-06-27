const Employee = require("../model/employeeModel");

const { validationResult } = require("express-validator");

const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const registerEmployee = async (req, res) => {
  try {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.status(200).json({
        success: false,
        msg: "Errors",
        errors: errors.array(),
      });
    }

    const { name, email, password, phone } = req.body;

    const isExistEmployee = await Employee.findOne({ email });

    if (isExistEmployee) {
      return res.status(200).json({
        success: false,
        msg: "Email already exist",
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const employee = new Employee({
      name,
      email,
      password: hashedPassword,
      phone,
    });

    const employeeData = await employee.save();
    return res.status(200).json({
      success: true,
      msg: "New Employee Registered successfully",
      data: employeeData,
    });
  } catch (error) {
    return res.status(400).json({
      success: false,
      msg: error.message,
    });
  }
};

const generateAccessToken = (employee) => {
  const token = jwt.sign(employee, process.env.ACCESS_TOKEN, {
    expiresIn: "10h",
  });
  return token;
};
const loginEmployee = async (req, res) => {
  try {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.status(200).json({
        success: false,
        msg: "Errors",
        errors: errors.array(),
      });
    }

    const { email, password } = req.body;

    const employeeData = await Employee.findOne({ email });

    if (!employeeData) {
      return res.status(400).json({
        success: false,
        msg: "Email and Password is incorrect",
      });
    }

    const isPasswordMatch = await bcrypt.compare(
      password,
      employeeData.password
    );

    if (!isPasswordMatch) {
      return res.status(400).json({
        success: false,
        msg: "Email and Password is incorrect",
      });
    }

    const asscessToken = generateAccessToken({ employee: employeeData });

    return res.status(200).json({
      success: true,
      msg: "Login Successfully",
      accessToken: asscessToken,
      tokenType: "Bearer",
      data: employeeData,
    });
  } catch (error) {
    return res.status(400).json({
      success: false,
      msg: error.message,
    });
  }
};

module.exports = { registerEmployee, loginEmployee };
