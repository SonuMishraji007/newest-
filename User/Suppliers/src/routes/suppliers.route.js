const express = require("express");
const authJwt = require("../../../config/auth.middleware");
const router = express.Router();

const suppliersController = require("../controllers/suppliers.controller.js");

//Upsert
router.post("/upsert", [authJwt.verifyToken], suppliersController.upsert);

//List of suppliers data
router.get("/", [authJwt.verifyToken], suppliersController.findAll);

// //select by id
router.get("/findbyid", [authJwt.verifyToken], suppliersController.findbyid);

// For Dropdown Suppliers
router.get("/dropdownsupplier", [authJwt.verifyToken], suppliersController.DropdownSupplier);


// delete multiple
router.post(
  "/batchdelete",
  [authJwt.verifyToken],
  suppliersController.batchdelete
);

//manage delete
router.get(
  "/managedelete",
  [authJwt.verifyToken],
  suppliersController.managedelete
);
// undelete multiple

router.post(
  "/undeletemutiple",
  [authJwt.verifyToken],
  suppliersController.undeletemutiple
);
//mailing lable
router.get(
  "/supplierdetailforlabel",
  [authJwt.verifyToken],
  suppliersController.supplierdetailforlabel
);
//delete permanentely
router.post(
  "/deletepermanantely",
  [authJwt.verifyToken],
  suppliersController.deletepermanantely
);

//Exportexcel
router.post(
  "/exportexcel",
  [authJwt.verifyToken],
  suppliersController.exportexcel
);

router.get(
  "/excelexportlisting",
  [authJwt.verifyToken],
  suppliersController.excelexportlisting
);

//UpsertType
router.post(
  "/upserttype",
  [authJwt.verifyToken],
  suppliersController.upserttype
);

// selecteAllType
router.get(
  "/selectalltype",
  [authJwt.verifyToken],
  suppliersController.selectalltype
);

//UpsertCustomFieldData
router.post(
  "/upsertsuppliercustomfield",
  [authJwt.verifyToken],
  suppliersController.upsertsuppliercustomfield
);

//select by all Supplier custom field data
router.get(
  "/supplierscustomgetall",
  [authJwt.verifyToken],
  suppliersController.supplierscustomgetall
);
//Exportexcel
router.post("/allsupplier", [authJwt.verifyToken], suppliersController.findall);

//List of Customer data
router.get(
  "/fieldnamesupplier",
  [authJwt.verifyToken],
  suppliersController.tableFieldsName
);

// import excel sheet data
router.post(
  "/importdata",
  [authJwt.verifyToken],
  suppliersController.importdata
);

//select by all customer custom field data
router.get(
  "/suppliercustomgetall",
  [authJwt.verifyToken],
  suppliersController.suppliercustomgetall
);

router.get(
  "/supplierinformation",
  [authJwt.verifyToken],
  suppliersController.supplierinformation
);


router.post("/updatecomments", [authJwt.verifyToken], suppliersController.updatecomments);



//supplier Account list
router.get("/supplierstoreaccountlist", [authJwt.verifyToken], suppliersController.supplierstoreaccountlist);

router.get("/supplierstatement",[authJwt.verifyToken],suppliersController.supplierstatement);


module.exports = router;
