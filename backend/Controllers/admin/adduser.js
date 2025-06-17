// controllers/adminController.js
const bcrypt = require('bcrypt');
const client = require('../../DataBase/database'); // PostgreSQL client

exports.addUser = async (req, res) => {
  const { token, accesstoken, userData } = req.body;

  // Token check
  if (!token || !accesstoken) {
    const response = { success: false, message: 'Authorization tokens are required', responsecode: 0 };
    res.setHeader('responseheader', encryptresponse(response));
    return res.send(response);
  }

  try {
    getuserProfilefromtoken(accesstoken, token, async (err, foundUser) => {
      if (err || foundUser.length !== 2 || foundUser[1][0].user_role !== 'Admin') {
        const response = { success: false, message: 'Access denied', responsecode: -1 };
        res.setHeader('responseheader', encryptresponse(response));
        return res.send(response);
      }

      const {
        user_first_name,
        user_middle_name,
        user_last_name,
        user_login_email,
        user_password,
        user_mobile,
        user_role
      } = userData;

      if (!user_first_name || !user_last_name || !user_login_email || !user_password || !user_mobile || !user_role) {
        const response = { success: false, message: 'Missing required fields', responsecode: -1 };
        res.setHeader('responseheader', encryptresponse(response));
        return res.send(response);
      }

      // Hash password
      const hashedPassword = await bcrypt.hash(user_password, 10);

      const result = await client.query(
        `INSERT INTO users (
          user_role, user_first_name, user_middle_name, user_last_name,
          user_login_email, user_password, user_mobile, otp_expiry
        ) VALUES ($1, $2, $3, $4, $5, $6, $7, NOW() + INTERVAL '10 minutes')
        RETURNING user_id`,
        [
          user_role,
          user_first_name,
          user_middle_name || '',
          user_last_name,
          user_login_email,
          hashedPassword,
          user_mobile
        ]
      );

      const response = {
        success: true,
        message: 'User added successfully',
        user_id: result.rows[0].user_id,
        responsecode: 200
      };
      res.setHeader('responseheader', encryptresponse(response));
      return res.send(response);
    });
  } catch (error) {
    console.error('Error adding user:', error);
    const response = { success: false, message: error.message, responsecode: -500 };
    res.setHeader('responseheader', encryptresponse(response));
    return res.send(response);
  }
};

exports.getallusers = async (req, res) => {
  const { token, accesstoken } = req.body;

  if (!token || !accesstoken) {
    const response = {
      success: false,
      message: "Authorization tokens are required",
      responsecode: 0,
    };
    res.setHeader('responseheader', encryptresponse(response));
    return res.send(response);
  }

  try {
    getuserProfilefromtoken(accesstoken, token, async (err, foundUser) => {
      if (err || foundUser.length !== 2 || foundUser[1][0].user_role !== 'Admin') {
        const response = {
          success: false,
          message: "Access denied",
          responsecode: -1,
        };
        res.setHeader('responseheader', encryptresponse(response));
        return res.send(response);
      }

      // ✅ Query to fetch user details and enrolled courses
      const result = await client.query(`
        SELECT 
          u.user_id,
          u.user_first_name,
          u.user_middle_name,
          u.user_last_name,
          u.user_login_email,
          u.user_status,
          COALESCE(json_agg(DISTINCT c.course_title) FILTER (WHERE c.course_title IS NOT NULL), '[]') AS enrolled_courses
        FROM users u
        LEFT JOIN enrolls e ON u.user_id = e.user_id
        LEFT JOIN courses c ON e.course_id = c.course_id
        GROUP BY u.user_id
        ORDER BY u.user_id;
      `);

      const response = {
        success: true,
        message: "User management data fetched successfully",
        responsecode: 200,
        users: result.rows,
      };
      res.setHeader('responseheader', encryptresponse(response));
      return res.send(response);
    });
  } catch (error) {
    console.error('Error in usermanagement:', error);
    const response = {
      success: false,
      message: error.message || "Internal Server Error",
      responsecode: -500,
    };
    res.setHeader('responseheader', encryptresponse(response));
    return res.send(response);
  }
};

exports.getUserById = async (req, res) => {
  const { token, accesstoken, user_id } = req.body;

  if (!token || !accesstoken || !user_id) {
    const response = { success: false, message: "All fields are required", responsecode: 0 };
    res.setHeader('responseheader', encryptresponse(response));
    return res.send(response);
  }

  try {
    getuserProfilefromtoken(accesstoken, token, async (err, foundUser) => {
      if (err || foundUser[1][0].user_role !== 'Admin') {
        const response = { success: false, message: "Access denied", responsecode: -1 };
        res.setHeader('responseheader', encryptresponse(response));
        return res.send(response);
      }

      const result = await client.query(`
        SELECT 
          u.user_id,
          u.user_first_name,
          u.user_middle_name,
          u.user_last_name,
          u.user_login_email,
          u.user_status,
          COALESCE(json_agg(DISTINCT c.course_title) FILTER (WHERE c.course_title IS NOT NULL), '[]') AS enrolled_courses
        FROM users u
        LEFT JOIN enrolls e ON u.user_id = e.user_id
        LEFT JOIN courses c ON e.course_id = c.course_id
        WHERE u.user_id = $1
        GROUP BY u.user_id;
      `, [user_id]);

      if (result.rows.length === 0) {
        const response = { success: false, message: "User not found", responsecode: -1 };
        res.setHeader('responseheader', encryptresponse(response));
        return res.send(response);
      }

      const response = { success: true, user: result.rows[0], responsecode: 200 };
      res.setHeader('responseheader', encryptresponse(response));
      return res.send(response);
    });
  } catch (error) {
    const response = { success: false, message: error.message, responsecode: -500 };
    res.setHeader('responseheader', encryptresponse(response));
    return res.send(response);
  }
};

exports.updateUser = async (req, res) => {
  const { token, accesstoken, user_id, user_first_name, user_middle_name, user_last_name, user_status } = req.body;

  if (!token || !accesstoken || !user_id) {
    const response = { success: false, message: "Missing required fields", responsecode: 0 };
    res.setHeader('responseheader', encryptresponse(response));
    return res.send(response);
  }

  try {
    getuserProfilefromtoken(accesstoken, token, async (err, foundUser) => {
      if (err || foundUser[1][0].user_role !== 'Admin') {
        const response = { success: false, message: "Access denied", responsecode: -1 };
        res.setHeader('responseheader', encryptresponse(response));
        return res.send(response);
      }

      await client.query(`
        UPDATE users SET 
          user_first_name = $1,
          user_middle_name = $2,
          user_last_name = $3,
          user_status = $4
        WHERE user_id = $5
      `, [user_first_name, user_middle_name, user_last_name, user_status, user_id]);

      const response = { success: true, message: "User updated successfully", responsecode: 200 };
      res.setHeader('responseheader', encryptresponse(response));
      return res.send(response);
    });
  } catch (error) {
    const response = { success: false, message: error.message, responsecode: -500 };
    res.setHeader('responseheader', encryptresponse(response));
    return res.send(response);
  }
};

exports.deleteUser = async (req, res) => {
  const { token, accesstoken, user_id } = req.body;

  if (!token || !accesstoken || !user_id) {
    const response = { success: false, message: "Missing required fields", responsecode: 0 };
    res.setHeader('responseheader', encryptresponse(response));
    return res.send(response);
  }

  try {
    getuserProfilefromtoken(accesstoken, token, async (err, foundUser) => {
      if (err || foundUser[1][0].user_role !== 'Admin') {
        const response = { success: false, message: "Access denied", responsecode: -1 };
        res.setHeader('responseheader', encryptresponse(response));
        return res.send(response);
      }

      await client.query(`DELETE FROM users WHERE user_id = $1`, [user_id]);

      const response = { success: true, message: "User deleted successfully", responsecode: 200 };
      res.setHeader('responseheader', encryptresponse(response));
      return res.send(response);
    });
  } catch (error) {
    const response = { success: false, message: error.message, responsecode: -500 };
    res.setHeader('responseheader', encryptresponse(response));
    return res.send(response);
  }
};


exports.getUsersByCourseId = async (req, res) => {
  const { token, accesstoken, course_id } = req.body;

  if (!token || !accesstoken || !course_id) {
    const response = { success: false, message: "Missing required fields", responsecode: 0 };
    res.setHeader('responseheader', encryptresponse(response));
    return res.send(response);
  }

  try {
    getuserProfilefromtoken(accesstoken, token, async (err, foundUser) => {
      if (err || foundUser[1][0].user_role !== 'Admin') {
        const response = { success: false, message: "Access denied", responsecode: -1 };
        res.setHeader('responseheader', encryptresponse(response));
        return res.send(response);
      }

      const result = await client.query(`
        SELECT 
          u.user_id,
          u.user_first_name,
          u.user_middle_name,
          u.user_last_name,
          u.user_login_email,
          u.user_status,
          e.course_id,
          c.course_title,
          e.created_at
        FROM enrolls e
        JOIN users u ON e.user_id = u.user_id
        JOIN courses c ON e.course_id = c.course_id
        WHERE e.course_id = $1
      `, [course_id]);

      const response = { success: true, message: "Enrolled users fetched", responsecode: 200, users: result.rows };
      res.setHeader('responseheader', encryptresponse(response));
      return res.send(response);
    });
  } catch (error) {
    const response = { success: false, message: error.message, responsecode: -500 };
    res.setHeader('responseheader', encryptresponse(response));
    return res.send(response);
  }
};

exports.getEnrollmentByUserAndCourse = async (req, res) => {
  const { token, accesstoken, user_id, course_id } = req.body;

  if (!token || !accesstoken || !user_id || !course_id) {
    const response = { success: false, message: "Missing required fields", responsecode: 0 };
    res.setHeader('responseheader', encryptresponse(response));
    return res.send(response);
  }

  try {
    getuserProfilefromtoken(accesstoken, token, async (err, foundUser) => {
      if (err || foundUser[1][0].user_role !== 'Admin') {
        const response = { success: false, message: "Access denied", responsecode: -1 };
        res.setHeader('responseheader', encryptresponse(response));
        return res.send(response);
      }

      const result = await client.query(`
        SELECT 
          e.*,
          u.user_first_name,
          u.user_last_name,
          c.course_title
        FROM enrolls e
        JOIN users u ON e.user_id = u.user_id
        JOIN courses c ON e.course_id = c.course_id
        WHERE e.user_id = $1 AND e.course_id = $2
      `, [user_id, course_id]);

      if (result.rows.length === 0) {
        const response = { success: false, message: "Enrollment not found", responsecode: -1 };
        res.setHeader('responseheader', encryptresponse(response));
        return res.send(response);
      }

      const response = { success: true, message: "Enrollment details", responsecode: 200, enrollment: result.rows[0] };
      res.setHeader('responseheader', encryptresponse(response));
      return res.send(response);
    });
  } catch (error) {
    const response = { success: false, message: error.message, responsecode: -500 };
    res.setHeader('responseheader', encryptresponse(response));
    return res.send(response);
  }
};

exports.updateEnrollment = async (req, res) => {
  const { token, accesstoken, user_id, course_id, progress } = req.body;

  if (!token || !accesstoken || !user_id || !course_id || progress === undefined) {
    const response = { success: false, message: "Missing required fields", responsecode: 0 };
    res.setHeader('responseheader', encryptresponse(response));
    return res.send(response);
  }

  try {
    getuserProfilefromtoken(accesstoken, token, async (err, foundUser) => {
      if (err || foundUser[1][0].user_role !== 'Admin') {
        const response = { success: false, message: "Access denied", responsecode: -1 };
        res.setHeader('responseheader', encryptresponse(response));
        return res.send(response);
      }

      await client.query(`
        UPDATE enrolls
        SET progress = $1
        WHERE user_id = $2 AND course_id = $3
      `, [progress, user_id, course_id]);

      const response = { success: true, message: "Enrollment updated", responsecode: 200 };
      res.setHeader('responseheader', encryptresponse(response));
      return res.send(response);
    });
  } catch (error) {
    const response = { success: false, message: error.message, responsecode: -500 };
    res.setHeader('responseheader', encryptresponse(response));
    return res.send(response);
  }
};

exports.deleteEnrollment = async (req, res) => {
  const { token, accesstoken, user_id, course_id } = req.body;

  if (!token || !accesstoken || !user_id || !course_id) {
    const response = { success: false, message: "Missing required fields", responsecode: 0 };
    res.setHeader('responseheader', encryptresponse(response));
    return res.send(response);
  }

  try {
    getuserProfilefromtoken(accesstoken, token, async (err, foundUser) => {
      if (err || foundUser[1][0].user_role !== 'Admin') {
        const response = { success: false, message: "Access denied", responsecode: -1 };
        res.setHeader('responseheader', encryptresponse(response));
        return res.send(response);
      }

      await client.query(`
        DELETE FROM enrolls
        WHERE user_id = $1 AND course_id = $2
      `, [user_id, course_id]);

      const response = { success: true, message: "Enrollment deleted", responsecode: 200 };
      res.setHeader('responseheader', encryptresponse(response));
      return res.send(response);
    });
  } catch (error) {
    const response = { success: false, message: error.message, responsecode: -500 };
    res.setHeader('responseheader', encryptresponse(response));
    return res.send(response);
  }
};

exports.searchusers = async (req, res) => {
  const { token, accesstoken, search } = req.body;

  if (!token || !accesstoken || !search) {
    const response = { success: false, message: "Missing required fields", responsecode: 0 };
    res.setHeader('responseheader', encryptresponse(response));
    return res.send(response);
  }

  try {
    getuserProfilefromtoken(accesstoken, token, async (err, foundUser) => {
      if (err || !foundUser || !foundUser[1] || foundUser[1][0].user_role !== 'Admin') {
        const response = { success: false, message: "Access denied", responsecode: -1 };
        res.setHeader('responseheader', encryptresponse(response));
        return res.send(response);
      }

      const query = `
        SELECT * FROM users
        WHERE user_login_email ILIKE $1
          OR user_first_name ILIKE $1
          OR user_middle_name ILIKE $1
          OR user_last_name ILIKE $1;
      `;

      const values = [`%${search}%`];

      const result = await client.query(query, values);

      const response = {
        success: true,
        message: "Search results",
        responsecode: 200,
        users: result.rows,
      };
      res.setHeader('responseheader', encryptresponse(response));
      return res.send(response);
    });
  } catch (error) {
    const response = { success: false, message: error.message, responsecode: -500 };
    res.setHeader('responseheader', encryptresponse(response));
    return res.send(response);
  }
};
