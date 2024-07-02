const express = require("express");
const router = express();

const auth = require("../middleware/authMiddleware");
const authController = require("../controllers/authController");

const { onlyAdminAccess } = require("../middleware/adminMiddleware");

const { registerValidator, loginValidator } = require("../helpers/validation");

router.post(
  "/register",
  auth,
  onlyAdminAccess,
  registerValidator,
  authController.registerEmployee
);

router.post("/login", loginValidator, authController.loginEmployee);

router.get("/profile", auth, authController.getProfile);

router.delete("/delete", auth, onlyAdminAccess, authController.deleteEmployee);

module.exports = router;
