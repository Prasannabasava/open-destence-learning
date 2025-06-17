const bcrypt = require('bcrypt');
const client = require('../../DataBase/database'); // PostgreSQL client
const { sendEmail } = require('../../utils/nodemailer'); // Assuming this works
const jwt = require('jsonwebtoken');
require("../../middlewares/dbfunctions")();
const multer = require('multer');
const path = require('path');
const fs = require('fs'); // Add this line to import the fs module
const upload = require('../../middlewares/upload'); // Adjust the path to your multer configuration file
const sanitizePath = require('sanitize-filename'); // Import sanitize-filename

const isEmptyOrNull = (value) => {
    return value === undefined || value === null || value === '';
  };
  
exports.SignUp = async (req, res) => {

    const {
        user_first_name,
        user_middle_name,
        user_last_name,
        user_login_email,
        user_mobile,
        user_password, // Changed from user_login_password to match model
    } = req.body;

    const user_full_name = `${user_first_name} ${user_middle_name || ''} ${user_last_name}`.trim();

    if (
        isEmptyOrNull(user_first_name) ||
        isEmptyOrNull(user_last_name) ||
        isEmptyOrNull(user_mobile) ||
        isEmptyOrNull(user_login_email) ||
        isEmptyOrNull(user_password)
    ) {
        return res.status(400).json({ success: false, message: "Some details are missing", responsecode: 0 });
    }

    // Validate password requirements
    const passwordRegex = /^(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    if (!passwordRegex.test(user_password)) {
        return res.status(400).json({
            success: false,
            message: "Password must be at least 8 characters long and contain at least one uppercase letter, one number, and one special character (@$!%*?&).",
            responsecode: 400
        });
    }

    try {
        // Check if the email already exists in the database
        const query = `SELECT * FROM users WHERE user_login_email = $1`;
        const values = [user_login_email];
        const result = await client.query(query, values);

        if (result.rowCount > 0) {
            const existingUser = result.rows[0];

            // Check if user is already registered and verified
            if (existingUser.user_status === true) {
                const message = "Email already registered and verified";
                return res.status(409).json({ success: false, message, responsecode: 201 });
            }
        }

        // Encrypt password using bcrypt
        const hashedPassword = bcrypt.hashSync(user_password, 10);

        // Insert user into database
        const insertQuery = `
            INSERT INTO users (
                user_first_name, user_middle_name, user_last_name, user_login_email,
                user_password, user_mobile, user_status
            ) VALUES ($1, $2, $3, $4, $5, $6, $7)
            RETURNING user_id`;

        const insertValues = [
            user_first_name,
            user_middle_name || null, // Handle null for optional middle name
            user_last_name,
            user_login_email,
            hashedPassword,
            user_mobile,
            false   // Default user_status to false
        ];
        const insertResult = await client.query(insertQuery, insertValues);

        if (insertResult.rowCount === 1) {
            const user_id = insertResult.rows[0].user_id;

            const Otp = Math.floor(100000 + Math.random() * 900000).toString();
            const otpExpiry = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes from now

            // Update the user with OTP and expiry time
            await client.query(
                `
                UPDATE users 
                SET otp = $1, otp_expiry = $2 
                WHERE user_id = $3
                `,
                [Otp, otpExpiry, user_id]
            );

            // Send an email with the registration OTP
            sendEmail({
                to: user_login_email,
                subject: `Otp: ${Otp}`,
                text: getVerifyEmailTemplate(user_full_name, Otp),
                priority: 'High'
            });
            console.log("otp",Otp)

            let _res = { success: true, message: "OTP Sent", otp: Otp, responsecode: 200 };
            res.setHeader("responseheader", encryptresponse(_res));
            res.send(_res);
        }
    } catch (error) {
        console.error("Error during registration:", error.message);
        return res.status(500).json({
            success: false,
            message: "An error occurred during registration.",
            responsecode: -1
        });
    }
};

exports.verifyOTP = async (req, res) => {
    console.log("Received Verify OTP request");

    const { user_login_email, otp } = req.body;

    // Validate input fields
    if (isEmptyOrNull(user_login_email) || isEmptyOrNull(otp)) {
        return res.status(400).json({
            success: false,
            message: "Email and OTP are required",
            responsecode: 400
        });
    }

    try {
        // Check if user exists and get OTP details
        const userQuery = `
            SELECT * FROM users 
            WHERE user_login_email = $1
        `;
        const userResult = await client.query(userQuery, [user_login_email]);

        if (userResult.rows.length === 0) {
            return res.status(404).json({
                success: false,
                message: "User not found",
                responsecode: 404
            });
        }

        const user = userResult.rows[0];

        // Check if OTP exists and matches
        if (!user.otp || user.otp !== otp) {
            return res.status(400).json({
                success: false,
                message: "Invalid OTP",
                responsecode: 400
            });
        }

        // Check if OTP is not expired
        if (user.otp_expiry && new Date() > new Date(user.otp_expiry)) {
            return res.status(400).json({
                success: false,
                message: "OTP has expired",
                responsecode: 400
            });
        }

        // Update user as verified and clear OTP
        const updateQuery = `
            UPDATE users 
            SET user_status = true
            WHERE user_login_email = $1
            RETURNING *;
        `;
        const updatedUser = await client.query(updateQuery, [user_login_email]);

        return res.status(200).json({
            success: true,
            message: "OTP verified successfully. User is now verified.",
            user: updatedUser.rows[0],
            responsecode: 200
        });
    } catch (err) {
        console.error("Verify OTP error:", err);
        return res.status(500).json({
            success: false,
            message: "Internal server error",
            responsecode: 500
        });
    }
};
const generateOtp = () => {
    return Math.floor(100000 + Math.random() * 900000).toString(); // Generates a 6-digit OTP
};
exports.resendOtp = async (req, res) => {
    const { resendotptype, useremail } = req.body;
  
    // Check for missing fields
    if (resendotptype === 'validateregister' && isEmptyOrNull(useremail)) {
      const _res = { success: false, message: 'User email is missing', responsecode: 0 };
      res.setHeader('responseheader', encryptresponse(_res));
      return res.json(_res);
    }
  
    if (resendotptype === 'validateregister') {
      try {
        // Query user details
        const userQuery = `
          SELECT user_status, user_first_name, user_middle_name, user_last_name
          FROM users
          WHERE user_login_email = $1
        `;
        const userResult = await client.query(userQuery, [useremail]);
  
        if (!userResult.rows || userResult.rows.length === 0) {
          const _res = { success: false, message: 'User not found', responsecode: 404 };
          res.setHeader('responseheader', encryptresponse(_res));
          return res.json(_res);
        }
  
        const user = userResult.rows[0];
  
        if (user.user_status) {
          const _res = {
            success: false,
            message: 'User already verified. Please login.',
            responsecode: 200,
          };
          res.setHeader('responseheader', encryptresponse(_res));
          return res.json(_res);
        }
  
        // Generate new OTP and expiry
        const otp = generateOtp(); // Example: 6-digit random number
        const expiryTime = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes from now
  
        // Update OTP and expiry time
        const updateOtpQuery = `
          UPDATE users
          SET otp = $1,
              otp_expiry = $2
          WHERE user_login_email = $3
        `;
        await client.query(updateOtpQuery, [otp.toString(), expiryTime, useremail]);
  
        // Send OTP email
        const user_full_name = [user.user_first_name, user.user_middle_name, user.user_last_name]
          .filter(Boolean)
          .join(' ');
  
        await sendEmail({
          to: useremail,
          subject: `OTP for Registration: ${otp}`,
          text: getVerifyEmailTemplate(user_full_name, otp),
          priority: 'High',
        });
  
        const _res = { success: true, message: 'OTP resent successfully', responsecode: 200 };
        res.setHeader('responseheader', encryptresponse(_res));
        return res.json(_res);
  
      } catch (error) {
        console.error('Error in resendOtp:', error);
        const _res = { success: false, message: "Something went wrong", responsecode: -1 };
        res.setHeader('responseheader', encryptresponse(_res));
        return res.json(_res);
      }
    } else {
      // Invalid resend OTP type
      const _res = { success: false, message: 'Invalid resend OTP type', responsecode: -1 };
      res.setHeader('responseheader', encryptresponse(_res));
      return res.json(_res);
    }
};


exports.Login = async (req, res) => {
    const { email, password } = req.body;

    // Validate input fields
    if (isEmptyOrNull(email) || isEmptyOrNull(password)) {
        return res.status(400).json({ success: false, message: "All fields are required", responsecode: 0 });
    }

    try {
        const query = `SELECT * FROM users WHERE user_login_email = $1`;
        const values = [email];

        const foundUser = await client.query(query, values);

        if (foundUser.rowCount === 1) {
            const user = foundUser.rows[0];

            // Check if the user status is 'Active'
            if (!user.user_status) {
                return res.status(401).json({ success: false, message: "User is not activated", responsecode: 500 });
            }

            // Validate password
            const isPasswordValid = bcrypt.compareSync(password, user.user_password);
            if (!isPasswordValid) {
                return res.status(401).json({ success: false, message: "Invalid email or password", responsecode: 500 });
            }

            // Generate JWT token
            
            const token = jwt.sign({ email: user.user_login_email }, process.env.SECRET_KEY, { expiresIn: '24h' });

            // Create session
            const sessionQuery = `
                INSERT INTO sessions (user_id, session_token, session_expires_at, created_at) 
                VALUES ($1, $2, NOW() + INTERVAL '24 HOURS', NOW()) 
                RETURNING session_id, session_expires_at
            `;
            const sessionValues = [user.user_id, token];

            const sessionResult = await client.query(sessionQuery, sessionValues);

            const encryptedSessionID = customencrypt(sessionResult.rows[0].session_id);
            const sessionExpiresAt = sessionResult.rows[0].session_expires_at;
            const user_full_name = `${user.user_first_name} ${user.user_last_name}`;
            const userrole = user.user_role;

            // Send login success email
            sendEmail({
                to: email,
                subject: "Login Successful",
                text: getLoginSuccessEmailTemplate(user_full_name),
                priority: 'High'
            });

            return res.status(200).json({
                success: true,
                message: "User logged in successfully",
                token: token,
                accesstoken: encryptedSessionID,
                session_expires_at: sessionExpiresAt,
                userfullname: user_full_name,
                userrole : userrole,
                responsecode: 200
            });
        } else if (foundUser.rowCount > 1) {
            return res.status(500).json({ success: false, message: "More than one user found with the same email", responsecode: 500 });
        } else {
            return res.status(404).json({ success: false, message: "No email registered with this email address", responsecode: 500 });
        }
    } catch (err) {
        console.error("Unexpected Error:", err);
        return res.status(500).json({ success: false, message: "Internal server error", responsecode: -1 });
    }
};

exports.ForgotPassword = async (req, res) => {
    const { email } = req.body;

    if (isEmptyOrNull(email)) {
        return res.status(400).json({ success: false, message: "Email is required", responsecode: 400 });
    }

    try {
        const query = `SELECT * FROM users WHERE user_login_email = $1`;
        const values = [email];

        client.query(query, values, async (err, foundUser) => {
            if (err) {
                console.error("Error retrieving user:", err);
                return res.status(500).json({ success: false, message: err.message, responsecode: -1 });
            }

            if (foundUser.rowCount === 0) {
                return res.status(404).json({ success: false, message: "No email registered with this ID", responsecode: 404 });
            } else if (foundUser.rowCount === 1) {
                const user_full_name = `${foundUser.rows[0].user_first_name} ${foundUser.rows[0].user_last_name}`;
                const user_login_email = foundUser.rows[0].user_login_email;
                const uid = customencrypt(foundUser.rows[0].user_id.toString());
                const Eemail = customencrypt(foundUser.rows[0].user_login_email);

                const resetLink = `http://192.168.1.9:8080/user/resetpassword/${uid}/${Eemail}`;

                await sendEmail({
                    to: user_login_email,
                    subject: 'Password Reset',
                    text: getForgotPasswordEmailTemplate(user_full_name, resetLink),
                    priority: 'High'
                });

                return res.status(200).json({ success: true, message: "Password reset link sent to your email", uid, Eemail, responsecode: 200 });
            } else {
                return res.status(500).json({ success: false, message: "Duplicate users found with the same email", responsecode: 500 });
            }
        });
    } catch (err) {
        console.error("Unexpected error:", err);
        return res.status(500).json({ success: false, message: err.message, responsecode: -1 });
    }
};

exports.ResetPassword = async (req, res) => {
    const { email, new_password } = req.body;
  
    // Validate inputs
    if (isEmptyOrNull(email) || isEmptyOrNull(new_password)) {
      return res.status(400).json({ success: false, message: "Email and new password are required", responsecode: 400 });
    }
  
    // Validate password format
    const passwordRegex = /^(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    if (!passwordRegex.test(new_password)) {
      return res.status(400).json({
        success: false,
        message: "Password must be at least 8 characters long, contain at least one uppercase letter, one number, and one special character.",
        responsecode: 400
      });
    }
  
    try {
      const query = `SELECT * FROM users WHERE user_login_email = $1`;
      const values = [email];
  
      client.query(query, values, async (err, foundUser) => {
        if (err) {
          console.error("Error retrieving user:", err);
          return res.status(500).json({ success: false, message: err.message, responsecode: -1 });
        }
  
        if (foundUser.rowCount === 0) {
          return res.status(404).json({ success: false, message: "No user found with this email", responsecode: 404 });
        } else if (foundUser.rowCount === 1) {
          const oldPasswordHash = foundUser.rows[0].user_password;
  
          // Check if new password is same as old password
          const isSamePassword = await bcrypt.compare(new_password, oldPasswordHash);
          if (isSamePassword) {
            return res.status(400).json({ success: false, message: "New password must be different from the old password", responsecode: 400 });
          }
  
          // Hash new password
          const hashedPassword = bcrypt.hashSync(new_password, 10);
  
          const updateQuery = `
            UPDATE users
            SET user_password = $1
            WHERE user_login_email = $2
          `;
          const updateValues = [hashedPassword, email];
  
          client.query(updateQuery, updateValues, async (err, updateResult) => {
            if (err) {
              console.error("Error updating password:", err);
              return res.status(500).json({ success: false, message: err.message, responsecode: -1 });
            }
  
            if (updateResult.rowCount === 1) {
              return res.status(200).json({ success: true, message: "Password updated successfully", responsecode: 200 });
            } else {
              return res.status(500).json({ success: false, message: "Password update failed", responsecode: -1 });
            }
          });
        } else {
          return res.status(500).json({ success: false, message: "Duplicate users found with the same email", responsecode: 500 });
        }
      });
    } catch (err) {
      console.error("Unexpected error:", err);
      return res.status(500).json({ success: false, message: err.message, responsecode: -1 });
    }
  };
  

exports.ContactForm = async (req, res) => {
    try {
        const { name, email, phone, message } = req.body;

        // Validation: Ensure all required fields are present
        if (!message || !name || !email || !phone) {
            return res.status(400).json({ success: false, message: "All fields are required", responsecode: 400 });
        }

        // Generate email content
        const emailContent = getContactFormEmailTemplate(name, email, phone, message);

        // Sending Email using your `sendEmail` function
        await sendEmail({
            to: "prasannabasava78@gmail.com",
            subject: "New Contact Form Submission",
            text: emailContent,
            priority: "High",
        });

        return res.status(200).json({ success: true, message: "Email sent successfully", responsecode: 200 });

    } catch (error) {
        return res.status(500).json({ success: false, message: "Failed to send email", details: error.message, responsecode: 500 });
    }
};

exports.UpdateProfile = async (req, res) => {
    const { profileData } = req.body;
    const { token,accesstoken } = req.headers;

    if (!token || !profileData || !accesstoken) {
        return res.status(400).json({ success: false, message: "Authorization token and profile data are required", responsecode: 400 });
    }

    try {
        getuserProfilefromtoken(accesstoken,token, async (err, foundUser) => {
            if (err) {
                return res.status(401).json({ success: false, message: "User verification failed", responsecode: 401 });
            }

            if (!foundUser || foundUser.length !== 2) {
                return res.status(404).json({ success: false, message: "User not found", responsecode: 404 });
            }

            const userID = foundUser[1][0].user_id;

            try {
                const updateQuery = `
                    UPDATE users
                    SET 
                        user_first_name = $1,
                        user_middle_name = $2,
                        user_last_name = $3,
                        user_login_email = $4
                    WHERE user_id = $5
                    RETURNING *;
                `;

                const values = [
                    profileData.user_first_name,
                    profileData.user_middle_name || null, // Middle name can be NULL
                    profileData.user_last_name,
                    profileData.user_login_email,
                    userID
                ];

                const result = await client.query(updateQuery, values);

                if (result.rowCount === 0) {
                    return res.status(404).json({ success: false, message: "User not found or no changes made", responsecode: 404 });
                }

                return res.status(200).json({ success: true, message: "Profile updated successfully", data: result.rows[0], responsecode: 200 });

            } catch (queryError) {
                console.error("Database Error:", queryError);
                return res.status(500).json({ success: false, message: "Database error while updating profile", responsecode: 500 });
            }
        });
    } catch (error) {
        console.error("Server Error:", error);
        return res.status(500).json({ success: false, message: "Server error", responsecode: 500 });
    }
};

// Express route handler for profile picture update
exports.ProfilePic = [
    upload.single('profile_pic'),
    async (req, res) => {
      const { token, accesstoken } = req.body;
  
      // Validate tokens
      if (!token || !accesstoken) {
        const response = { success: false, message: 'Authorization tokens are required', responsecode: 0 };
        res.setHeader('responseheader', encryptresponse(response));
        return res.status(401).send(response);
      }
  
      // Validate profile picture file
      if (!req.file) {
        const response = { success: false, message: 'Profile picture file is required', responsecode: -1 };
        res.setHeader('responseheader', encryptresponse(response));
        return res.status(400).send(response);
      }
  
      try {
        // Check if client is available
        if (!client || typeof client.query !== 'function') {
          throw new Error('Database client is not initialized');
        }
  
        // Validate user from token
        const foundUser = await new Promise((resolve, reject) => {
          getuserProfilefromtoken(accesstoken, token, (err, user) => {
            if (err) reject(err);
            else resolve(user);
          });
        });
  
        if (!foundUser || foundUser.length !== 2) {
          const response = { success: false, message: 'Invalid user authentication', responsecode: -1 };
          res.setHeader('responseheader', encryptresponse(response));
          return res.status(403).send(response);
        }
  
        const userId = foundUser[1][0].user_id;
        const timestamp = new Date().toISOString();
  
        await client.query('BEGIN');
  
        // Update user profile (without user_profilepic)
        const updateResult = await client.query(
          `UPDATE users SET 
            image_mime_type = $1,
            image_size = $2,
            image_name = $3
          WHERE user_id = $4
          RETURNING user_id, image_name`,
          [
            req.file.mimetype,        // MIME type (e.g., 'image/jpeg')
            req.file.size,            // file size in bytes
            req.file.filename,        // Store server-generated filename
            userId,                   // user ID from token
          ]
        );
  
        if (updateResult.rowCount === 0) {
          await client.query('ROLLBACK');
          const response = { success: false, message: 'User not found or update failed', responsecode: -1 };
          res.setHeader('responseheader', encryptresponse(response));
          return res.status(404).send(response);
        }
  
        await client.query('COMMIT');
  
        const response = {
          success: true,
          message: 'Profile picture updated successfully',
          responsecode: 200,
          data: {
            user_id: updateResult.rows[0].user_id,
            image_name: updateResult.rows[0].image_name,
          },
        };
        res.setHeader('responseheader', encryptresponse(response));
        return res.status(200).send(response);
      } catch (error) {
        await client.query('ROLLBACK').catch(rollbackErr =>
          console.error('Rollback error:', rollbackErr)
        );
        console.error('Error during updateProfilePic execution:', error.stack);
        const response = {
          success: false,
          message: error.message || 'Server error',
          responsecode: -1,
        };
        res.setHeader('responseheader', encryptresponse(response));
        return res.status(400).send(response);
      }
    },
  ];
  exports.ViewProfile = async (req, res) => {
    try {
      const token = req.headers['token']?.trim();
      const accesstoken = req.headers['accesstoken']?.trim();
  
      // Validate tokens
      if (!token || !accesstoken) {
        const response = {
          success: false,
          message: 'Authorization tokens are required',
          responsecode: 0,
        };
        res.setHeader('responseheader', encryptresponse(response));
        return res.status(401).send(response);
      }
  
      // Check DB client
      if (!client || typeof client.query !== 'function') {
        throw new Error('Database client is not initialized');
      }
  
      // Get user from token
      const foundUser = await new Promise((resolve, reject) => {
        getuserProfilefromtoken(accesstoken, token, (err, user) => {
          if (err) reject(err);
          else resolve(user);
        });
      });
  
      if (!foundUser || foundUser.length !== 2 || !foundUser[1][0]) {
        const response = {
          success: false,
          message: 'Invalid user authentication',
          responsecode: -1,
        };
        res.setHeader('responseheader', encryptresponse(response));
        return res.status(403).send(response);
      }
  
      const userId = foundUser[1][0].user_id;
  
      // Fetch user profile
      const userQuery = `
        SELECT 
          user_first_name,
          user_middle_name,
          user_last_name,
          user_mobile,
          user_login_email,
          image_name,
          image_mime_type,
          image_size
        FROM users
        WHERE user_id = $1;
      `;
      const userResult = await client.query(userQuery, [userId]);
  
      if (userResult.rowCount === 0) {
        const response = {
          success: false,
          message: 'User not found',
          responsecode: -1,
        };
        res.setHeader('responseheader', encryptresponse(response));
        return res.status(404).send(response);
      }
  
      const user = userResult.rows[0];
  
      const response = {
        success: true,
        message: 'Profile retrieved successfully',
        responsecode: 200,
        data: {
          user: {
            user_first_name: user.user_first_name,
            user_middle_name: user.user_middle_name,
            user_last_name: user.user_last_name,
            user_mobile: user.user_mobile,
            user_login_email: user.user_login_email,
            profile_pic: user.image_name ? {
              image_name: user.image_name,
              image_mime_type: user.image_mime_type,
              image_size: user.image_size,
            } : null,
          }
        }
      };
  
      res.setHeader('responseheader', encryptresponse(response));
      return res.status(200).send(response);
  
    } catch (error) {
      console.error('Error fetching profile:', error.stack);
      const response = {
        success: false,
        message: error.message || 'Server error',
        responsecode: -500,
      };
      res.setHeader('responseheader', encryptresponse(response));
      return res.status(500).send(response);
    }
  };
  

  exports.ContactForm = async (req, res) => {
    try {
        const { name, email, subject, message } = req.body;

        // Validation: Ensure all required fields are present
        if (!message || !name || !email || !subject) {
            return res.status(400).json({ success: false, message: "All fields are required", responsecode: 400 });
        }

        // Generate email content
        const emailContent = getContactFormEmailTemplate(name, email, subject, message);

        // Sending Email using your `sendEmail` function
        await sendEmail({
            to: "prasannabasava78@gmail.com",
            subject: "New Contact Form Submission",
            text: emailContent,
            priority: "High",
        });

        return res.status(200).json({ success: true, message: "Email sent successfully", responsecode: 200 });

    } catch (error) {
        return res.status(500).json({ success: false, message: "Failed to send email", details: error.message, responsecode: 500 });
    }
};



  exports.getProfilePic = async (req, res) => {
    const { token, accesstoken } = req.body;
  
    // Validate tokens
    if (!token || !accesstoken) {
      const response = { success: false, message: 'Authorization tokens are required', responsecode: 0 };
      res.setHeader('responseheader', encryptresponse(response));
      return res.status(401).send(response);
    }
  
    try {
      // Validate database client
      if (!client || typeof client.query !== 'function') {
        throw new Error('Database client is not initialized');
      }
  
      // Validate user from token
      const foundUser = await new Promise((resolve, reject) => {
        getuserProfilefromtoken(accesstoken, token, (err, user) => {
          if (err) reject(err);
          else resolve(user);
        });
      });
  
      if (!foundUser || foundUser.length !== 2) {
        const response = { success: false, message: 'Invalid user authentication', responsecode: -1 };
        res.setHeader('responseheader', encryptresponse(response));
        return res.status(403).send(response);
      }
  
      const userId = foundUser[1][0].user_id;
  
      // Fetch image details
      const userResult = await client.query(
        `SELECT image_name, image_mime_type FROM users WHERE user_id = $1`,
        [userId]
      );
  
      if (userResult.rowCount === 0 || !userResult.rows[0].image_name) {
        const response = { success: false, message: 'Profile picture not found', responsecode: -1 };
        res.setHeader('responseheader', encryptresponse(response));
        return res.status(404).send(response);
      }
  
      const { image_name, image_mime_type } = userResult.rows[0];
      const imagePath = path.join(__dirname, '../uploads/profile_pics', image_name);
  
      if (!fs.existsSync(imagePath)) {
        const response = { success: false, message: 'Image file does not exist', responsecode: -1 };
        res.setHeader('responseheader', encryptresponse(response));
        return res.status(404).send(response);
      }
  
      // Serve image file
      res.setHeader('Content-Type', image_mime_type);
      res.sendFile(imagePath);
    } catch (error) {
      console.error('Error in getProfilePic:', error.stack);
      const response = { success: false, message: error.message || 'Server error', responsecode: -1 };
      res.setHeader('responseheader', encryptresponse(response));
      return res.status(500).send(response);
    }
  };
