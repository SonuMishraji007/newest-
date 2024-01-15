"use strict";
// var dbConn = require('../../../Authentication/config/db.config');
var dbConn = require("../../../config/db.config");
var js2xmlparser = require("js2xmlparser");

var Suppliers = function (suppliers) {};

Suppliers.upsert = function (req, quickbookid, result) {
  let xmlsuppliertax = "";
  const xmlsuppliertaxdata = JSON.parse(req.xmlsuppliertax);
  xmlsuppliertax = js2xmlparser.parse(
    "suppliersTaxXMLdata",
    xmlsuppliertaxdata
  );
  xmlsuppliertax = xmlsuppliertax.replace((/&amp;/g, "&"));

  let xmlsupplierfiles = "";
  const xmlsupplierfilesdata = JSON.parse(req.xmlsupplierfiles);
  xmlsupplierfiles = js2xmlparser.parse(
    "suppliersFilesXMLdata",
    xmlsupplierfilesdata
  );
  xmlsupplierfiles = xmlsupplierfiles.replace((/&amp;/g, "&"));

  // This for the custom fields upsert
  let xmlcustomfieldvalue = "";
  const xmlcustomfieldvaluedata = JSON.parse(req.xmlcustomfieldvalue);
  xmlcustomfieldvalue = js2xmlparser.parse(
    "customFieldXMLdata",
    xmlcustomfieldvaluedata
  );
  xmlcustomfieldvalue = xmlcustomfieldvalue.replace(/&amp;/g, "&");

  dbConn.query(
    "call proc_suppliers_upsert(?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)",
    [
      xmlsuppliertax,
      xmlsupplierfiles,
      xmlcustomfieldvalue,
      req.id,
      req.companyname,
      req.balance,
      req.firstname,
      req.lastname,
      req.email,
      req.phonenumber,
      req.selectimage,
      req.address1,
      req.address2,
      req.city,
      req.state,
      req.zip,
      req.country,
      req.comments,
      req.internalnotes,
      req.accountnumber,
      req.terms,
      req.isactive,
      req.overridedefaulttax,
      req.openingbalance,
      req.taxgroup,
      req.loginuserid,
      quickbookid,
    ],
    function (err, res) {
      if (err) {
        // result(err, null);
        result(null, 0);
        throw new Error(err);
      } else {
        var insertIDArray = res[0];
        var keyValue = insertIDArray[0].ID;
        result(null, keyValue);
      }
    }
  );
};

Suppliers.findAll = function (req, result) {
  const xmlfiltercolumnsearchtextXmldata =
    req.filtercolumnsearchtext == ""
      ? ""
      : JSON.parse(req.filtercolumnsearchtext);

  let xmlfiltercolumnsearchtext = "";

  xmlfiltercolumnsearchtext = js2xmlparser.parse(
    "FilterColumnTextXmlData",
    xmlfiltercolumnsearchtextXmldata
  );

  xmlfiltercolumnsearchtext = xmlfiltercolumnsearchtext.replace(/&amp;/g, "&");
  dbConn.query(
    "call proc_suppliers_selectall(?,?,?,?,?,?,?,?)",
    [
      req.pagenumber,
      req.pagesize,
      req.filtertext,
      req.ordercolumn,
      req.currentorder,
      req.startdate,
      req.enddate,
      xmlfiltercolumnsearchtext,
    ],
    function (err, res) {
      if (err) {
        // result(err, null);
        result(null, 0);
        throw new Error(err);
      } else {
        result(null, res[0]);
      }
    }
  );
};

Suppliers.findbyid = function (req, result) {
  dbConn.query(
    "call proc_suppliers_selectbyid(?)",
    [req.id],
    function (err, res) {
      if (err) {
        // result(err, null);
        result(null, 0);
        throw new Error(err);
      } else {
        let obj = {
          Items: res[0],
          SuppliersTax: res[1],
          SuppliersFiles: res[2],
          CustomFieldValues: res[3],
        };
        result(null, obj);
      }
    }
  );
};

// For Dropdown Suppliers
Suppliers.DropdownSupplier = function (req, result) {
  dbConn.query("call proc_Supplier_for_dropdown()", [], function (err, res) {
    if (err) {
      result(null, 0);
      throw new Error(err);
    } else {
      result(null, res[0]);
    }
  });
};

Suppliers.excelexportlisting = function (req, result) {
  dbConn.query(
    "call proc_supplier_excelexport_listing(?,?,?)",
    [req.filtertext, req.startdate, req.enddate],
    function (err, res) {
      if (err) {
        // result(err, null);
        result(null, 0);
        throw new Error(err);
      } else {
        result(null, res[0]);
      }
    }
  );
};

Suppliers.batchdelete = function (req, result) {
  dbConn.query(
    "call proc_suppliers_delete_multiple(?)",
    [req.supplierids],
    function (err, res) {
      if (err) {
        // result(err, null);
        result(null, 0);
        throw new Error(err);
      } else {
        result(null, res[0]);
      }
    }
  );
};

Suppliers.managedelete = function (req, result) {
  dbConn.query(
    "call  proc_suppliers_managedelete(?,?,?,?,?)",
    [
      req.pagenumber,
      req.pagesize,
      req.filtertext,
      req.ordercolumn,
      req.currentorder,
    ],
    function (err, res) {
      console.log("res", res);
      if (err) {
        // result(err, null);
        result(null, 0);
        throw new Error(err);
      } else {
        result(null, res[0]);
      }
    }
  );
};

Suppliers.undeletemutiple = function (req, result) {
  dbConn.query(
    "call proc_suppliers_undelete_multiple(?)",
    [req.supplierids],
    function (err, res) {
      if (err) {
        // result(err, null);
        result(null, 0);
        throw new Error(err);
      } else {
        result(null, res[0]);
      }
    }
  );
};

Suppliers.supplierdetailforlabel = function (req, result) {
  dbConn.query(
    "call proc_suppliers_get_selected_suppliers(?)",
    [req.supplierids],
    function (err, res) {
      if (err) {
        // result(err, null);
        result(null, 0);
        throw new Error(err);
      } else {
        result(null, res[0]);
      }
    }
  );
};

Suppliers.deletepermanantely = function (req, result) {
  dbConn.query(
    "call proc_suppliers_delete_permenetly()",
    [],
    function (err, res) {
      if (err) {
        // result(err, null);
        result(null, 0);
        throw new Error(err);
      } else {
        result(null, res[0]);
      }
    }
  );
};
Suppliers.exportexcel = function (req, result) {
  dbConn.query(
    "call proc_suppliers_ExportSuppliers(?,?,?)",
    [req.filtertext, req.ordercolumn, req.currentorder],
    function (err, res) {
      console.log("res", res);
      if (err) {
        result(null, 0);
        throw new Error(err);
      } else {
        result(null, res[0]);
      }
    }
  );
};
Suppliers.upserttype = function (req, result) {
  dbConn.query(
    "call proc_custom_control_Type_upsert(?,?,?)",
    [req.id, req.name, req.loginuserid],
    function (err, res) {
      if (err) {
        console.log("error: ", err);
        result(err, null);
      } else {
        var insertIDArray = res[0];
        var keyValue = insertIDArray[0].ID;
        result(null, keyValue);
      }
    }
  );
};
Suppliers.selectalltype = function (req, result) {
  dbConn.query("call proc_custom_control_Typeselectall()", function (err, res) {
    if (err) {
      // result(err, null);
      result(null, 0);
      throw new Error(err);
    } else {
      result(null, res[0]);
    }
  });
};
Suppliers.upsertsuppliercustomfield = function (req, result) {
  let xmlcustomfield = "";
  const xmlcustomfieldXmldata = JSON.parse(req.xmlcustomfield);
  xmlcustomfield = js2xmlparser.parse(
    "customfieldXmldata",
    xmlcustomfieldXmldata
  );
  xmlcustomfield = xmlcustomfield.replace(/&amp;/g, "&");

  dbConn.query(
    "call proc_supplier_custom_field_upsert(?,?)",
    [xmlcustomfield, req.loginuserid],
    function (err, res) {
      if (err) {
        console.log("error: ", err);
        result(err, null);
      } else {
        var insertIDArray = res[0];
        var keyValue = insertIDArray[0].ID;
        result(null, keyValue);
      }
    }
  );
};

Suppliers.supplierscustomgetall = function (req, result) {
  dbConn.query(
    "call proc_supplier_customfield_getall(?)",
    [req.id],
    function (err, res) {
      // console.log("resgetbyid", res);
      if (err) {
        // result(err, null);
        result(null, 0);
        throw new Error(err);
      } else {
        let obj = {
          count: res[1][0].SupplierIdCount,
          customefield: res[0],
        };
        result(null, obj);
      }
    }
  );
};

Suppliers.findall = function (req, result) {
  dbConn.query(
    "CALL proc_suppliers_ExportAllExistingSupplier()",
    function (err, res) {
      if (err) {
        result(null, 0);
        throw new Error(err);
      } else {
        result(null, res[0]);
      }
    }
  );
};

Suppliers.tableFieldsName = function (req, result) {
  dbConn.query("CALL proc_suppliers_fieldName()", function (err, res) {
    if (err) {
      result(null, 0);
      throw new Error(err);
    } else {
      result(null, res[0]);
    }
  });
};

Suppliers.importdata = function (req, result) {
  let xmlImportData = "";
  const importXmlData = JSON.parse(req.xmlImportData);
  xmlImportData = js2xmlparser.parse("ImportXmlData", importXmlData);
  xmlImportData = xmlImportData.replace(/&amp;/g, "&");

  dbConn.query(
    "call proc_suppliers_importexceldata(?,?)",
    [xmlImportData, req.loginUserId],
    function (err, res) {
      if (err) {
        result(null, 0);
        throw new Error(err);
      } else {
        var insertIDArray = res[0];
        var keyValue = insertIDArray[0].ID;
        result(null, keyValue);
      }
    }
  );
};

Suppliers.suppliercustomgetall = function (req, result) {
  dbConn.query(
    "call proc_supplier_customfield_getall(?)",
    [req.id],
    function (err, res) {
      if (err) {
        // result(err, null);
        result(null, 0);
        throw new Error(err);
      } else {
        let obj = {
          count: res[1][0].SupplierIdCount,
          customefield: res[0],
        };
        result(null, obj);
      }
    }
  );
};

Suppliers.supplierinformation = function (req, result) {
  dbConn.query(
    "call proc_supplier_information(?)",
    [req.supplierid],
    function (err, res) {
      if (err) {
        // result(err, null);
        result(null, 0);
        throw new Error(err);
      } else {
        let obj = {
          SupplierDetails: res[0],
          FilesDetails: res[1],
          TaxDetails: res[2],
          CustomFieldValues: res[3],
          ReceivingDetails: res[4],
          PaymentReceived: res[5],
          StoreAccount: res[6],
          PurchaseOrder: res[7],
          VendorCredit: res[8],
        };
        result(null, obj);
      }
    }
  );
};

Suppliers.updatecomments = function (req, result) {
  dbConn.query(
    "call proc_suppliers_updatecomments(?,?,?,?)",
    [req.id, req.content, req.contenttype, req.loginuserid],
    function (err, res) {
      if (err) {
        console.log("error: ", err);
        result(null, 0);
        throw new Error(err);
      } else {
        console.log("res", res);
        var insertIDArray = res[0];
        var keyValue = insertIDArray[0].ID;
        result(null, keyValue);
      }
    }
  );
};

//Supplier Account List
Suppliers.supplierstoreaccountlist = function (req, result) {
  dbConn.query(
    "call proc_suppliers_storeaccount_list(?,?,?,?,?,?,?,?,?)",
    [
      req.pagenumber,
      req.pagesize,
      req.filtertext,
      req.ordercolumn,
      req.currentorder,
      req.LocationID,
      req.supplierid,
      req.startdate,
      req.enddate,
    ],
    function (err, res) {
      if (err) {
        // console.log("error: ", err);
        result(null, 0);
        throw new Error(err);
      } else {
        // console.log("res", res);
        result(null, res[0]);
      }
    }
  );
};

Suppliers.supplierstatement = function (req, result) {
  dbConn.query(
    "call proc_suppliers_statement(?,?,?)",
    [req.startdate, req.enddate, req.supplierid],
    function (err, res) {
      if (err) {
        // result(err, null);
        result(null, 0);
        throw new Error(err);
      } else {
        let obj = {
          StatementList: res[0],
          SupplierDetails: res[1],
        };
        result(null, obj);
      }
    }
  );
};

module.exports = Suppliers;
