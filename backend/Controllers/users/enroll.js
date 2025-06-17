const client=require('../../DataBase/database');
const { sendEmail } = require('../../utils/nodemailer'); // Assuming this works
const jwt = require('jsonwebtoken');
require("../../middlewares/dbfunctions")();

exports.enroll = async(req, res) => {
    const { course_id } = req.body;
    const { token, accesstoken } = req.body;
    // Token check
    if (!token || !accesstoken) {
        const response = { success: false, message: 'Authorization tokens are required', responsecode: 0 };
        res.setHeader('responseheader', encryptresponse(response));
        return res.send(response);
    }

    try {
        getuserProfilefromtoken(accesstoken, token, async (err, foundUser) => {
            if (err || !foundUser || foundUser.length !== 2) {
                const response = { success: false, message: 'Access denied', responsecode: -1 };
                res.setHeader('responseheader', encryptresponse(response));
                return res.send(response);
            }

            try {
                if (!client || typeof client.query !== 'function') {
                    throw new Error('Database client is not initialized properly.');
                }

                // Check if the course exists
                const courseQuery = `
                    SELECT *
                    FROM courses
                    WHERE course_id = $1
                `;
                const courseResult = await client.query(courseQuery, [course_id]);
                if (courseResult.rows.length === 0) {
                    const response = { success: false, message: 'Course not found', responsecode: -1 };
                    res.setHeader('responseheader', encryptresponse(response));
                    return res.send(response);
                }

                // Check if the user has already enrolled in the course
                const enrollmentQuery = `
                    SELECT *
                    FROM enrolls
                    WHERE user_id = $1 AND course_id = $2
                `;
                const enrollmentResult = await client.query(enrollmentQuery, [foundUser[1][0].user_id, course_id]);
                if (enrollmentResult.rows.length > 0) {
                    const response = { success: false, message: 'User has already enrolled in the course', responsecode: -1 };
                    res.setHeader('responseheader', encryptresponse(response));
                    return res.send(response);
                }

                // Enroll the user in the course
                const enrollQuery = `
                    INSERT INTO enrolls (user_id, course_id,"created_at","updated_at")
                    VALUES ($1, $2,NOW(),NOW())
                    RETURNING *
                `;
                const enrollResult = await client.query(enrollQuery, [foundUser[1][0].user_id, course_id]);
                if (enrollResult.rows.length === 0) {
                    const response = { success: false, message: 'Failed to enroll user in the course', responsecode: -1 };
                    res.setHeader('responseheader', encryptresponse(response));
                    return res.send(response);
                }

                const response = { success: true, message: 'User enrolled in the course successfully', responsecode: 200 };
                res.setHeader('responseheader', encryptresponse(response));
                return res.send(response);
            } catch (err) {
                console.error('Enrollment error:', err);
                const response = { success: false, message: 'Failed to enroll user in the course', responsecode: -1 };
                res.setHeader('responseheader', encryptresponse(response));
                return res.send(response);
            }
        });
    } catch (err) {
        console.error('Enrollment error:', err);
        const response = { success: false, message: 'Failed to enroll user in the course', responsecode: -1 };
        res.setHeader('responseheader', encryptresponse(response));
        return res.send(response);
    }
}

exports.getEnrolledCourses = async (req, res) => {
  const { token, accesstoken } = req.body;

  // Token check
  if (!token || !accesstoken) {
    const response = {
      success: false,
      message: 'Authorization tokens are required',
      responsecode: 0
    };
    res.setHeader('responseheader', encryptresponse(response));
    return res.send(response);
  }

  try {
    getuserProfilefromtoken(accesstoken, token, async (err, foundUser) => {
      if (err || !foundUser || foundUser.length !== 2) {
        const response = {
          success: false,
          message: 'Access denied',
          responsecode: -1
        };
        res.setHeader('responseheader', encryptresponse(response));
        return res.send(response);
      }

      const user_id = foundUser[1][0].user_id;

      try {
        if (!client || typeof client.query !== 'function') {
          throw new Error('Database client is not initialized properly.');
        }

        const enrolledCoursesQuery = `
          SELECT c.*
          FROM enrolls e
          JOIN courses c ON e.course_id = c.course_id
          WHERE e.user_id = $1
        `;

        const result = await client.query(enrolledCoursesQuery, [user_id]);

        const response = {
          success: true,
          message: 'Enrolled courses fetched successfully',
          responsecode: 200,
          data: result.rows
        };

        res.setHeader('responseheader', encryptresponse(response));
        return res.send(response);
      } catch (err) {
        console.error('Error fetching enrolled courses:', err);
        const response = {
          success: false,
          message: 'Failed to fetch enrolled courses',
          responsecode: -1
        };
        res.setHeader('responseheader', encryptresponse(response));
        return res.send(response);
      }
    });
  } catch (err) {
    console.error('Error:', err);
    const response = {
      success: false,
      message: 'Something went wrong',
      responsecode: -1
    };
    res.setHeader('responseheader', encryptresponse(response));
    return res.send(response);
  }
};

exports.getsavedprogress = async (req, res) => {
  const { token, accesstoken } = req.body;

  // Validate input
  if (!token || !accesstoken) {
    const response = {
      success: false,
      message: "Missing required fields: token and accesstoken are required.",
      responsecode: 0,
    };
    res.setHeader("responseheader", encryptresponse(response));
    return res.send(response);
  }

  try {
    // Validate user from tokens
    getuserProfilefromtoken(accesstoken, token, async (err, foundUser) => {
      if (err || !foundUser || foundUser.length !== 2 || !foundUser[1][0]) {
        const response = {
          success: false,
          message: "Invalid user token or user not found.",
          responsecode: -1,
        };
        res.setHeader("responseheader", encryptresponse(response));
        return res.send(response);
      }

      const user = foundUser[1][0];
      const user_id = user.user_id;

      try {
        if (!client || typeof client.query !== "function") {
          throw new Error("Database client not initialized.");
        }

        // Fetch all saved progress records for the user
        const result = await client.query(
          `SELECT * FROM user_courses_progress WHERE user_id = $1`,
          [user_id]
        );

        const response = {
          success: true,
          message: "Saved progress fetched successfully.",
          responsecode: 200,
          data: result.rows,
        };

        res.setHeader("responseheader", encryptresponse(response));
        return res.send(response);
      } catch (dbError) {
        console.error("DB error:", dbError);
        const response = {
          success: false,
          message: "Database error: " + dbError.message,
          responsecode: -500,
        };
        res.setHeader("responseheader", encryptresponse(response));
        return res.send(response);
      }
    });
  } catch (error) {
    console.error("Execution error:", error);
    const response = {
      success: false,
      message: "Server error: " + error.message,
      responsecode: -500,
    };
    res.setHeader("responseheader", encryptresponse(response));
    return res.send(response);
  }
};

exports.saveUserCourseProgress = async (req, res) => {
  const { token, accesstoken, course_id, module_id, topic_id, video_id, progress } = req.body;

  // Validate input
  if (!token || !accesstoken || !course_id || progress === undefined) {
    const response = {
      success: false,
      message: "Missing required fields: token, accesstoken, course_id, and progress are required.",
      responsecode: 0,
    };
    res.setHeader("responseheader", encryptresponse(response));
    return res.send(response);
  }

  try {
    // Validate user from tokens
    getuserProfilefromtoken(accesstoken, token, async (err, foundUser) => {
      if (err || !foundUser || foundUser.length !== 2 || !foundUser[1][0]) {
        const response = {
          success: false,
          message: "Invalid user token or user not found.",
          responsecode: -1,
        };
        res.setHeader("responseheader", encryptresponse(response));
        return res.send(response);
      }

      const user = foundUser[1][0];
      const user_id = user.user_id;

      try {
        if (!client || typeof client.query !== "function") {
          throw new Error("Database client not initialized.");
        }

        // Check if user is enrolled in the course
        const enrollmentCheck = await client.query(
          `SELECT * FROM enrolls WHERE user_id = $1 AND course_id = $2`,
          [user_id, course_id]
        );

        if (enrollmentCheck.rows.length === 0) {
          const response = {
            success: false,
            message: "User is not enrolled in this course.",
            responsecode: 403,
          };
          res.setHeader("responseheader", encryptresponse(response));
          return res.send(response);
        }

        // Upsert progress record
        const upsertQuery = `
          INSERT INTO user_courses_progress (user_id, course_id, module_id, topic_id, video_id, progress, updated_at)
          VALUES ($1, $2, $3, $4, $5, $6, NOW())
          ON CONFLICT (user_id, course_id, module_id, topic_id, video_id)
          DO UPDATE SET progress = EXCLUDED.progress, updated_at = NOW()
          RETURNING *
        `;

        const values = [
          user_id,
          course_id,
          module_id || null,
          topic_id || null,
          video_id || null,
          progress,
        ];

        const result = await client.query(upsertQuery, values);

        const response = {
          success: true,
          message: "Progress saved successfully.",
          responsecode: 200,
          data: result.rows[0],
        };

        res.setHeader("responseheader", encryptresponse(response));
        return res.send(response);
      } catch (dbError) {
        console.error("DB error:", dbError);
        const response = {
          success: false,
          message: "Database error: " + dbError.message,
          responsecode: -500,
        };
        res.setHeader("responseheader", encryptresponse(response));
        return res.send(response);
      }
    });
  } catch (error) {
    console.error("Execution error:", error);
    const response = {
      success: false,
      message: "Server error: " + error.message,
      responsecode: -500,
    };
    res.setHeader("responseheader", encryptresponse(response));
    return res.send(response);
  }
};

exports.generateQuiz = async (req, res) => {
  const { token, accesstoken, module_name, question, options, correct, course_id } = req.body;

  if (!token || !accesstoken || !module_name || !question || !options || correct === undefined || !course_id) {
    const response = { success: false, message: 'Missing required fields', responsecode: 0 };
    res.setHeader('responseheader', encryptresponse(response));
    return res.send(response);
  }

  try {
    getuserProfilefromtoken(accesstoken, token, async (err, foundUser) => {
      if (err || !foundUser || foundUser.length !== 2) {
        const response = { success: false, message: 'Access denied', responsecode: -1 };
        res.setHeader('responseheader', encryptresponse(response));
        return res.send(response);
      }
const user_id=foundUser[1][0].user_id
      if (!client || typeof client.query !== 'function') {
        const response = { success: false, message: 'Database client is not initialized properly.', responsecode: -1 };
        res.setHeader('responseheader', encryptresponse(response));
        return res.send(response);
      }

      try {
        // Use module_title not module_name
        const moduleResult = await client.query(
          'SELECT module_id FROM modules WHERE module_title = $1 LIMIT 1',
          [module_name]
        );

        if (moduleResult.rows.length === 0) {
          const response = { success: false, message: 'Module not found', responsecode: 0 };
          res.setHeader('responseheader', encryptresponse(response));
          return res.send(response);
        }

        const module_id = moduleResult.rows[0].module_id;

        const insertQuery = `
          INSERT INTO quizzes (course_id, question, options, correct, created_by, created_at, module_id)
          VALUES ($1, $2, $3, $4, $5, NOW(), $6)
          RETURNING quiz_id
        `;

        const insertValues = [
          course_id,
          question,
          options,
          correct,
          user_id,          
          module_id,
        ];

        const insertResult = await client.query(insertQuery, insertValues);

        const response = {
          success: true,
          message: 'Quiz created successfully',
          responsecode: 1,
          quiz_id: insertResult.rows[0].quiz_id,
        };

        res.setHeader('responseheader', encryptresponse(response));
        return res.send(response);

      } catch (dbError) {
        console.error('Database error:', dbError);
        const response = { success: false, message: 'Database error occurred', responsecode: -1 };
        res.setHeader('responseheader', encryptresponse(response));
        return res.send(response);
      }
    });
  } catch (err) {
    console.error('Unexpected error:', err);
    const response = { success: false, message: 'Unexpected server error', responsecode: -1 };
    res.setHeader('responseheader', encryptresponse(response));
    return res.send(response);
  }
};

exports.getquiz = async (req, res) => {
  const { token, accesstoken, module_id } = req.body;

  // Validate inputs
  if (!token || !accesstoken || !module_id) {
    const response = { success: false, message: 'Authorization tokens and module_id are required', responsecode: 0 };
    res.setHeader('responseheader', encryptresponse(response));
    return res.send(response);
  }

  try {
    // Wrap your callback-based function into a Promise to use async/await properly
    const foundUser = await new Promise((resolve, reject) => {
      getuserProfilefromtoken(accesstoken, token, (err, user) => {
        if (err) reject(err);
        else resolve(user);
      });
    });

    // Validate user — adapt condition to your actual user object shape
    if (!foundUser || !Array.isArray(foundUser) || foundUser.length !== 2) {
      const response = { success: false, message: 'Access denied', responsecode: -1 };
      res.setHeader('responseheader', encryptresponse(response));
      return res.send(response);
    }

    if (!client || typeof client.query !== 'function') {
      const response = { success: false, message: 'Database client is not initialized properly.', responsecode: -1 };
      res.setHeader('responseheader', encryptresponse(response));
      return res.send(response);
    }

    // Verify module exists
    const moduleResult = await client.query(
      'SELECT module_id FROM modules WHERE module_id = $1 LIMIT 1',
      [module_id]
    );

    if (moduleResult.rows.length === 0) {
      const response = { success: false, message: 'Module not found', responsecode: 0 };
      res.setHeader('responseheader', encryptresponse(response));
      return res.send(response);
    }

    // Fetch quizzes for the module
    const quizResult = await client.query(
      'SELECT * FROM quizzes WHERE module_id = $1',
      [module_id]
    );

    const response = {
      success: true,
      message: 'Quizzes fetched successfully',
      responsecode: 1,
      quizzes: quizResult.rows,
    };

    res.setHeader('responseheader', encryptresponse(response));
    return res.send(response);

  } catch (error) {
    console.error('Error in getquiz:', error);
    const response = { success: false, message: 'Unexpected server error', responsecode: -1 };
    res.setHeader('responseheader', encryptresponse(response));
    return res.send(response);
  }
};

exports.savescore = async (req, res) => {
  const { token, accesstoken, quiz_id, score } = req.body;

  // Validate inputs
  if (!token || !accesstoken || !quiz_id || score === undefined) {
    const response = {
      success: false,
      message: "Authorization tokens, quiz_id, and score are required",
      responsecode: 400,
    };
    res.setHeader("responseheader", encryptresponse(response));
    return res.send(response);
  }

  try {
    // Validate user asynchronously
    const foundUser = await new Promise((resolve, reject) => {
      getuserProfilefromtoken(accesstoken, token, (err, user) => {
        if (err) reject(err);
        else resolve(user);
      });
    });

    // Validate user structure
    if (!foundUser || !Array.isArray(foundUser) || foundUser.length !== 2 || !foundUser[1][0]) {
      const response = {
        success: false,
        message: "Access denied. Invalid user tokens or user not found.",
        responsecode: 401,
      };
      res.setHeader("responseheader", encryptresponse(response));
      return res.send(response);
    }

    const user_id = foundUser[1][0].user_id;

    if (!client || typeof client.query !== "function") {
      const response = {
        success: false,
        message: "Database client is not initialized properly.",
        responsecode: 500,
      };
      res.setHeader("responseheader", encryptresponse(response));
      return res.send(response);
    }

    // Upsert score
    const upsertScoreQuery = `
      INSERT INTO scores (user_id, quiz_id, score, updated_at)
      VALUES ($1, $2, $3, NOW())
      ON CONFLICT (user_id, quiz_id)
      DO UPDATE SET score = EXCLUDED.score, updated_at = NOW()
      RETURNING *;
    `;
    const upsertParams = [user_id, quiz_id, score];

    const result = await client.query(upsertScoreQuery, upsertParams);

    const response = {
      success: true,
      message: "Score saved successfully",
      responsecode: 200,
      data: result.rows[0],
    };

    res.setHeader("responseheader", encryptresponse(response));
    return res.send(response);

  } catch (error) {
    console.error("Error in savescore:", error);
    const response = {
      success: false,
      message: "Unexpected server error: " + error.message,
      responsecode: 500,
    };
    res.setHeader("responseheader", encryptresponse(response));
    return res.send(response);
  }
};

exports.getscore = async (req,res) =>{
  const { token, accesstoken, quiz_id } = req.body;

  // Validate inputs
  if (!token || !accesstoken || !quiz_id) {
    const response = {
      success: false,
      message: "Authorization tokens and quiz_id are required",
      responsecode: 400,
    };
    res.setHeader("responseheader", encryptresponse(response));
    return res.send(response);
  }

  try {
    // Validate user asynchronously
    const foundUser = await new Promise((resolve, reject) => {
      getuserProfilefromtoken(accesstoken, token, (err, user) => {
        if (err) reject(err);
        else resolve(user);
      });
    });

    // Validate user structure
    if (!foundUser || !Array.isArray(foundUser) || foundUser.length !== 2 || !foundUser[1][0]) {
      const response = {
        success: false,
        message: "Access denied. Invalid user tokens or user not found.",
        responsecode: 401,
      };
      res.setHeader("responseheader", encryptresponse(response));
      return res.send(response);
    }

    const user_id = foundUser[1][0].user_id;

    if (!client || typeof client.query !== "function") {
      const response = {
        success: false,
        message: "Database client is not initialized properly.",
        responsecode: 500,
      };
      res.setHeader("responseheader", encryptresponse(response));
      return res.send(response);
    }

    // Get score
    const getScoreQuery = `
      SELECT * FROM scores
      WHERE user_id = $1 AND quiz_id = $2
    `;
    const getScoreParams = [user_id, quiz_id];

    const result = await client.query(getScoreQuery, getScoreParams);

    const response = {
      success: true,
      message: "Score retrieved successfully",
      responsecode: 200,
      data: result.rows[0],
    };

    res.setHeader("responseheader", encryptresponse(response));
    return res.send(response);

  } catch (error) {
    console.error("Error in getscore:", error);
    const response = {
      success: false,
      message: "Unexpected server error: " + error.message,
      responsecode: 500,
    };
    res.setHeader("responseheader", encryptresponse(response));
    return res.send(response);
  }
}


exports.generateQuizzesAfterCourseComplete = async (req, res) => {
  const { token, accesstoken, question, options, correct, course_id } = req.body;

  // Validate inputs
  if (!token || !accesstoken || !question || !options || correct === undefined || !course_id) {
    const response = { success: false, message: 'Missing required fields', responsecode: 0 };
    res.setHeader('responseheader', encryptresponse(response));
    return res.send(response);
  }

  try {
    getuserProfilefromtoken(accesstoken, token, async (err, foundUser) => {
      if (err || !foundUser || foundUser.length !== 2) {
        const response = { success: false, message: 'Access denied', responsecode: -1 };
        res.setHeader('responseheader', encryptresponse(response));
        return res.send(response);
      }

      const user_id = foundUser[1][0].user_id;

      if (!client || typeof client.query !== 'function') {
        const response = { success: false, message: 'Database client not initialized', responsecode: -1 };
        res.setHeader('responseheader', encryptresponse(response));
        return res.send(response);
      }

      try {
        const insertQuery = `
          INSERT INTO coursequiz (course_id, question, options, correct, created_by, created_at)
          VALUES ($1, $2, $3, $4, $5, NOW())
          RETURNING quiz_id
        `;

        const insertValues = [course_id, question, options, correct, user_id];

        const result = await client.query(insertQuery, insertValues);

        const response = {
          success: true,
          message: 'Quiz created successfully',
          responsecode: 1,
          quiz_id: result.rows[0].quiz_id,
        };

        res.setHeader('responseheader', encryptresponse(response));
        return res.send(response);

      } catch (dbErr) {
        console.error('Database error:', dbErr);
        const response = { success: false, message: 'Database error occurred', responsecode: -1 };
        res.setHeader('responseheader', encryptresponse(response));
        return res.send(response);
      }
    });
  } catch (err) {
    console.error('Unexpected error:', err);
    const response = { success: false, message: 'Unexpected server error', responsecode: -1 };
    res.setHeader('responseheader', encryptresponse(response));
    return res.send(response);
  }
};

exports.getquizforcompletecourse = async (req, res) => {
  const { token, accesstoken, course_id } = req.body;

  // Validate inputs
  if (!token || !accesstoken || !course_id) {
    const response = {
      success: false,
      message: 'Authorization tokens and course_id are required',
      responsecode: 0
    };
    res.setHeader('responseheader', encryptresponse(response));
    return res.send(response);
  }

  try {
    // Authenticate user
    const foundUser = await new Promise((resolve, reject) => {
      getuserProfilefromtoken(accesstoken, token, (err, user) => {
        if (err) reject(err);
        else resolve(user);
      });
    });

    if (!foundUser || !Array.isArray(foundUser) || foundUser.length !== 2) {
      const response = { success: false, message: 'Access denied', responsecode: -1 };
      res.setHeader('responseheader', encryptresponse(response));
      return res.send(response);
    }

    if (!client || typeof client.query !== 'function') {
      const response = {
        success: false,
        message: 'Database client is not initialized properly.',
        responsecode: -1
      };
      res.setHeader('responseheader', encryptresponse(response));
      return res.send(response);
    }

    // Optional: Verify course exists
    const courseCheck = await client.query('SELECT course_id FROM courses WHERE course_id = $1 LIMIT 1', [course_id]);
    if (courseCheck.rows.length === 0) {
      const response = { success: false, message: 'Course not found', responsecode: 0 };
      res.setHeader('responseheader', encryptresponse(response));
      return res.send(response);
    }

    // Fetch quizzes by course_id
    const quizResult = await client.query(
      'SELECT * FROM coursequiz WHERE course_id = $1',
      [course_id]
    );

    const response = {
      success: true,
      message: 'Quizzes fetched successfully',
      responsecode: 1,
      quizzes: quizResult.rows
    };

    res.setHeader('responseheader', encryptresponse(response));
    return res.send(response);

  } catch (error) {
    console.error('Error in getquiz:', error);
    const response = { success: false, message: 'Unexpected server error', responsecode: -1 };
    res.setHeader('responseheader', encryptresponse(response));
    return res.send(response);
  }
};

exports.finalquizscore = async (req, res) => {
  const { token, accesstoken, quiz_id, score, course_id } = req.body;

  if (!token || !accesstoken || !quiz_id || score === undefined || !course_id) {
    const response = {
      success: false,
      message: "Authorization tokens, quiz_id, score, and course_id are required",
      responsecode: 400,
    };
    res.setHeader("responseheader", encryptresponse(response));
    return res.send(response);
  }

  try {
    const foundUser = await new Promise((resolve, reject) => {
      getuserProfilefromtoken(accesstoken, token, (err, user) => {
        if (err) reject(err);
        else resolve(user);
      });
    });

    if (!foundUser || !Array.isArray(foundUser) || foundUser.length !== 2 || !foundUser[1][0]) {
      const response = {
        success: false,
        message: "Access denied. Invalid user tokens or user not found.",
        responsecode: 401,
      };
      res.setHeader("responseheader", encryptresponse(response));
      return res.send(response);
    }

    const user_id = foundUser[1][0].user_id;

    // Save score in user_quiz_scores table
    const upsertQuery = `
      INSERT INTO final_quiz_scores (user_id, course_id, quiz_id, score, updated_at)
      VALUES ($1, $2, $3, $4, NOW())
      ON CONFLICT (user_id, quiz_id)
      DO UPDATE SET score = EXCLUDED.score, updated_at = NOW();
    `;
    await client.query(upsertQuery, [user_id, course_id, quiz_id, score]);

    const response = {
      success: true,
      message: "Quiz score saved successfully.",
      responsecode: 200
    };
    res.setHeader("responseheader", encryptresponse(response));
    return res.send(response);

  } catch (error) {
    console.error("Error in savescore:", error);
    const response = {
      success: false,
      message: "Unexpected server error: " + error.message,
      responsecode: 500,
    };
    res.setHeader("responseheader", encryptresponse(response));
    return res.send(response);
  }
};

