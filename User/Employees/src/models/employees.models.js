"use strict";
var dbConn = require("../../../config/db.config");
var js2xmlparser = require("js2xmlparser");
var Confidential = require("../../../config/confidential");
var Employees = function (employees) {};

Employees.upsert = function (req, result) {
  let password = req.password;
  password = Confidential.generateHash(password);
  let xmlemployeefiles = "";
  const xmlemployeefilesdata = JSON.parse(req.xmlemployeefiles);
  xmlemployeefiles = js2xmlparser.parse(
    "employeeFilesXMLdata",
    xmlemployeefilesdata
  );
  xmlemployeefiles = xmlemployeefiles.replace(/&amp;/g, "&");

  // This for the custom fields upsert
  let xmlcustomfieldvalue = "";
  const xmlcustomfieldvaluedata = JSON.parse(req.xmlcustomfieldvalue);
  xmlcustomfieldvalue = js2xmlparser.parse(
    "customFieldXMLdata",
    xmlcustomfieldvaluedata
  );
  xmlcustomfieldvalue = xmlcustomfieldvalue.replace(/&amp;/g, "&");

  dbConn.query(
    "call proc_employees_upsert(?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)",
    [
      xmlemployeefiles,
      xmlcustomfieldvalue,
      req.id,
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
      req.loginstarttime,
      req.loginendtime,
      req.overridepriceadjustments,
      req.maxdiscountpercent,
      req.commissiondefaultrate,
      req.commissionpercenttype,
      req.hiredate,
      req.birthday,
      req.employeenumber,
      req.language,
      req.locationid,
      // req.locationname,
      req.username,
      password,
      req.forcepasswordchange,
      req.alwaysrequirepassword,
      req.darkmode,
      req.inactive,
      req.reasoninactive,
      req.terminationdate,
      req.allowedipaddress,
      req.loginuserid,
    ],
    function (err, res) {
      if (err) {
        console.log("error: ", err);
        result(err, null);
      } else {
        var insertIDArray = res[0];
        console.log("insertIDArray: ", insertIDArray);
        var keyValue = insertIDArray[0].ID;
        console.log("keyValue: ", keyValue);
        result(null, keyValue);
      }
    }
  );
};

Employees.customfieldupsert = function (req, result) {
  let xmlcustomfield = "";
  const xmlcustomfielddata = JSON.parse(req.xmlcustomfield);
  xmlcustomfield = js2xmlparser.parse("xmlcustomfielddata", xmlcustomfielddata);
  xmlcustomfield = xmlcustomfield.replace(/&amp;/g, "&");
  dbConn.query(
    "call proc_employee_custom_field_upsert(?,?)",
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

Employees.findall = function (req, result) {

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
    "call proc_employee_selectall(?,?,?,?,?,?)",
    [
      req.pagenumber,
      req.pagesize,
      req.filtertext,
      req.ordercolumn,
      req.currentorder,
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

Employees.findbyid = function (req, result) {
  dbConn.query(
    "call proc_employees_selectbydid(?)",
    [req.id],
    function (err, res) {
      if (err) {
        // result(err, null);
        result(null, 0);
        throw new Error(err);
      } else {
        let data = {
          EmployeeDetails: res[0],
          FileDetails: res[1],
          CustomFieldValues: res[2],
        };

        result(null, data);
      }
    }
  );
};

Employees.batchdelete = function (req, result) {
  dbConn.query(
    "call proc_employee_delete_multiple(?)",
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

Employees.undeletemutiple = function (req, result) {
  dbConn.query(
    "call proc_employee_undelete_multiple(?)",
    [req.employeeids],
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

Employees.deletepermanantely = function (req, result) {
  dbConn.query("call proc_employee_delete_permenetly", [], function (err, res) {
    if (err) {
      // result(err, null);
      result(null, 0);
      throw new Error(err);
    } else {
      result(null, res[0]);
    }
  });
};

Employees.managedelete = function (req, result) {
  dbConn.query(
    "call proc_employee_managedelete(?,?,?,?,?)",
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

Employees.excelexport = function (req, result) {
  dbConn.query(
    "call proc_employee_excelexport(?,?,?)",
    [req.filtertext, req.ordercolumn, req.currentorder],
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

Employees.employeelanguagesdropdown = function (req, result) {
  dbConn.query(
    "call proc_employees_selectall_langagues_ddl()",
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

Employees.employeeregisterdropdown = function (req, result) {
  dbConn.query(
    "call proc_employees_selectall_register_ddl()",
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

Employees.employeecommissiondropdown = function (req, result) {
  dbConn.query(
    "call proc_employees_selectall_commisssionpercenttype_ddl()",
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

Employees.rolesdropdown = function (req, result) {
  dbConn.query("call proc_Roles_Selectall", function (err, res) {
    if (err) {
      console.log("error: ", err);
      result(err, null);
    } else {
      result(null, res[0]);
    }
  });
};

Employees.usersdropdown = function (req, result) {
  dbConn.query("call proc_Users_Selectall", function (err, res) {
    if (err) {
      console.log("error: ", err);
      result(err, null);
    } else {
      result(null, res[0]);
    }
  });
};

Employees.employeescustomgetall = function (req, result) {
  dbConn.query(
    "call proc_employee_customfield_getall(?)",
    [req.id],
    function (err, res) {
      if (err) {
        result(null, 0);
        throw new Error(err);
      } else {
        let obj = {
          count: res[1][0].EmployeeIdCount,
          customefield: res[0],
        };
        result(null, obj);
      }
    }
  );
};

Employees.permissionupsert = function (req, result) {
   
  dbConn.query(
    "call proc_employees_permissiontemplate_upsert(?,?,?,?)",
    [req.permissionids, req.userid, req.locationid, req.loginuserid],
    function (err, res) {
      if (err) {
        console.log("error: ", err);
        result(err, null);
      } else {
        console.log("response", res);
        var insertIDArray = res[0];
        var keyValue = insertIDArray[0].ID;
        result(null, keyValue);
      }
    }
  );
};

Employees.permissionselectall = function (req, result) {
  dbConn.query(
    "call proc_employees_permissions_selectall",
    function (err, res) {
      if (err) {
        console.log("error: ", err);
        result(err, null);
      } else {
        let obj = {
          ModulesName: res[0],
          AllData: res[1],
        };
        result(null, obj);
      }
    }
  );
};
Employees.selectedemployee = function (req, result) {
  dbConn.query(
    "call proc_employees_permissiontemplate_upsert(?,?)",
    [permissionXml, req.loginuserid],
    function (err, res) {
      if (err) {
        console.log("error: ", err);
        result(err, null);
      } else {
        console.log("response", res);
        var insertIDArray = res[0];
        var keyValue = insertIDArray[0].ID;
        result(null, keyValue);
      }
    }
  );
};

Employees.selectedemployee = function (req, result) {
  dbConn.query(
    "call proc_empolyee_get_selected(?)",
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

Employees.delete = function (req, result) {
  dbConn.query(
    "call proc_employee_delete_multiple(?)",
    [req.employeeids],
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
Employees.userfindbyid = function (req, result) {
   
  dbConn.query(
    "call proc_employee_permission_selectbyid(?)",
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

Employees.update = function (req, result) {
  dbConn.query(
    "call proc_editProfile_Update(?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)",
    [
      req.id,
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
      req.username,
      req.language,
      req.loginuserid,
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

Employees.updatepassword = function (req, result) {
  let newpassword = req.newpassword;
  newpassword = Confidential.generateHash(newpassword);
  let oldpassword = req.oldpassword;
  oldpassword = Confidential.generateHash(oldpassword);
  dbConn.query(
    "call proc_EditProfile_VerifyOldPassword(?,?,?)",
    [req.id, oldpassword, newpassword],
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



Employees.changepassword = function (req, result) {
  let newpassword = req.newpassword;
  newpassword = Confidential.generateHash(newpassword);
 
  dbConn.query(
    "call proc_Employee_ChangePassword(?,?,?)",
    [req.id, req.employeeid, newpassword],
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

module.exports = Employees;
