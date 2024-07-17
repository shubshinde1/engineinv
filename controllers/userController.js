const { validationResult } = require("express-validator");

const Employee = require("../model/employeeModel");
const PasswordReset = require("../model/passwordReset");

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

    const { name, email, phone, password } = req.body;

    const isExist = await Employee.findOne({ email });

    if (isExist) {
      return res.status(400).json({
        success: false,
        msg: "Email is Already Exist",
      });
    }

    // const rowpassword = randomstring.generate(10);
    // const rowpassword = "Tomhardy@12";
    const hashPassword = await bcrypt.hash(password, 10);

    var obj = {
      name,
      email,
      phone,
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
    Password - ${password}</p>
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

const forgotPassword = async (req, res) => {
  try {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.status(200).json({
        success: false,
        msg: "Errors",
        errors: errors.array(),
      });
    }

    const { email } = req.body;

    const userData = await Employee.findOne({ email });

    if (!userData) {
      return res.status(400).json({
        success: false,
        msg: "Email id does not exist!..",
      });
    }

    const randonString = randomstring.generate();

    const msg =
      "<p>Hii " +
      userData.name +
      ', Please click <a href="http://localhost:3000/api/resetpassword?token=' +
      randonString +
      '">Here<a/> to reset your Inezaa HRMS Portal password<p/>';

    await PasswordReset.deleteMany({ emp_id: userData._id });

    const passwordReset = new PasswordReset({
      emp_id: userData._id,
      token: randonString,
    });

    await passwordReset.save();

    sendMail(userData.email, "Reset Password", msg);

    return res.status(200).json({
      success: true,
      msg: "Reset password link send to your mail",
      data: userData,
    });
  } catch (error) {
    return res.status(400).json({
      success: false,
      msg: error.message,
    });
  }
};

const resetPassword = async (req, res) => {
  try {
    if (req.query.token == undefined) {
      return res.render("400");
    }

    const resetData = await PasswordReset.findOne({ token: req.query.token });

    if (!resetData) {
      return res.render("404");
    }

    return res.render("resetpassword", {
      resetData,
    });
  } catch (error) {
    return res.render("404");
    // .json({
    //   success: false,
    //   msg: error.message,
    // });
  }
};

const updatePassword = async (req, res) => {
  try {
    const { emp_id, password, confirmpassword } = req.body;

    const resetData = await PasswordReset.findOne({ emp_id });

    console.log(resetData);

    if (password != confirmpassword) {
      return res.render("resetpassword", {
        resetData,
        error: "Confirm password Not match",
      });
    }

    const newHashedPassword = await bcrypt.hash(confirmpassword, 10);

    await Employee.findByIdAndUpdate(
      { _id: emp_id },
      {
        $set: {
          password: newHashedPassword,
        },
      }
    );

    await PasswordReset.deleteMany({ emp_id });

    return res.render("resetsuccess");
  } catch (error) {
    return res.render("404");
  }
};

// const resetSuccess = async (req, res) => {
//   try {
//     return res.render("resetsuccess");
//   } catch (error) {
//     return res.render("404");
//   }
// };

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

module.exports = {
  createUser,
  forgotPassword,
  viewUser,
  updateUser,
  deleteUser,
  resetPassword,
  // resetSuccess,
  updatePassword,
};
