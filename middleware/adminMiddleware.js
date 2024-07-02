const onlyAdminAccess = async (req, res, next) => {
  try {
    if (req.employee.auth != 1) {
      return res.status(400).json({
        success: false,
        msg: "You have not admin permissions",
      });
    }
  } catch (error) {
    return res.status(400).json({
      success: false,
      msg: "Something went wrong",
    });
  }

  return next();
};

module.exports = { onlyAdminAccess };
