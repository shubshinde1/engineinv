const Employee = require("../model/employeeModel");
const EmployeeDetail = require("../model/employeeDetailsModel");

const { validationResult } = require("express-validator");

const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const generateAccessToken = (employee) => {
  const token = jwt.sign(employee, process.env.ACCESS_TOKEN, {
    expiresIn: "10h",
  });
  return token;
};

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

    const isExistEmployee = await Employee.findOne({ email }).populate("eid");

    if (isExistEmployee) {
      return res.status(200).json({
        success: false,
        msg: "Email already exist",
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const employee = new Employee({
      empid,
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
        msg: "Invalid Email And Password",
      });
    }

    const isPasswordMatch = await bcrypt.compare(
      password,
      employeeData.password
    );

    if (!isPasswordMatch) {
      return res.status(400).json({
        success: false,
        msg: "Invalid Email And Password",
      });
    }

    const asscessToken = generateAccessToken({ employee: employeeData });

    const empdata = { asscessToken, employeeData };

    return res.status(200).json({
      success: true,
      msg: "Login Successfully",
      accessToken: asscessToken,
      usertype: employeeData.auth,
      tokenType: "Bearer",
      data: empdata,
    });
  } catch (error) {
    return res.status(400).json({
      success: false,
      msg: error.message,
    });
  }
};

const getProfile = async (req, res) => {
  const employee_Id = req.employee.empid;
  const employeeData = await Employee.findOne({ empid: employee_Id }).populate(
    "employeedetails"
  );

  try {
    return res.status(200).json({
      success: true,
      msg: "Profile Data",
      data: employeeData,
    });
  } catch (error) {
    return res.status(400).json({
      success: false,
      msg: error.message,
    });
  }
};

const deleteEmployee = async (req, res) => {
  try {
    const { id } = req.body;

    // Check if the employee exists
    const employee = await Employee.findById(id);
    if (!employee) {
      return res.status(404).json({
        success: false,
        msg: "Employee not found",
      });
    }

    // Delete the employee
    await Employee.findByIdAndDelete(id);

    return res.status(200).json({
      success: true,
      msg: "Employee deleted successfully",
    });
  } catch (error) {
    return res.status(400).json({
      success: false,
      msg: error.message,
    });
  }
};

const employeedetails = async (req, res) => {
  try {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.status(200).json({
        success: false,
        msg: "Errors",
        errors: errors.array(),
      });
    }

    const {
      eid,
      dob,
      gender,
      maritialstatus,
      bloodgroup,
      dateofjoining,
      desiganation,
      department,
      reportingto,
      teamleader,
      techexperties,
      address,
      city,
      state,
      country,
      zipcode,
      emergencypersonname,
      relation,
      profession,
      emergencypersonaddress,
      emergencypersonemail,
      emergencypersonphone,
      jobtitle,
      companyname,
      companylinkedinurl,
      employeementtype,
      startdate,
      enddate,
      description,
      adharcard,
      pancard,
      addressproof,
      electricitybil,
      previousorgofferlatter,
      previousorgexperiencelatter,
      payslip1,
      payslip2,
      payslip3,
    } = req.body;

    const isExistEmployeeDetails = await EmployeeDetail.findOne({
      eid,
    }).populate("empid");

    if (isExistEmployeeDetails) {
      return res.status(200).json({
        success: false,
        msg: "Employee details already exist",
      });
    }

    const employeeetail = new EmployeeDetail({
      eid,
      dob,
      gender,
      maritialstatus,
      bloodgroup,
      dateofjoining,
      desiganation,
      department,
      reportingto,
      teamleader,
      techexperties,
      address,
      city,
      state,
      country,
      zipcode,
      emergencypersonname,
      relation,
      profession,
      emergencypersonaddress,
      emergencypersonemail,
      emergencypersonphone,
      jobtitle,
      companyname,
      companylinkedinurl,
      employeementtype,
      startdate,
      enddate,
      description,
      adharcard,
      pancard,
      addressproof,
      electricitybil,
      previousorgofferlatter,
      previousorgexperiencelatter,
      payslip1,
      payslip2,
      payslip3,
    });

    const employeeDetailData = await employeeetail.save();
    return res.status(200).json({
      success: true,
      msg: "New Employee Details Added successfully",
      data: employeeDetailData,
    });
  } catch (error) {
    return res.status(400).json({
      success: false,
      msg: error.message,
    });
  }
};

const updateemployeebyadmin = async (req, res) => {
  try {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        msg: "Validation errors",
        errors: errors.array(),
      });
    }

    const {
      _id,
      name,
      email,
      password,
      phone,
      status,
      dob,
      gender,
      maritialstatus,
      bloodgroup,
      dateofjoining,
      designation,
      department,
      reportingto,
      teamleader,
      techexperties,
      address,
      city,
      state,
      country,
      zipcode,
      emergencypersonname,
      relation,
      profession,
      emergencypersonaddress,
      emergencypersonemail,
      emergencypersonphone,
      workexperience,
    } = req.body;

    const isExist = await Employee.findOne({ _id: _id });

    if (!isExist) {
      return res.status(400).json({
        success: false,
        msg: "Employee not Exist",
      });
    }

    var updateObj = {
      name,
      email,
      password,
      phone,
      status,
      _id,
      name,
      password,
      phone,
      status,
      dob,
      gender,
      maritialstatus,
      bloodgroup,
      dateofjoining,
      designation,
      department,
      reportingto,
      teamleader,
      techexperties,
      address,
      city,
      state,
      country,
      zipcode,
      emergencypersonname,
      relation,
      profession,
      emergencypersonaddress,
      emergencypersonemail,
      emergencypersonphone,
      workexperience,
    };

    const newPassword = req.body.password;
    if (newPassword) {
      const hashPassword = await bcrypt.hash(newPassword, 10);
      updateObj.password = hashPassword;
    }

    if (req.body.status != updateObj.status) {
      updateObj.status = req.body.status;
    }

    const updatedEmployeeData = await Employee.findByIdAndUpdate(
      { _id: _id },
      {
        $set: updateObj,
      },
      { new: true }
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

module.exports = {
  registerEmployee,
  loginEmployee,
  getProfile,
  deleteEmployee,
  employeedetails,
  updateemployeebyadmin,
};
