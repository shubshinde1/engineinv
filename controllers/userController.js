const { validationResult } = require("express-validator");

const Employee = require("../model/employeeModel");

const bcrypt = require("bcrypt");
const randomstring = require("randomstring");

const { sendMail } = require("../helpers/mailer");

const createUser = async (req, res) => {
  try {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        msg: "Validation errors",
        errors: errors.array(),
      });
    }

    const { name, email } = req.body;

    const isExist = await Employee.findOne({ email });

    if (isExist) {
      return res.status(400).json({
        success: false,
        msg: "Email is Already Exist",
      });
    }

    const rowpassword = randomstring.generate(10);
    // const rowpassword = "Tomhardy@12";
    const hashPassword = await bcrypt.hash(rowpassword, 10);

    var obj = {
      name,
      email,
      password: hashPassword,
    };

    if (req.body.auth && req.body.auth == 1) {
      return res.status(400).json({
        success: false,
        msg: "You have not permission to create admin account",
      });
    } else if (req.body.auth) {
      obj.auth = req.body.auth;
    }

    const employee = new Employee(obj);
    const EmployeeData = await employee.save();

    const mailContent = `<p>Hello <span style="font-size: 1rem; font-weight: 700;">${EmployeeData.name},</span></p>
    <p>Hope you are doing well.</P>
    <p>Your Invezza HRMS portal account has been created successfully!..<br>Here is your account details</p>
    <p>Employee id - ${EmployeeData.empid}</br>
    User Name - ${EmployeeData.name}</br>
    Email - ${EmployeeData.email}</br>
    Password - ${rowpassword}</p>
    <p style="color:red">Note:Please never shaer your password with anyone</p>
    <span>Best Regards,</span><br>
    <span style="font-size: 1rem: font-weight: 700;">Team Invezza</span>`;

    sendMail(
      EmployeeData.email,
      `Invezza HRMS Portal Account Created`,
      mailContent
    );

    return res.status(200).json({
      success: true,
      msg: "User Created Successfully",
      data: EmployeeData,
    });
  } catch (error) {
    return res.status(400).json({
      success: false,
      msg: error.message,
    });
  }
};

const viewUser = async (req, res) => {
  try {
    const employesData = await Employee.find({
      _id: {
        $ne: req.employee._id,
      },
    });

    return res.status(200).json({
      success: true,
      msg: "Employees Fetched successfully",
      data: employesData,
    });
  } catch (error) {
    return res.status(400).json({
      success: false,
      msg: error.message,
    });
  }
};

const updateUser = async (req, res) => {
  try {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        msg: "Validation errors",
        errors: errors.array(),
      });
    }

    const { id, name } = req.body;

    const isExist = await Employee.findOne({ _id: id });

    if (!isExist) {
      return res.status(400).json({
        success: false,
        msg: "Employee not Exist",
      });
    }

    var updateObj = {
      name,
    };

    if (req.body.auth != 1) {
      updateObj.auth = req.body.auth;
    }

    const newPassword = req.body.password;
    if (newPassword) {
      const hashPassword = await bcrypt.hash(newPassword, 10);
      updateObj.password = hashPassword;
    }

    if (req.body.status != updateObj.status) {
      updateObj.status = req.body.status;
    }

    const updatedEmployeeData = await Employee.findByIdAndUpdate(
      { _id: id },
      {
        $set: updateObj,
      },
      { new: true }
    );

    const mailContent = `<p>Hello <span style="font-size: 1rem; font-weight: 700;">${updatedEmployeeData.name},</span></p>
    <p>Hope you are doing well.</P>
    <p>Your Invezza HRMS portal account details has been updated successfully!..<br>Here is your new account details</p>
    <p>Employee Id - ${updatedEmployeeData.empid}</br>
    User Name - ${updatedEmployeeData.name}</br>
    Password - ${newPassword}</p>
    <p style="color:red">Note:Please never shaer your password with anyone</p>
    <span>Best Regards,</span><br>
    <span style="font-size: 1rem: font-weight: 700;">Team Invezza</span>`;

    sendMail(
      updatedEmployeeData.email,
      `Invezza HRMS Portal Account Details Updated`,
      mailContent
    );

    return res.status(200).json({
      success: true,
      msg: "Employee Details Updated successfully",
      data: updatedEmployeeData,
    });
  } catch (error) {
    return res.status(400).json({
      success: false,
      msg: error.message,
    });
  }
};

const deleteUser = async (req, res) => {
  try {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        msg: "Validation errors",
        errors: errors.array(),
      });
    }

    const { id } = req.body;

    const isExist = await Employee.findOne({ _id: id });

    if (!isExist) {
      return res.status(400).json({
        success: false,
        msg: "Employee not Exist",
      });
    }

    const updatedEmployeeData = await Employee.findByIdAndDelete({ _id: id });

    return res.status(200).json({
      success: true,
      msg: "Employee Delete successfully",
      data: updatedEmployeeData,
    });
  } catch (error) {
    return res.status(400).json({
      success: false,
      msg: error.message,
    });
  }
};

module.exports = { createUser, viewUser, updateUser, deleteUser };
