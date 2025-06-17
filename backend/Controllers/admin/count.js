const client = require('../../DataBase/database'); // PostgreSQL client
require("../../middlewares/dbfunctions")();

// Controller: Get total number of users
exports.getTotalUsers = async (req, res) => {
    const { token, accesstoken } = req.body;

    if (!token || !accesstoken) {
        let response = { success: false, message: "Authorization tokens are required", responsecode: 0 };
        res.setHeader("responseheader", encryptresponse(response));
        return res.send(response);
    }

    try {
        getuserProfilefromtoken(accesstoken, token, async (err, foundUser) => {
            if (err) {
                let response = { success: false, message: "User verification failed", responsecode: 0 };
                res.setHeader("responseheader", encryptresponse(response));
                return res.send(response);
            } else if (foundUser.length === 2) {
                // Check if user_role is 'Admin'
                const userRole = foundUser[1][0].user_role;

                if (userRole !== 'Admin') {
                    let response = { success: false, message: 'Access denied: Only Admins can view total users', responsecode: -1 };
                    res.setHeader("responseheader", encryptresponse(response));
                    return res.send(response);
                }

                // ✅ User is Admin, proceed
                const result = await client.query(`SELECT COUNT(*) FROM users WHERE user_role = 'user'`);
                const totalUsers = parseInt(result.rows[0].count, 10);

                let response = { success: true, totalUsers, message: "Total users fetched successfully", responsecode: 200 };
                res.setHeader("responseheader", encryptresponse(response));
                return res.send(response);

            } else {
                let response = { success: false, message: "User not found", responsecode: -1 };
                res.setHeader("responseheader", encryptresponse(response));
                return res.send(response);
            }
        });
    } catch (error) {
        console.error('Error fetching total users:', error);
        let response = { success: false, message: error.message, responsecode: -500 };
        res.setHeader("responseheader", encryptresponse(response));
        return res.send(response);
    }
};

// Controller: Get number of users registered today
exports.getUsersRegisteredToday = async (req, res) => {
    const { token, accesstoken } = req.body;

    if (!token || !accesstoken) {
        let response = { success: false, message: "Authorization tokens are required", responsecode: 0 };
        res.setHeader("responseheader", encryptresponse(response));
        return res.send(response);
    }

    try {
        getuserProfilefromtoken(accesstoken, token, async (err, foundUser) => {
            if (err) {
                let response = { success: false, message: "User verification failed", responsecode: 0 };
                res.setHeader("responseheader", encryptresponse(response));
                return res.send(response);
            } else if (foundUser.length === 2) {
                const userRole = foundUser[1][0].user_role;

                if (userRole !== 'Admin') {
                    let response = { success: false, message: 'Access denied: Only Admins can view today\'s registered users', responsecode: -1 };
                    res.setHeader("responseheader", encryptresponse(response));
                    return res.send(response);
                }

                // ✅ User is Admin, proceed
                const result = await client.query(`
                   SELECT COUNT(*) FROM users
                    WHERE DATE(otp_expiry) = CURRENT_DATE
                    AND user_role = 'user';

                `);
                const usersToday = parseInt(result.rows[0].count, 10);

                let response = { success: true, usersToday, message: "Today's users fetched successfully", responsecode: 200 };
                res.setHeader("responseheader", encryptresponse(response));
                return res.send(response);

            } else {
                let response = { success: false, message: "User not found", responsecode: -1 };
                res.setHeader("responseheader", encryptresponse(response));
                return res.send(response);
            }
        });
    } catch (error) {
        let response = { success: false, message: error.message, responsecode: -500 };
        res.setHeader("responseheader", encryptresponse(response));
        return res.send(response);
    }
};


exports.getenrolledcount = async (req, res) => {
    const { token, accesstoken } = req.body;
  
    if (!token || !accesstoken) {
      const response = {
        success: false,
        message: "Authorization tokens are required",
        responsecode: 0,
      };
      res.setHeader("responseheader", encryptresponse(response));
      return res.status(400).send(response);
    }
  
    try {
      getuserProfilefromtoken(accesstoken, token, async (err, foundUser) => {
        if (err) {
          const response = {
            success: false,
            message: "User verification failed",
            responsecode: 0,
          };
          res.setHeader("responseheader", encryptresponse(response));
          return res.status(401).send(response);
        }
  
        if (!foundUser || foundUser.length < 2 || !foundUser[1][0]) {
          const response = {
            success: false,
            message: "User not found",
            responsecode: -1,
          };
          res.setHeader("responseheader", encryptresponse(response));
          return res.status(404).send(response);
        }
  
        const userRole = foundUser[1][0].user_role;
  
        if (userRole !== "Admin") {
          const response = {
            success: false,
            message: "Access denied: Only Admins can view enrolled users",
            responsecode: -1,
          };
          res.setHeader("responseheader", encryptresponse(response));
          return res.status(403).send(response);
        }
  
        // ✅ Get enrolled user count with course name
        const result = await client.query(`
          SELECT 
            c.course_id,
            c.course_title,
            COUNT(e.*) AS enrolled_count
          FROM enrolls e
          JOIN courses c ON e.course_id = c.course_id
          GROUP BY c.course_id, c.course_title;
        `);
  
        const enrolledUsers = result.rows; // [{ course_id, course_name, enrolled_count }]
  
        const response = {
          success: true,
          enrolledUsers,
          message: "Enrolled users fetched successfully",
          responsecode: 200,
        };
        res.setHeader("responseheader", encryptresponse(response));
        return res.status(200).send(response);
      });
    } catch (error) {
      const response = {
        success: false,
        message: error.message || "Something went wrong",
        responsecode: -500,
      };
      res.setHeader("responseheader", encryptresponse(response));
      return res.status(500).send(response);
    }
  };
  
  
exports.gettotalcourses = async (req, res) => {
    const { token, accesstoken } = req.body;
  
    if (!token || !accesstoken) {
      const response = {
        success: false,
        message: "Authorization tokens are required",
        responsecode: 0,
      };
      res.setHeader("responseheader", encryptresponse(response));
      return res.status(400).send(response);
    }
  
    try {
      getuserProfilefromtoken(accesstoken, token, async (err, foundUser) => {
        if (err) {
          const response = {
            success: false,
            message: "User verification failed",
            responsecode: 0,
          };    
          res.setHeader("responseheader", encryptresponse(response));
          return res.status(401).send(response);
        }
  
        if (!foundUser || foundUser.length < 2 || !foundUser[1][0]) {
          const response = {
            success: false,
            message: "User not found",
            responsecode: -1,
          };
          res.setHeader("responseheader", encryptresponse(response));
          return res.status(404).send(response);
        }
  
        const userRole = foundUser[1][0].user_role;
  
        if (userRole !== "Admin") {
          const response = {
            success: false,     
            message: "Access denied: Only Admins can view enrolled users",
            responsecode: -1,
          };
          res.setHeader("responseheader", encryptresponse(response));
          return res.status(403).send(response);
        }
  
        // ✅ Get enrolled user count grouped by course
        const result = await client.query(`
          SELECT count(*) FROM courses where course_status = 'active';
        `);
  
        const enrolledUsers = result.rows; // array of { course_id, enrolled_count }
  
        const response = {
          success: true,
          enrolledUsers,
          message: "courses fetched successfully",
          responsecode: 200,
        };
        res.setHeader("responseheader", encryptresponse(response));
        return res.status(200).send(response);
      });
    } catch (error) {
      const response = {
        success: false,
        message: error.message || "Something went wrong",
        responsecode: -500,
      };
      res.setHeader("responseheader", encryptresponse(response));
      return res.status(500).send(response);
    }
}  