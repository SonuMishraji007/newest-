const express = require("express");
//const authJwt = require("../../../Authentication/src/middleware/auth.middleware");
const authJwt = require("../../../config/auth.middleware");
const router = express.Router();

const EmployeesController = require("../controllers/employees.controller.js");

router.post("/upsert", [authJwt.verifyToken], EmployeesController.upsert);

// edit my profile
router.post(
  "/update",
  //  [authJwt.verifyToken],
  EmployeesController.update
);

// edit my profile
router.post(
  "/updatepassword",
  // [authJwt.verifyToken],
  EmployeesController.updatepassword
);



router.post(
  "/changepassword",
  [authJwt.verifyToken],
  EmployeesController.changepassword
);

router.post(
  "/customfieldupsert",
  [authJwt.verifyToken],
  EmployeesController.customfieldupsert
);
router.get("/", [authJwt.verifyToken], EmployeesController.findall);
router.post(
  "/excelexport",
  [authJwt.verifyToken],
  EmployeesController.excelexport
);
router.get("/findbyid", [authJwt.verifyToken], EmployeesController.findbyid);

router.post(
  "/batchdelete",
  [authJwt.verifyToken],
  EmployeesController.batchdelete
);
router.post(
  "/undeletemutiple",
  [authJwt.verifyToken],
  EmployeesController.undeletemutiple
);
router.post(
  "/deletepermanantely",
  [authJwt.verifyToken],
  EmployeesController.deletepermanantely
);
router.get(
  "/managedelete",
  [authJwt.verifyToken],
  EmployeesController.managedelete
);
router.get(
  "/employeelanguagesdropdown",
  [authJwt.verifyToken],
  EmployeesController.employeelanguagesdropdown
);
router.get(
  "/employeeregisterdropdown",
  [authJwt.verifyToken],
  EmployeesController.employeeregisterdropdown
);
router.get(
  "/employeecommissiondropdown",
  [authJwt.verifyToken],
  EmployeesController.employeecommissiondropdown
);
router.get(
  "/rolesdropdown",
  [authJwt.verifyToken],
  EmployeesController.rolesdropdown
);
router.get(
  "/usersdropdown",
  [authJwt.verifyToken],
  EmployeesController.usersdropdown
);
router.post(
  "/batchdelete",
  [authJwt.verifyToken],
  EmployeesController.batchdelete
);
router.post(
  "/undeletemutiple",
  [authJwt.verifyToken],
  EmployeesController.undeletemutiple
);
router.post(
  "/deletepermanantely",
  [authJwt.verifyToken],
  EmployeesController.deletepermanantely
);
router.get(
  "/managedelete",
  [authJwt.verifyToken],
  EmployeesController.managedelete
);
router.get(
  "/employeelanguagesdropdown",
  [authJwt.verifyToken],
  EmployeesController.employeelanguagesdropdown
);
router.get(
  "/employeeregisterdropdown",
  [authJwt.verifyToken],
  EmployeesController.employeeregisterdropdown
);
router.get(
  "/employeecommissiondropdown",
  [authJwt.verifyToken],
  EmployeesController.employeecommissiondropdown
);
router.get(
  "/rolesdropdown",
  [authJwt.verifyToken],
  EmployeesController.rolesdropdown
);
router.get(
  "/usersdropdown",
  [authJwt.verifyToken],
  EmployeesController.usersdropdown
);
router.post(
  "/permissionupsert",
  [authJwt.verifyToken],
  EmployeesController.permissionupsert
);
router.get(
  "/permissionselectall",
  [authJwt.verifyToken],
  EmployeesController.permissionselectall
);
router.post(
  "/batchdelete",
  [authJwt.verifyToken],
  EmployeesController.batchdelete
);
router.post(
  "/undeletemutiple",
  [authJwt.verifyToken],
  EmployeesController.undeletemutiple
);
router.post(
  "/deletepermanantely",
  [authJwt.verifyToken],
  EmployeesController.deletepermanantely
);
router.get(
  "/managedelete",
  [authJwt.verifyToken],
  EmployeesController.managedelete
);
router.get(
  "/employeelanguagesdropdown",
  [authJwt.verifyToken],
  EmployeesController.employeelanguagesdropdown
);
router.get(
  "/employeeregisterdropdown",
  [authJwt.verifyToken],
  EmployeesController.employeeregisterdropdown
);
router.get(
  "/employeecommissiondropdown",
  [authJwt.verifyToken],
  EmployeesController.employeecommissiondropdown
);
router.get(
  "/rolesdropdown",
  [authJwt.verifyToken],
  EmployeesController.rolesdropdown
);
router.get(
  "/usersdropdown",
  [authJwt.verifyToken],
  EmployeesController.usersdropdown
);
router.post(
  "/permissionupsert",
  [authJwt.verifyToken],
  EmployeesController.permissionupsert
);
router.get(
  "/permissionselectall",
  [authJwt.verifyToken],
  EmployeesController.permissionselectall
);
router.get(
  "/userfindbyid",
  [authJwt.verifyToken],
  EmployeesController.userfindbyid
);

//select by all Employee custom field data
router.get(
  "/employeescustomgetall",
  [authJwt.verifyToken],
  EmployeesController.employeescustomgetall
);

//Selected customer
router.get(
  "/employeedetailforlabel",
  [authJwt.verifyToken],
  EmployeesController.selectedemployee
);

// Delete
router.post("/batchdelete", [authJwt.verifyToken], EmployeesController.delete);

module.exports = router;
