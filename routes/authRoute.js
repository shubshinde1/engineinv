const express = require("express");
const router = express();

router.use(express.json());

const bodyParser = require("body-parser");
router.use(bodyParser.json());
router.use(bodyParser.urlencoded({ extended: true }));

const auth = require("../middleware/authMiddleware");
const authController = require("../controllers/authController");
const userController = require("../controllers/userController");

const { onlyAdminAccess } = require("../middleware/adminMiddleware");

const {
  registerValidator,
  loginValidator,
  forgotPasswordValidator,
} = require("../helpers/validation");

router.post(
  "/register",
  auth,
  onlyAdminAccess,
  registerValidator,
  authController.registerEmployee
);

router.post("/login", loginValidator, authController.loginEmployee);

// router.post("/login", loginValidator, authController.loginEmployee);

router.post(
  "/forgotpassword",
  forgotPasswordValidator,
  userController.forgotPassword
);

router.get("/profile", auth, authController.getProfile);

router.delete("/delete", auth, onlyAdminAccess, authController.deleteEmployee);

module.exports = router;
