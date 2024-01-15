const express = require("express");
const cors = require("cors");

// * FOR GLOBAL EXCEPTION HANDLING * //
var dbConn = require('./config/db.config');
process.on('uncaughtException', (err) => {

    console.error('An uncaught exception occurred:');
    // console.error(err);

    dbConn.query('call proc_ExceptionLog_Insert(?,?,?,?,?)', [err.message, 'user', 'user', err.stack, 'E'], function (err, res) {
        if (err) {
            console.log("error");
            console.log(err);
        }
        else {
            console.log("success");
        }
    });

});
// * END * //

const app = express();

app.use(cors());

// parse requests of content-type - application/json
app.use(express.json());

// parse requests of content-type - application/x-www-form-urlencoded
app.use(express.urlencoded({ extended: true }));

app.get('/', (req, res) => {
    // Changes for the api heathcheck
    dbConn.query("SELECT 1", function (err, ressponse) {
        if (err) {
            res.send({ status: "Failed", error: err });
        } else {
            res.send({ status: "OK" });
        }
    }
    );
});

const AuthenticationRoutes = require("./Authentication/src/routes/users.route");
app.use("/api/v1/users", AuthenticationRoutes);

const CustomersRoutes = require('./Customers/src/routes/customers.routes');
app.use('/api/v1/customers', CustomersRoutes);

const SupliersRoutes = require('./Suppliers/src/routes/suppliers.route.js');
app.use('/api/v1/suppliers', SupliersRoutes);

const EmployeesRoutes = require('./Employees/src/routes/employees.route.js');
app.use('/api/v1/employees', EmployeesRoutes);

// set port, listen for requests
const PORT = process.env.PORT || 3002;

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}.`);
});