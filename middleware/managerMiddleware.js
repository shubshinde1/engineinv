const onlyManagerAccess = async (req, res, next) => {
  try {
    if (req.employee.auth !== 3) {
      return res.status(400).json({
        success: false,
        msg: "You have not manager permissions",
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

module.exports = { onlyManagerAccess };
