// const express = require("express");
// const app = express();
// const bodyParser = require("body-parser");
// // const morgan = require("morgan");
// const cors = require("cors");
// const cron = require('node-cron');
// const dotenv = require("dotenv");
// const multer = require("multer");
// const path = require('path');
// dotenv.config({ path: "config.env" });
// // require("./Server/Middleware/functions")();
// const client = require('./DataBase/database');
// //const cookieSession = require('cookie-session');
// //const aws = require('aws-sdk');
// //require('aws-sdk/lib/maintenance_mode_message').suppress = true;
// //const qrcode = require('qrcode');
// const fs = require('fs');

// // Define the getdeviceinfo function
// const getdeviceinfo = (req) => {
//     const userAgent = req.headers['user-agent'] || 'Unknown User-Agent';
//     const ipAddress = req.connection.remoteAddress || 'Unknown IP';


//     return {
//         userAgent,
//         ipAddress,
//     };
// };


// // Import inittable 
// const sequelize = require("./DataBase/inittable");




// // import routes
// const user = require("./Routes/user");

// (async () => {
//     try {
//       await sequelize.sync({ alter: true });
//       console.log('Database synced successfully.');
//     } catch (error) {
//       console.error('Error syncing database:', error);
//     }
//   })();



//   const removeExpiredSessions = async () => {
//     try {
//         const query = `DELETE FROM sp_sessions WHERE session_expires_at < NOW()`;
//         const result = await client.query(query);
//         console.log(`Deleted ${result.rowCount} expired sessions.`);
//     } catch (error) {
//         console.error("Error removing expired sessions:", error);
//     }
// };

// // Schedule the task to remove expired sessions every hour
// cron.schedule('0 * * * *', async () => {
//     console.log('Running scheduled session cleanup...');
//     await removeExpiredSessions();
// });

// // remove the expired subscriptions for every 5mins
// cron.schedule('*/5 * * * *', async () => {
//     console.log("Running subscription cleanup job...");

//     try {
//         const deleteQuery = `DELETE FROM sp_subscriptions WHERE subscription_expires_at < NOW();`;
//         const deleteResult = await client.query(deleteQuery);

//         console.log(`Expired subscriptions removed: ${deleteResult.rowCount}`);
//     } catch (error) {
//         console.error("Error in subscription cleanup job:", error);
//     }
// });

// // Server
// const PORT = process.env.SERVER_PORT;

// const server = app.listen(PORT, '0.0.0.0', (err, res) => {
//     if (err) {
//         sendtelegrampush("5540170932", err.message, callbackresponse);
//         console.error(err);
//         return;
//     } else {
//         console.log(`Listening on port localhost:${PORT}`);
//     }
// });

// //this is used for the yaml where the routes are created by user 

// // const swaggerUI = require('swagger-ui-express');
// // const YAML = require('yamljs');
// // const redoc = require("redoc-express");

// // // Load Swagger YAML file
// // const swaggerDocument = YAML.load(path.join(__dirname, "config.yaml"));

// // // Serve Swagger UI
// // app.use("/api-docs", swaggerUI.serve, swaggerUI.setup(swaggerDocument));
// // console.log(`Swagger UI available at http://localhost:${PORT}/api-docs`);
// // console.log(`Swagger UI available at http://147.93.97.20:3001/api-docs`);

// // // Serve OpenAPI YAML file statically
// // app.use("/config.yaml", express.static(path.join(__dirname, "config.yaml")));

// // // Serve ReDoc documentation
// // app.get("/redoc", redoc({
// //     title: "Spiffy API Documentation",
// //     specUrl: "/config.yaml", // Ensure the file is correctly served
// //     theme: { typography: { fontSize: "16px" } }
// // }));
// // console.log(`ReDoc documentation available at http://localhost:${PORT}/redoc`);


// // Middleware
// // ------ social plugins ----------
// app.set('view engine', 'ejs');

// //cors implement
// app.use(
//     cors({
//         origin: "*",
//         allowedHeaders: "*",
//     })
// );

// app.use(function (req, res, next) {
//     res.header("Access-Control-Expose-Headers", 'responseheader');
//     var err = null;
//     try {
//         decodeURIComponent(req.path);
//     } catch (e) {
//         err = e;
//     }
//     if (err) {
//         console.error(err.message);
//         console.error(req.url);
//         let _res = ({ success: false, message: err.message, responsecode: 0 });
//         res.setHeader("responseheader", encryptresponse(_res));
//         res.send(_res);
//     } else {
//         res.header("Access-Control-Allow-Origin", "*");
//         res.header(
//             "Access-Control-Allow-Methods",
//             "websocket,GET, POST, OPTIONS, PUT, PATCH, DELETE"
//         );
//         res.header(
//             "Access-Control-Allow-Headers",
//             "Origin, X-Requested-With, Content-Type, Accept"
//         );
//         res.header("Access-Control-Allow-Credentials", false);
//         next();
//     }
// });

// // Schedule the sync task to run every 24 hours
// cron.schedule('0 0 * * *', async () => {
//     console.log('Running scheduled operator categories sync...');
//     await syncOperatorCategories();
// });

// // Request process-time 
// const measureRequestDuration = (req, res, next) => {
//     const start = Date.now();
//     res.once('finish', () => {
//         const duration = Date.now() - start;
//         console.log("Device " + JSON.stringify(getdeviceinfo(req))); // Log device info
//         console.log("Time taken to process " + req.originalUrl + " is: " + duration + " ms ");
//     });
//     next();
// };

// app.use(measureRequestDuration);

// // middleware's
// app.use(bodyParser.urlencoded({ extended: true }));
// app.use(bodyParser.json());
// //app.use(morgan("combined"));


// // user API Calls
// app.use("/user", user);



// app.get('*', function (req, res) {
//     res.send(JSON.stringify({ status: 0, message: "Invalid link", message: 'Something went wrong', link: req.url, method: req.method }));
// });

// app.post('*', function (req, res) {
//     res.send(JSON.stringify({ status: 0, message: "Invalid link", link: req.url, method: req.method }));
// });

// // Error handling for unhandled promise rejections
// const message = async (req, res, next) => {
//     process.on("unhandledRejection", (err, promise) => {
//         console.log(`Logged error:${err}`);
//         // sendtelegrampush("5540170932", `Logged error:${err}`, callbackresponse);
//         server.close(() => process.exit(1));
//     });
// };
// message();


const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const cors = require("cors");
const cron = require('node-cron');
const dotenv = require("dotenv");
const path = require('path');
const fs = require('fs');
const client = require('./DataBase/database');
const sequelize = require("./DataBase/ininttable");

// Load environment variables
dotenv.config({ path: "config.env" });

const usermodel = require("./models/userModel");
const emailmodel = require("./models/emialModel");
const sessionmodel = require("./models/sessionModel");
const courseModel = require("./models/courseModel");
const enrollModel = require("./models/enroll");
const courseprogress = require("./models/courseprogress");
const quizModel = require("./models/qizeModel");
const scoreModel = require("./models/scoreModel");
const coursequiz = require("./models/coursequiz");
// Import multer middleware
const upload = require('./middlewares/upload');

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Serve static folders for uploaded files
app.use('/uploads', express.static(path.join(__dirname, 'Uploads')));

// Utility function to get device info
const getdeviceinfo = (req) => {
    const userAgent = req.headers['user-agent'] || 'Unknown User-Agent';
    const ipAddress = req.connection.remoteAddress || 'Unknown IP';

    return {
        userAgent,
        ipAddress,
    };
};

// Sync database
(async () => {
    try {
        await sequelize.sync({ alter: true });
        console.log('Database synced successfully.');
    } catch (error) {
        console.error('Error syncing database:', error);
    }
})();

// Cron job to remove expired sessions
const removeExpiredSessions = async () => {
    try {
        const query = `DELETE FROM sessions WHERE session_expires_at < NOW()`;
        const result = await client.query(query);
        console.log(`Deleted ${result.rowCount} expired sessions.`);
    } catch (error) {
        console.error("Error removing expired sessions:", error);
    }
};

// Schedule the task to run every hour
cron.schedule('0 * * * *', async () => {
    await removeExpiredSessions();
});

// ROUTES
const userRoutes = require("./Router/user");
const count = require("./Router/count");
const adduser= require("./Router/adduser");
const addcourse = require("./Router/addcourse");
const enroll = require("./Router/enroll");

app.use('/uploads', express.static(path.join(__dirname, 'Uploads')));

// User routes
app.use("/user", userRoutes);
app.use("/enroll", enroll);

// Admin routes
app.use("/count", count);
app.use("/adduser", adduser);
app.use("/courses", addcourse);

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});

module.exports = app;
