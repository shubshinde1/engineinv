const onlyAdminAccess = async (req, res, next) => {
  try {
    if (
      req.employee.auth !== 1 &&
      req.employee.auth !== 2 && //HR
      req.employee.auth !== 3 //Manger
    ) {
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
