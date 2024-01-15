"use strict";
var dbConn = require("../../../config/db.config");
var js2xmlparser = require("js2xmlparser");
// const fs = require("fs");
// const XLSX = require("xlsx");
var Customers = function (customers) { };

// const path = require('path');
// const xlsx = require('xlsx');

Customers.upsert = function (req,quickbookid, result) {
  console.log("req", req);
  console.log(quickbookid,"quickbookid12345")

  // let xmlcustomertax = "";
  // const xmlcustomertaxdata  = JSON.parse(req.xmlcustomertax);
  // xmlcustomertax = js2xmlparser.parse("customerTaxXMLdata", xmlcustomertaxdata);
  // xmlcustomertax = xmlcustomertax.replace(/&amp;/g, '&')

  // let xmlcustomerfiles = "";
  // const xmlcustomerfilesdata  = JSON.parse(req.xmlcustomerfiles);
  // xmlcustomerfiles = js2xmlparser.parse("customerFilesXMLdata", xmlcustomerfilesdata);
  // xmlcustomerfiles = xmlcustomerfiles.replace(/&amp;/g, '&')

  let xmlcustomertax = "";
  const xmlcustomertaxdata = JSON.parse(req.xmlcustomertax);
  xmlcustomertax = js2xmlparser.parse("customerTaxXMLdata", xmlcustomertaxdata);
  xmlcustomertax = xmlcustomertax.replace(/&amp;/g, "&");

  // This for the custom fields upsert
  let xmlcustomfieldvalue = "";
  const xmlcustomfieldvaluedata = JSON.parse(req.xmlcustomfieldvalue);
  xmlcustomfieldvalue = js2xmlparser.parse(
    "customFieldXMLdata",
    xmlcustomfieldvaluedata
  );
  xmlcustomfieldvalue = xmlcustomfieldvalue.replace(/&amp;/g, "&");

  let xmlcustomerfiles = "";
  const xmlcustomerfilesdata = JSON.parse(req.xmlcustomerfiles);
  xmlcustomerfiles = js2xmlparser.parse(
    "customerFilesXMLdata",
    xmlcustomerfilesdata
  );
  xmlcustomerfiles = xmlcustomerfiles.replace(/&amp;/g, "&");

  dbConn.query(
    "call proc_customer_upsert(?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)",
    [
      xmlcustomertax,
      xmlcustomerfiles,
      xmlcustomfieldvalue,
      req.id,
      req.companyname,
      req.firstname,
      req.lastname,
      req.email,
      req.phonenumber,
      req.image,
      req.address1,
      req.address2,
      req.city,
      req.stateprovince,
      req.zip,
      req.country,
      req.comments,
      req.internalnotes,
      req.storeAccountbalance,
      req.creditlimit,
      req.terms,
      req.accountnumber,
      req.overridedefaulttaxforsale,
      req.taxgroup,
      req.taxable,
      req.nontaxcertificatenumber,
      req.messagetoshowwhenaddingcustomertosales,
      req.autoemailreceipt,
      req.rep,
      req.alternatephone,
      req.textid,
      req.electroniccigaretteid,
      req.instagram,
      req.tobaccolicense,
      req.route,
      req.openingbalance,
      req.loginuserid,
      req.roletierid,
      quickbookid
    ],
    function (err, res) {
      if (err) {
        console.log("error: ", err);
        result(err, null);
      } else {
        console.log("res", res);
        var insertIDArray = res[0];
        var keyValue = insertIDArray[0].ID;
        result(null, keyValue);
      }
    }
  );
};

Customers.findall = function (req, result) {
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
    "call proc_customer_selectall(?,?,?,?,?,?,?,?)",
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

Customers.findbyid = function (req, result) {
  dbConn.query(
    "call proc_customers_selectbyid(?)",
    [req.id],
    function (err, res) {
      console.log("result", res);
      if (err) {
        // result(err, null);
        result(null, 0);
        throw new Error(err);
      } else {
        let data = {
          CustomerDetails: res[0],
          TaxDetails: res[1],
          FileDetails: res[2],
          CustomFieldValues: res[3],
        };

        result(null, data);
      }
    }
  );
};

Customers.excelexportlisting = function (req, result) {
  dbConn.query(
    "call proc_customer_excelexport_listing(?,?,?)",
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

Customers.delete = function (req, result) {
  dbConn.query(
    "call proc_customer_delete_multiple(?)",
    [req.id],
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

Customers.managedelete = function (req, result) {
  dbConn.query(
    "call proc_customer_managedelete(?,?,?,?,?)",
    [
      req.pagenumber,
      req.pagesize,
      req.filtertext,
      req.ordercolumn,
      req.currentorder,
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

Customers.selectedcustomer = function (req, result) {
  dbConn.query(
    "call proc_customer_get_selected_Customer(?)",
    [req.id],
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

Customers.exportexcel = function (req, result) {
  dbConn.query(
    "call proc_customer_getall(?,?,?)",
    [req.filtertext, req.ordercolumn, req.currentorder],
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

Customers.intakeformupsert = function (req, result) {
  dbConn.query(
    "call proc_customer_intake_form_upsert(?,?,?,?,?,?,?,?,?,?,?,?,?,?)",
    [
      req.id,
      req.companyname,
      req.firstname,
      req.lastname,
      req.email,
      req.phonenumber,
      req.address1,
      req.address2,
      req.city,
      req.state,
      req.zip,
      req.country,
      req.loginuserid,
      req.OpeningBalance
    ],
    function (err, res) {
      if (err) {
        console.log("error: ", err);
        result(err, null);
      } else {
        result(null, res[0]);
      }
    }
  );
};

Customers.undeletecustomer = function (req, result) {
  dbConn.query(
    "call proc_customer_undelete_multiple(?)",
    [req.undeletecustomersids],
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

Customers.cleanupcustomer = function (req, result) {
  dbConn.query("call proc_customer_delete_permenetly()", function (err, res) {
    if (err) {
      result(null, 0);
      throw new Error(err);
    } else {
      var insertIDArray = res[0];
      var keyValue = insertIDArray[0].ID;
      result(null, keyValue);
    }
  });
};
Customers.upserttype = function (req, result) {
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
Customers.selectalltype = function (req, result) {
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
Customers.upsertcustomfield = function (req, result) {
  let xmlcustomfield = "";
  const xmlcustomfieldXmldata = JSON.parse(req.xmlcustomfield);
  xmlcustomfield = js2xmlparser.parse(
    "customfieldXmldata",
    xmlcustomfieldXmldata
  );
  xmlcustomfield = xmlcustomfield.replace(/&amp;/g, "&");

  dbConn.query(
    "call proc_custom_field_upsert(?,?)",
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

Customers.findAll = function (req, result) {
  dbConn.query(
    "CALL proc_customers_ExportExistingCustomer()",
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

Customers.tableFieldsName = function (req, result) {
  dbConn.query("CALL proc_customer_fieldName()", function (err, res) {
    if (err) {
      result(null, 0);
      throw new Error(err);
    } else {
      result(null, res[0]);
    }
  });
};

Customers.importdata = function (req, result) {
  let xmlImportData = "";
  const importXmlData = JSON.parse(req.xmlImportData);
  xmlImportData = js2xmlparser.parse("ImportXmlData", importXmlData);
  xmlImportData = xmlImportData.replace(/&amp;/g, "&");
  console.log(xmlImportData)
  dbConn.query(
    "call proc_customers_importexceldata(?,?)",
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

Customers.customercustomgetall = function (req, result) {
  dbConn.query(
    "call proc_customers_customfield_getall(?)",
    [req.id],
    function (err, res) {
      if (err) {
        // result(err, null);
        result(null, 0);
        throw new Error(err);
      } else {
        let obj = {
          count: res[1][0].CustomerIdCount,
          customefield: res[0],
        };
        result(null, obj);
      }
    }
  );
};

// Barcode select all
Customers.barcodeselectalltype = function (req, result) {
  dbConn.query(
    "call proc_customer_barcodelabel_selectall()",
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

//Barcode Upsert
Customers.barcodeupsert = function (req, result) {
  dbConn.query(
    "call proc_customer_barcodelabel_upsert(?,?,?,?,?,?)",
    [
      req.Barcode_Id,
      req.BarcodeImageWidth,
      req.BarcodeImageHeight,
      req.BarcodeImageFontSize,
      req.ZerofillBarcode,
      req.SaveAs_Name,
    ],
    function (err, res) {
      if (err) {
        console.log("error: ", err);
        result(err, null);
      } else {
        // var insertIDArray = res[0];
        // var keyValue = insertIDArray[0].ID;
        result(null, res[0]);
      }
    }
  );
};

Customers.customerdropdown = function (req, result) {
  dbConn.query("call proc_customer_dropdown()", function (err, res) {
    if (err) {
      // result(err, null);
      result(null, 0);
      throw new Error(err);
    } else {
      result(null, res[0]);
    }
  });
};

// Barcode finbyid
Customers.barcodefindbyid = function (req, result) {
  dbConn.query(
    "call proc_customer_barcodelabel_selectbyid(?)",
    [req.Barcode_Id],
    function (err, res) {
      if (err) {
        // result(err, null);
        result(null, 0);
        throw new Error(err);
      } else {
        let data = {
          CustomerBarcodeDetails: res[0],
        };

        result(null, data);
      }
    }
  );
};

Customers.customerinformation = function (req, result) {
  dbConn.query(
    "call proc_customer_information(?)",
    [req.customerid],
    function (err, res) {
      if (err) {
        // result(err, null);
        result(null, 0);
        throw new Error(err);
      } else {
        let obj = {
          CustomerDetails: res[0],
          FilesDetails: res[1],
          TaxDetails: res[2],
          CustomFieldValues: res[3],
          SalesDetails: res[4],
          PaymentReceived: res[5],
          StoreAccount: res[6],
          Memo: res[7],
          Estimate: res[8]
        };
        result(null, obj);
      }
    }
  );
};


Customers.updatecomments = function (req, result) {
 
  dbConn.query(
    "call proc_customer_updatecomments(?,?,?,?)",
    [
      req.id,
      req.content,
      req.contenttype,
      req.loginuserid
    ],
    function (err, res) {
      if (err) {
        console.log("error: ", err);
        result(err, null);
      } else {
        console.log("res", res);
        var insertIDArray = res[0];
        var keyValue = insertIDArray[0].ID;
        result(null, keyValue);
      }
    }
  );
};


Customers.customerstatement = function (req, result) {
  dbConn.query(
    "call proc_customers_statement(?,?,?)",
    [req.startdate, req.enddate, req.customerid],
    function (err, res) {
      if (err) {
        // result(err, null);
        result(null, 0);
        throw new Error(err);
      } else {
        let obj = {
          StatementList: res[0],
          CustomerDetails: res[1]
        };
        result(null, obj);
      }
    }
  );
};

Customers.cusomerstoreaccountlist = function (req, result) {

  dbConn.query(
    "call proc_customers_storeaccount_list(?,?,?,?,?,?,?,?,?)",
    [
      req.pagenumber,
      req.pagesize,
      req.filtertext,
      req.ordercolumn,
      req.currentorder,
      req.LocationID,
      req.customerid,
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

//Listing
Customers.customertransactionlist = function (req, result) {
  console.log(req)
  dbConn.query(
    "call proc_Customer_Trasaction(?,?,?,?,?,?,?,?,?)",
    [
      req.filtertext,
      req.salestypeid,
      req.status,
      req.customerid,
      req.startdate,
      req.enddate,
      req.LocationID,
      req.pagenumber,
      req.pagesize,
    ],
    function (err, res) {
      console.log("res", res);
      if (err) {
        // console.log("error: ", err);
        result(null, 0);
        throw new Error(err);
      } else {
        result(null, res[0]);
      }
    }
  );
};





Customers.ecommpendingcustomer = function (req, result) {

  dbConn.query(
    "call proc_ecommcustomers_pending_list(?,?,?,?,?)",
    [
      req.pagenumber,
      req.pagesize,
      req.filtertext,
      req.ordercolumn,
      req.currentorder,
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





Customers.ecommuserupsert = function (req, result) {

  dbConn.query(
    "call proc_ecommusers_upsert(?,?,?,?)",
    [
      req.userid,
      req.loginid,
      req.roletierid,
      req.companyname
   ],
    function (err, res) {
      if (err) {
        // console.log("error: ", err);
        result(null, 0);
        throw new Error(err);
      } else {
        console.log(res[0]);
        result(null, res[0]);
      }
    }
  );
};

module.exports = Customers;
