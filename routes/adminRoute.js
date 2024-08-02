const express = require("express");
const router = express();

const auth = require("../middleware/authMiddleware");

const permissionController = require("../controllers/admin/permissionController");
const roleController = require("../controllers/admin/roleController");
const clientController = require("../controllers/admin/clientController");
const projectController = require("../controllers/admin/projectController");
const leaveAddController = require("../controllers/admin/leaveAddController");

const { onlyAdminAccess } = require("../middleware/adminMiddleware");

const {
  permissionAddValidator,
  permissionDeleteValidator,
  permissionUpdateValidator,
  storeRoleValidator,
  addClientValidator,
  updateClientValidator,
  addProjectValidator,
  updateProjectValidator,
} = require("../helpers/adminValidator");

const {
  addLeavesValidator,
  addHolidayValidator,
} = require("../helpers/validation");

//this routes only accessible from admin role
router.post(
  "/addpermission",
  auth,
  onlyAdminAccess,
  permissionAddValidator,
  permissionController.addPermission
);

router.get(
  "/getpermissions",
  auth,
  onlyAdminAccess,
  permissionController.getPermission
);

router.post(
  "/deletepermissions",
  auth,
  onlyAdminAccess,
  permissionDeleteValidator,
  permissionController.deletePermission
);

router.post(
  "/updatepermissions",
  auth,
  onlyAdminAccess,
  permissionUpdateValidator,
  permissionController.updatePermission
);

//role routes
router.post(
  "/storerole",
  auth,
  onlyAdminAccess,
  storeRoleValidator,
  roleController.storeRole
);

router.get(
  "/getroles",
  auth,
  onlyAdminAccess,
  storeRoleValidator,
  roleController.getroles
);

//client routes
router.post(
  "/addclient",
  auth,
  onlyAdminAccess,
  addClientValidator,
  clientController.addClient
);

router.post(
  "/updateclient", //update and change status
  auth,
  onlyAdminAccess,
  updateClientValidator,
  clientController.updateClient
);

router.get("/viewclient", auth, onlyAdminAccess, clientController.viewClient);

//project routes
router.post(
  "/addproject",
  auth,
  onlyAdminAccess,
  addProjectValidator,
  projectController.addProject
);

router.post(
  "/updateproject",
  auth,
  onlyAdminAccess,
  updateProjectValidator,
  projectController.updateProject
);

router.get(
  "/viewproject",
  auth,
  onlyAdminAccess,
  projectController.viewPorject
);

//leave managemant routes
router.post(
  "/addleaves",
  auth,
  onlyAdminAccess,
  addLeavesValidator,
  leaveAddController.addLeaves
);
router.post(
  "/addholidays",
  auth,
  onlyAdminAccess,
  addHolidayValidator,
  leaveAddController.addHolidays
);
router.post(
  "/viewholidays",
  auth,
  onlyAdminAccess,
  leaveAddController.viewHolidays
);

module.exports = router;
