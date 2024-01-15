const express = require("express");
const authJwt = require("../../../config/auth.middleware");
const router = express.Router();

const CustomersController = require("../controllers/customers.controllers.js");

//Upsert
router.post("/upsert", [authJwt.verifyToken], CustomersController.upsert);

//List of Customer data
router.get("/", [authJwt.verifyToken], CustomersController.findall);

//Select by id
router.get("/findbyid", [authJwt.verifyToken], CustomersController.findbyid);

// Delete
router.post("/delete", [authJwt.verifyToken], CustomersController.delete);

// customer dropdown
router.get(
  "/customerdropdown",
  [authJwt.verifyToken],
  CustomersController.customerdropdown
);

// Managedelete
router.get(
  "/managedelete",
  [authJwt.verifyToken],
  CustomersController.managedelete
);

//Exportexcel
router.post(
  "/exportexcel",
  [authJwt.verifyToken],
  CustomersController.exportexcel
);

//Selected customer
router.get(
  "/customerdetailforlabel",
  [authJwt.verifyToken],
  CustomersController.selectedcustomer
);


//Customer Intake Form upsert
router.post(
  "/intakeformupsert",
  [authJwt.verifyToken],
  CustomersController.intakeformupsert
);

//Customer Undelete
router.post(
  "/undeletecustomer",
  [authJwt.verifyToken],
  CustomersController.undeletecustomer
);

//Customer cleanup
router.post(
  "/cleanupcustomer",
  [authJwt.verifyToken],
  CustomersController.cleanupcustomer
);

//UpsertType
router.post(
  "/upserttype",
  [authJwt.verifyToken],
  CustomersController.upserttype
);

// selecteAllType
router.get(
  "/selectalltype",
  [authJwt.verifyToken],
  CustomersController.selectalltype
);

//UpsertCustomFieldData
router.post(
  "/upsertcustomfield",
  [authJwt.verifyToken],
  CustomersController.upsertcustomfield
);

//Exportexcel
router.get("/allcustomer", [authJwt.verifyToken], CustomersController.findAll);

router.get(
  "/customerdetailforlabel",
  [authJwt.verifyToken],
  CustomersController.selectedcustomer
);


//List of Customer data
router.get(
  "/fieldname",
  [authJwt.verifyToken],
  CustomersController.tableFieldsName
);

// import excel sheet data
router.post(
  "/importdata",
  [authJwt.verifyToken],
  CustomersController.importdata
);

//select by all customer custom field data
router.get(
  "/customercustomgetall",
  [authJwt.verifyToken],
  CustomersController.customercustomgetall
);

// barcode selecteAllType
router.get(
  "/barcodeselectalltype",
  [authJwt.verifyToken],
  CustomersController.barcodeselectalltype
);

// Barcode UpsertType
router.post(
  "/barcodeupsert",
  [authJwt.verifyToken],
  CustomersController.barcodeupsert
);

//Barcode FindbyID
router.get(
  "/barcodefindbyid",
  [authJwt.verifyToken],
  CustomersController.barcodefindbyid
);
// excel export report
router.get(
  "/excelexportlisting",
  [authJwt.verifyToken],
  CustomersController.excelexportlisting
);

router.get(
  "/customerinformation",
  [authJwt.verifyToken],
  CustomersController.customerinformation
);


// Custom Fields Values by ID
// router.get(
//   "/customvalues",
//   [authJwt.verifyToken],
//   CustomersController.customvaluesfindbyid
// );

//Upsert
router.post("/updatecomments", [authJwt.verifyToken], CustomersController.updatecomments);

router.get("/customerstatement",[authJwt.verifyToken],CustomersController.customerstatement);

router.get("/cusomerstoreaccountlist", [authJwt.verifyToken], CustomersController.cusomerstoreaccountlist);

router.get("/customertransactionlist",[authJwt.verifyToken], CustomersController.customertransactionlist)



// { Ecomm users }


router.get("/ecommpendingcustomer", [authJwt.verifyToken], CustomersController.ecommpendingcustomer)


router.post("/ecommuserupsert", [authJwt.verifyToken], CustomersController.ecommuserupsert);

module.exports = router;
