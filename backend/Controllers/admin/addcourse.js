const  client  = require('../../DataBase/database');
require('../../middlewares/dbfunctions')();

exports.addCourse = async (req, res) => {
  console.log("Handling course addition...");
  console.log("Request body:", req.body);
  console.log("Request files:", req.files);

  const {
    token,
    accesstoken,
    course_title,
    course_description,
    course_duration,
    course_mode,
    course_tools,
    course_for,
    course_status,
    course_type, // New field
    modules
  } = req.body;

  // Validate tokens
  if (!token || !accesstoken) {
    const response = { success: false, message: 'Authorization tokens are required', responsecode: 0 };
    res.setHeader('responseheader', encryptresponse(response));
    return res.status(401).send(response);
  }

  // Validate required fields
  if (!course_title || !course_description || !course_duration || !course_mode || !course_for || !course_status || !course_type) {
    const response = { success: false, message: 'Missing required course fields including course_type', responsecode: -1 };
    res.setHeader('responseheader', encryptresponse(response));
    return res.status(400).send(response);
  }

  // Validate course_duration
  const durationNum = Number(course_duration);
  if (isNaN(durationNum) || durationNum <= 0 || !Number.isInteger(durationNum)) {
    const response = { success: false, message: 'Course duration must be a positive integer', responsecode: -1 };
    res.setHeader('responseheader', encryptresponse(response));
    return res.status(400).send(response);
  }

  // Validate course_type (example: must be a string from a defined set)
  const allowedTypes = ['Free', 'Paid', 'Trial'];
  if (!allowedTypes.includes(course_type)) {
    const response = { success: false, message: `course_type must be one of: ${allowedTypes.join(', ')}`, responsecode: -1 };
    res.setHeader('responseheader', encryptresponse(response));
    return res.status(400).send(response);
  }

  // Parse modules (optional)
  let parsedModules = [];
  if (modules) {
    try {
      parsedModules = JSON.parse(modules);
      if (!Array.isArray(parsedModules)) {
        throw new Error('Modules must be an array');
      }
    } catch (e) {
      const response = { success: false, message: `Invalid modules JSON: ${e.message}`, responsecode: -1 };
      res.setHeader('responseheader', encryptresponse(response));
      return res.status(400).send(response);
    }
  }

  try {
    if (!client || typeof client.query !== 'function') {
      throw new Error('Database client is not initialized');
    }

    const foundUser = await new Promise((resolve, reject) => {
      getuserProfilefromtoken(accesstoken, token, (err, user) => {
        if (err) reject(err);
        else resolve(user);
      });
    });

    if (!foundUser || foundUser.length !== 2 || foundUser[1][0].user_role !== 'Admin') {
      const response = { success: false, message: 'Access denied: Only Admins can add courses', responsecode: -1 };
      res.setHeader('responseheader', encryptresponse(response));
      return res.status(403).send(response);
    }

    const userId = foundUser[1][0].user_id;

    const courseImage = req.files && req.files['course_image'] && req.files['course_image'][0]
      ? req.files['course_image'][0].filename
      : null;

    if (courseImage && !req.files['course_image'][0].mimetype.startsWith('image/')) {
      const response = { success: false, message: 'Course image must be an image file', responsecode: -1 };
      res.setHeader('responseheader', encryptresponse(response));
      return res.status(400).send(response);
    }

    let totalVideos = 0;
    for (const module of parsedModules) {
      for (const topic of module.topics || []) {
        totalVideos += (topic.videos || []).length;
      }
    }

    const uploadedVideos = req.files && req.files['videos'] ? req.files['videos'] : [];
    console.log(`Expected ${totalVideos} videos, received ${uploadedVideos.length}`);
    console.log('Uploaded videos details:', uploadedVideos.map(v => ({
      originalname: v.originalname,
      mimetype: v.mimetype,
      filename: v.filename,
      path: v.path,
      size: v.size
    })));
    if (totalVideos > 0 && uploadedVideos.length !== totalVideos) {
      const response = {
        success: false,
        message: `Expected ${totalVideos} video files, but received ${uploadedVideos.length}`,
        responsecode: -1
      };
      res.setHeader('responseheader', encryptresponse(response));
      return res.status(400).send(response);
    }

    const timestamp = new Date().toISOString();

    await client.query('BEGIN');

    // Insert course with course_type
    const courseRes = await client.query(
      `INSERT INTO courses (
        course_title, course_description, course_duration, course_mode,
        course_tools, course_for, course_status, course_type,
        created_by, updated_by, course_image, created_at, updated_at
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13)
      RETURNING course_id`,
      [
        course_title,
        course_description,
        durationNum,
        course_mode,
        course_tools || null,
        course_for,
        course_status,
        course_type, // new column
        userId,
        userId,
        courseImage,
        timestamp,
        timestamp
      ]
    );

    const courseId = courseRes.rows[0].course_id;

    let videoIndex = 0;

    for (const module of parsedModules) {
      if (!module.title || !module.order) {
        const response = { success: false, message: 'Module title and order are required', responsecode: -1 };
        res.setHeader('responseheader', encryptresponse(response));
        await client.query('ROLLBACK');
        return res.status(400).send(response);
      }
      const moduleOrder = Number(module.order);
      if (isNaN(moduleOrder) || moduleOrder <= 0 || !Number.isInteger(moduleOrder)) {
        const response = { success: false, message: 'Module order must be a positive integer', responsecode: -1 };
        res.setHeader('responseheader', encryptresponse(response));
        await client.query('ROLLBACK');
        return res.status(400).send(response);
      }

      const moduleRes = await client.query(
        `INSERT INTO modules (course_id, module_title, module_order, created_at, updated_at)
         VALUES ($1, $2, $3, $4, $5)
         RETURNING module_id`,
        [courseId, module.title, moduleOrder, timestamp, timestamp]
      );

      const moduleId = moduleRes.rows[0].module_id;

      for (const topic of module.topics || []) {
        if (!topic.title || !topic.order) {
          const response = { success: false, message: 'Topic title and order are required', responsecode: -1 };
          res.setHeader('responseheader', encryptresponse(response));
          await client.query('ROLLBACK');
          return res.status(400).send(response);
        }
        const topicOrder = Number(topic.order);
        if (isNaN(topicOrder) || topicOrder <= 0 || !Number.isInteger(topicOrder)) {
          const response = { success: false, message: 'Topic order must be a positive integer', responsecode: -1 };
          res.setHeader('responseheader', encryptresponse(response));
          await client.query('ROLLBACK');
          return res.status(400).send(response);
        }

        const topicRes = await client.query(
          `INSERT INTO topics (module_id, topic_title, topic_order, created_at, updated_at)
           VALUES ($1, $2, $3, $4, $5)
           RETURNING topic_id`,
          [moduleId, topic.title, topicOrder, timestamp, timestamp]
        );

        const topicId = topicRes.rows[0].topic_id;

        for (const video of topic.videos || []) {
          if (!video.title || !video.duration || !video.order) {
            const response = { success: false, message: 'Video title, duration, and order are required', responsecode: -1 };
            res.setHeader('responseheader', encryptresponse(response));
            await client.query('ROLLBACK');
            return res.status(400).send(response);
          }
          const videoDuration = Number(video.duration);
          const videoOrder = Number(video.order);
          if (isNaN(videoDuration) || videoDuration <= 0 || !Number.isInteger(videoDuration)) {
            const response = { success: false, message: 'Video duration must be a positive integer', responsecode: -1 };
            res.setHeader('responseheader', encryptresponse(response));
            await client.query('ROLLBACK');
            return res.status(400).send(response);
          }
          if (isNaN(videoOrder) || videoOrder <= 0 || !Number.isInteger(videoOrder)) {
            const response = { success: false, message: 'Video order must be a positive integer', responsecode: -1 };
            res.setHeader('responseheader', encryptresponse(response));
            await client.query('ROLLBACK');
            return res.status(400).send(response);
          }

          const videoFile = uploadedVideos[videoIndex] ? uploadedVideos[videoIndex].filename : null;
          if (!videoFile) {
            const response = {
              success: false,
              message: `Missing video file for video "${video.title}" at index ${videoIndex}`,
              responsecode: -1
            };
            res.setHeader('responseheader', encryptresponse(response));
            await client.query('ROLLBACK');
            return res.status(400).send(response);
          }
          if (!uploadedVideos[videoIndex].mimetype.startsWith('video/')) {
            const response = {
              success: false,
              message: `Video file for "${video.title}" at index ${videoIndex} must be a video`,
              responsecode: -1
            };
            res.setHeader('responseheader', encryptresponse(response));
            await client.query('ROLLBACK');
            return res.status(400).send(response);
          }
          videoIndex++;

          console.log(`Inserting video: ${video.title}, filename: ${videoFile}`);

          await client.query(
            `INSERT INTO videos (
              topic_id, video_title, video_url, video_duration, video_order, created_at, updated_at
            ) VALUES ($1, $2, $3, $4, $5, $6, $7)`,
            [topicId, video.title, videoFile, videoDuration, videoOrder, timestamp, timestamp]
          );
        }
      }
    }

    await client.query('COMMIT');

    const response = {
      success: true,
      message: 'Course with modules, topics, and videos added successfully',
      responsecode: 200,
      data: { course_id: courseId }
    };
    res.setHeader('responseheader', encryptresponse(response));
    return res.status(200).send(response);
  } catch (error) {
    await client.query('ROLLBACK').catch(rollbackErr => console.error('Rollback error:', rollbackErr));
    console.error('Error during addCourse execution:', error.stack);
    const response = { success: false, message: error.message || 'Server error', responsecode: -1 };
    res.setHeader('responseheader', encryptresponse(response));
    return res.status(400).send(response);
  }
};

exports.getAllCourses = async (req, res) => {
  const { page = 1, limit = 10, token = null, accesstoken = null } = req.body;

  const pageNum = parseInt(page, 10);
  const limitNum = parseInt(limit, 10);
  const offset = (pageNum - 1) * limitNum;

  if (isNaN(pageNum) || isNaN(limitNum) || pageNum < 1 || limitNum < 1) {
    const response = {
      success: false,
      message: "Invalid page or limit value",
      responsecode: 400,
    };
    res.setHeader("responseheader", encryptresponse(response));
    return res.status(400).send(response);
  }

  try {
    if (!client || typeof client.query !== "function") {
      throw new Error("Database client is not initialized");
    }

    const formatCourses = (rows) =>
      rows.map((course) => ({
        ...course,
        course_image: course.course_image
          ? `/uploads/images/${course.course_image}`
          : null,
      }));

    let isAdmin = false;

    if (token && accesstoken) {
      try {
        const foundUser = await new Promise((resolve, reject) => {
          getuserProfilefromtoken(accesstoken, token, (err, user) => {
            if (err) reject(err);
            else resolve(user);
          });
        });

        const user = foundUser?.[1]?.[0];
        if (user?.user_role === "Admin") {
          isAdmin = true;
        }
      } catch (authError) {
        console.warn("Token validation failed:", authError.message);
        // Continue as public user
      }
    }

    // Build queries
    // Query to fetch paginated course rows ordered by course_type and created_at
      const courseQuery = isAdmin
      ? `SELECT * FROM courses ORDER BY course_type, created_at DESC LIMIT $1 OFFSET $2`
      : `SELECT * FROM courses WHERE course_status = 'active' ORDER BY course_type, created_at DESC LIMIT $1 OFFSET $2`;

      // Query to get counts grouped by course_type
      const countQuery = isAdmin
      ? `SELECT course_type, COUNT(*) AS count FROM courses GROUP BY course_type`
      : `SELECT course_type, COUNT(*) AS count FROM courses WHERE course_status = 'active' GROUP BY course_type`;

    const values = [limitNum, offset];

    const result = await client.query(courseQuery, values);
    const totalCountResult = await client.query(countQuery);
    const totalCount = parseInt(totalCountResult.rows[0]?.count || 0, 10);
    const totalPages = Math.ceil(totalCount / limitNum);

    const response = {
      success: true,
      message: "Courses fetched successfully",
      data: formatCourses(result.rows),
      pagination: {
        currentPage: pageNum,
        totalPages,
        totalCount,
        pageSize: limitNum,
      },
      responsecode: 200,
    };

    res.setHeader("responseheader", encryptresponse(response));
    return res.status(200).send(response);
  } catch (error) {
    console.error("Error fetching courses:", error); // Debug print
    const response = {
      success: false,
      message: error.message || "Server error",
      responsecode: 500,
    };
    res.setHeader("responseheader", encryptresponse(response));
    return res.status(500).send(response);
  }
};

exports.getcoursebyid = async (req, res) => {
  const { token, accesstoken, course_id } = req.body;

  // Validate course_id
  if (!course_id) {
    const response = {
      success: false,
      message: "Missing course_id",
      responsecode: 400,
    };
    res.setHeader("responseheader", encryptresponse(response));
    return res.status(400).send(response);
  }

  // Helper function to format course data
  const formatCourse = (courseRow) => ({
    ...courseRow,
    course_image: courseRow.course_image
      ? `/uploads/courseimages/${courseRow.course_image}`
      : null,
  });

  // Public access: No token or accesstoken provided
  if (!token || !accesstoken) {
    try {
      const result = await client.query(
        `SELECT * FROM courses WHERE course_id = $1 AND course_status = 'active'`,
        [course_id]
      );

      if (result.rows.length === 0) {
        const response = {
          success: false,
          message: "Course not found",
          responsecode: 404,
        };
        res.setHeader("responseheader", encryptresponse(response));
        return res.status(404).send(response);
      }

      const course = formatCourse(result.rows[0]);
      const response = {
        success: true,
        message: "Course fetched successfully (public access)",
        responsecode: 200,
        data: course,
      };
      res.setHeader("responseheader", encryptresponse(response));
      return res.status(200).send(response);
    } catch (err) {
      console.error("Public fetch error:", err);
      const response = {
        success: false,
        message: "Failed to fetch course",
        responsecode: 500,
      };
      res.setHeader("responseheader", encryptresponse(response));
      return res.status(500).send(response);
    }
  }

  // Logged-in user access
  getuserProfilefromtoken(accesstoken, token, async (err, foundUser) => {
    if (err || !foundUser || foundUser.length !== 2) {
      console.error("User verification failed:", err);
      const response = {
        success: false,
        message: "User verification failed",
        responsecode: 401,
      };
      res.setHeader("responseheader", encryptresponse(response));
      return res.status(401).send(response);
    }

    const user = foundUser[1]?.[0];
    const isAdmin = user?.user_role === "Admin";

    // Query depends on whether the user is an Admin or not
    const query = isAdmin
      ? `SELECT * FROM courses WHERE course_id = $1`
      : `SELECT * FROM courses WHERE course_id = $1 AND course_status = 'Active'`;

    try {
      const result = await client.query(query, [course_id]);

      if (result.rows.length === 0) {
        const response = {
          success: false,
          message: "Course not found",
          responsecode: 404,
        };
        res.setHeader("responseheader", encryptresponse(response));
        return res.status(404).send(response);
      }

      const course = formatCourse(result.rows[0]);
      const response = {
        success: true,
        message: "Course fetched successfully",
        responsecode: 200,
        data: course,
      };
      res.setHeader("responseheader", encryptresponse(response));
      return res.status(200).send(response);
    } catch (dbErr) {
      console.error("Database error:", dbErr);
      const response = {
        success: false,
        message: "Failed to fetch course",
        responsecode: 500,
      };
      res.setHeader("responseheader", encryptresponse(response));
      return res.status(500).send(response);
    }
  });
};

exports.updateCourse = async (req, res) => {
  const {
    token,
    accesstoken,
    course_id,
    course_title,
    course_description,
    course_duration,
    course_mode,
    course_tools,
    course_for,
    course_status,
    course_type // <-- added here
  } = req.body;

  // Validate tokens
  if (!token || !accesstoken) {
    const response = { success: false, message: 'Authorization tokens are required', responsecode: 0 };
    res.setHeader('responseheader', encryptresponse(response));
    return res.status(401).send(response);
  }

  // Validate required fields
  if (!course_id || !course_title || !course_description || !course_duration || !course_mode || !course_for || !course_status || !course_type) {
    const response = { success: false, message: 'Missing required course fields', responsecode: -1 };
    res.setHeader('responseheader', encryptresponse(response));
    return res.status(400).send(response);
  }

  // Validate course duration
  const durationNum = Number(course_duration);
  if (isNaN(durationNum) || durationNum <= 0 || !Number.isInteger(durationNum)) {
    const response = { success: false, message: 'Course duration must be a positive integer', responsecode: -1 };
    res.setHeader('responseheader', encryptresponse(response));
    return res.status(400).send(response);
  }

  try {
    // Validate user and role
    const foundUser = await new Promise((resolve, reject) => {
      getuserProfilefromtoken(accesstoken, token, (err, user) => {
        if (err) reject(err);
        else resolve(user);
      });
    });

    if (!foundUser || foundUser.length !== 2 || foundUser[1][0].user_role !== 'Admin') {
      const response = { success: false, message: 'Access denied: Only Admins can update courses', responsecode: -1 };
      res.setHeader('responseheader', encryptresponse(response));
      return res.status(403).send(response);
    }

    const userId = foundUser[1][0].user_id;

    // Validate image file if provided
    const courseImage = req.file ? req.file.filename : null;
    if (courseImage && !req.file.mimetype.startsWith('image/')) {
      const response = { success: false, message: 'Course image must be an image file', responsecode: -1 };
      res.setHeader('responseheader', encryptresponse(response));
      return res.status(400).send(response);
    }

    // Ensure DB client is initialized
    if (!client || typeof client.query !== 'function') {
      throw new Error('Database client is not initialized');
    }

    const updateQuery = `
      UPDATE courses
      SET
        course_title = $1,
        course_description = $2,
        course_duration = $3,
        course_mode = $4,
        course_tools = $5,
        course_for = $6,
        course_status = $7,
        course_type = $8,
        updated_by = $9,
        course_image = COALESCE($10, course_image),
        updated_at = $11
      WHERE course_id = $12
    `;

    const values = [
      course_title,
      course_description,
      durationNum,
      course_mode,
      course_tools || null,
      course_for,
      course_status,
      course_type,
      userId,
      courseImage,
      new Date().toISOString(),
      course_id
    ];

    const result = await client.query(updateQuery, values);

    if (result.rowCount === 0) {
      const response = { success: false, message: 'Course not found or update failed', responsecode: -1 };
      res.setHeader('responseheader', encryptresponse(response));
      return res.status(404).send(response);
    }

    const response = {
      success: true,
      message: 'Course updated successfully',
      responsecode: 200
    };
    res.setHeader('responseheader', encryptresponse(response));
    return res.status(200).send(response);

  } catch (error) {
    console.error("Error during updateCourse execution:", error);
    const response = {
      success: false,
      message: error.message || 'Server error',
      responsecode: -1
    };
    res.setHeader("responseheader", encryptresponse(response));
    return res.status(500).send(response);
  }
};

exports.deleteCourse = async (req, res) => {
  const { token, accesstoken, course_id } = req.body;

  // Token check
  if (!token || !accesstoken) {
    const response = { success: false, message: 'Authorization tokens are required', responsecode: 0 };
    res.setHeader('responseheader', encryptresponse(response));
    return res.send(response);
  }

  try {
    getuserProfilefromtoken(accesstoken, token, async (err, foundUser) => {
      if (err || !foundUser || foundUser.length !== 2 || foundUser[1][0].user_role !== 'Admin') {
        const response = { success: false, message: 'Access denied: Only Admins can delete courses', responsecode: -1 };
        res.setHeader('responseheader', encryptresponse(response));
        return res.send(response);
      }

      try {
        if (!client || typeof client.query !== 'function') {
          throw new Error('Database client is not initialized properly.');
        }

        // Delete query
        const deleteQuery = `
          DELETE FROM courses
          WHERE course_id = $1
        `;

        const result = await client.query(deleteQuery, [course_id]);

        if (result.rowCount === 0) {
          const response = { success: false, message: 'Course not found or delete failed', responsecode: 404 };
          res.setHeader('responseheader', encryptresponse(response));
          return res.send(response);
        }

        const response = { success: true, message: 'Course deleted successfully', responsecode: 200 };
        res.setHeader('responseheader', encryptresponse(response));
        return res.send(response);
      } catch (dbError) {
        console.error('Database delete error:', dbError);
        const response = { success: false, message: dbError.message, responsecode: -500 };
        res.setHeader('responseheader', encryptresponse(response));
        return res.send(response);
      }
    });
  } catch (error) {
    console.error('Error during deleteCourse execution:', error);
    const response = { success: false, message: error.message, responsecode: -500 };
    res.setHeader('responseheader', encryptresponse(response));
    return res.send(response);
  }
};

exports.viewcoursesdetails = async (req, res) => {
  const { token, accesstoken, course_id } = req.body;

  // Validate input
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
    getuserProfilefromtoken(accesstoken, token, async (err, foundUser) => {
      if (err || !foundUser || foundUser.length !== 2 || !foundUser[1][0]) {
        const response = {
          success: false,
          message: 'Access denied: Invalid user token',
          responsecode: -1
        };
        res.setHeader('responseheader', encryptresponse(response));
        return res.send(response);
      }

      // User is authenticated - no role check, so anyone logged in can proceed

      try {
        if (!client || typeof client.query !== 'function') {
          throw new Error('Database client is not initialized properly.');
        }

        // Fetch the course by ID
        const courseResult = await client.query(`SELECT * FROM courses WHERE course_id = $1`, [course_id]);
        if (courseResult.rows.length === 0) {
          const response = { success: false, message: 'Course not found', responsecode: 404 };
          res.setHeader('responseheader', encryptresponse(response));
          return res.send(response);
        }

        const course = courseResult.rows[0];

        // Fetch modules
        const modulesResult = await client.query(`SELECT * FROM modules WHERE course_id = $1`, [course.course_id]);
        const modules = await Promise.all(
          modulesResult.rows.map(async (module) => {
            // Fetch topics
            const topicsResult = await client.query(`SELECT * FROM topics WHERE module_id = $1`, [module.module_id]);
            const topics = await Promise.all(
              topicsResult.rows.map(async (topic) => {
                // Fetch videos
                const videosResult = await client.query(`SELECT * FROM videos WHERE topic_id = $1`, [topic.topic_id]);
                return {
                  ...topic,
                  videos: videosResult.rows
                };
              })
            );

            return {
              ...module,
              topics
            };
          })
        );

        const response = {
          success: true,
          message: 'Course details retrieved successfully',
          responsecode: 200,
          data: {
            ...course,
            modules
          }
        };

        res.setHeader('responseheader', encryptresponse(response));
        return res.send(response);
      } catch (dbError) {
        console.error('Database error:', dbError);
        const response = { success: false, message: dbError.message, responsecode: -500 };
        res.setHeader('responseheader', encryptresponse(response));
        return res.send(response);
      }
    });
  } catch (error) {
    console.error('Execution error:', error);
    const response = { success: false, message: error.message, responsecode: -500 };
    res.setHeader('responseheader', encryptresponse(response));
    return res.send(response);
  }
};


exports.addModulesToCourse = async (req, res) => {
  console.log("Adding modules to existing course...");
  const { token, accesstoken, course_id, modules } = req.body;

  if (!token || !accesstoken || !course_id || !modules) {
    const response = { success: false, message: 'Missing required fields', responsecode: -1 };
    res.setHeader('responseheader', encryptresponse(response));
    return res.status(400).send(response);
  }

  let parsedModules = [];
  try {
    parsedModules = JSON.parse(modules);
    if (!Array.isArray(parsedModules)) {
      throw new Error('Modules must be an array');
    }
  } catch (e) {
    const response = { success: false, message: `Invalid modules JSON: ${e.message}`, responsecode: -1 };
    res.setHeader('responseheader', encryptresponse(response));
    return res.status(400).send(response);
  }

  try {
    const foundUser = await new Promise((resolve, reject) => {
      getuserProfilefromtoken(accesstoken, token, (err, user) => {
        if (err) reject(err);
        else resolve(user);
      });
    });

    if (!foundUser || foundUser[1][0].user_role !== 'Admin') {
      const response = { success: false, message: 'Access denied: Only Admins can add modules', responsecode: -1 };
      res.setHeader('responseheader', encryptresponse(response));
      return res.status(403).send(response);
    }

    const uploadedVideos = req.files && req.files['videos'] ? req.files['videos'] : [];
    let videoIndex = 0;
    const timestamp = new Date().toISOString();

    await client.query('BEGIN');

    for (const module of parsedModules) {
      const moduleOrder = Number(module.order);
      if (!module.title || isNaN(moduleOrder) || moduleOrder <= 0) {
        throw new Error('Invalid module title or order');
      }

      const moduleRes = await client.query(
        `INSERT INTO modules (course_id, module_title, module_order, created_at, updated_at)
         VALUES ($1, $2, $3, $4, $5) RETURNING module_id`,
        [course_id, module.title, moduleOrder, timestamp, timestamp]
      );
      const moduleId = moduleRes.rows[0].module_id;

      for (const topic of module.topics || []) {
        const topicOrder = Number(topic.order);
        if (!topic.title || isNaN(topicOrder) || topicOrder <= 0) {
          throw new Error('Invalid topic title or order');
        }

        const topicRes = await client.query(
          `INSERT INTO topics (module_id, topic_title, topic_order, created_at, updated_at)
           VALUES ($1, $2, $3, $4, $5) RETURNING topic_id`,
          [moduleId, topic.title, topicOrder, timestamp, timestamp]
        );
        const topicId = topicRes.rows[0].topic_id;

        for (const video of topic.videos || []) {
          const videoDuration = Number(video.duration);
          const videoOrder = Number(video.order);
          const videoFile = uploadedVideos[videoIndex] ? uploadedVideos[videoIndex].filename : null;

          if (!video.title || isNaN(videoDuration) || isNaN(videoOrder) || !videoFile) {
            throw new Error(`Invalid video data or missing video file for video index ${videoIndex}`);
          }

          if (!uploadedVideos[videoIndex].mimetype.startsWith('video/')) {
            throw new Error(`Invalid file type for video at index ${videoIndex}`);
          }

          await client.query(
            `INSERT INTO videos (topic_id, video_title, video_url, video_duration, video_order, created_at, updated_at)
             VALUES ($1, $2, $3, $4, $5, $6, $7)`,
            [topicId, video.title, videoFile, videoDuration, videoOrder, timestamp, timestamp]
          );

          videoIndex++;
        }
      }
    }

    await client.query('COMMIT');
    const response = { success: true, message: 'Modules added successfully', responsecode: 200 };
    res.setHeader('responseheader', encryptresponse(response));
    return res.status(200).send(response);

  } catch (error) {
    await client.query('ROLLBACK').catch(console.error);
    console.error('Error adding modules:', error.stack);
    const response = { success: false, message: error.message || 'Server error', responsecode: -1 };
    res.setHeader('responseheader', encryptresponse(response));
    return res.status(500).send(response);
  }
};

exports.getAllModulesOfCourse = async (req, res) => {
  const { token, accesstoken, course_id } = req.body;

  // Input validation
  if (!token || !accesstoken || !course_id) {
    const response = {
      success: false,
      message: "Missing required fields: token, accesstoken, course_id",
      responsecode: -1,
    };
    res.setHeader("responseheader", encryptresponse(response));
    return res.status(400).send(response);
  }

  try {
    // Authenticate user
    const foundUser = await new Promise((resolve, reject) => {
      getuserProfilefromtoken(accesstoken, token, (err, user) => {
        if (err) reject(err);
        else resolve(user);
      });
    });

    if (!foundUser || !foundUser[1][0]) {
      const response = {
        success: false,
        message: "Invalid user token",
        responsecode: -1,
      };
      res.setHeader("responseheader", encryptresponse(response));
      return res.status(403).send(response);
    }

    // Fetch all modules for the course
    const modulesRes = await client.query(
      `SELECT module_id, module_title, module_order FROM modules WHERE course_id = $1 ORDER BY module_order ASC`,
      [course_id]
    );

    const modules = modulesRes.rows;

    for (const module of modules) {
      // Fetch topics for each module
      const topicsRes = await client.query(
        `SELECT topic_id, topic_title, topic_order FROM topics WHERE module_id = $1 ORDER BY topic_order ASC`,
        [module.module_id]
      );

      module.topics = topicsRes.rows;

      for (const topic of module.topics) {
        // Fetch videos for each topic
        const videosRes = await client.query(
          `SELECT video_id, video_title, video_url, video_duration, video_order
           FROM videos WHERE topic_id = $1 ORDER BY video_order ASC`,
          [topic.topic_id]
        );

        topic.videos = videosRes.rows;
      }
    }

    const response = {
      success: true,
      message: "Modules retrieved successfully",
      responsecode: 200,
      data: modules,
    };

    res.setHeader("responseheader", encryptresponse(response));
    return res.status(200).send(response);

  } catch (error) {
    console.error("Error fetching modules:", error);
    const response = {
      success: false,
      message: "Server error: " + error.message,
      responsecode: -1,
    };
    res.setHeader("responseheader", encryptresponse(response));
    return res.status(500).send(response);
  }
};

exports.deleteModule = async (req, res) => {
  const { token, accesstoken, module_id } = req.body;

  // Input validation
  if (!token || !accesstoken || !module_id) {
    const response = {
      success: false,
      message: "Missing required fields: token, accesstoken, module_id",
      responsecode: -1,
    };
    res.setHeader("responseheader", encryptresponse(response));
    return res.status(400).send(response);
  }

  try {
    // Authenticate user
    const foundUser = await new Promise((resolve, reject) => {
      getuserProfilefromtoken(accesstoken, token, (err, user) => {
        if (err) reject(err);
        else resolve(user);
      });
    });

    if (!foundUser || !foundUser[1][0]) {
      const response = {
        success: false,
        message: "Invalid user token",
        responsecode: -1,
      };
      res.setHeader("responseheader", encryptresponse(response));
      return res.status(403).send(response);
    }

    // Start transaction
    await client.query("BEGIN");

    // First, delete all videos related to topics of this module
    // Find all topic IDs in this module
    const topicRes = await client.query(
      `SELECT topic_id FROM topics WHERE module_id = $1`,
      [module_id]
    );
    const topicIds = topicRes.rows.map(row => row.topic_id);

    if (topicIds.length > 0) {
      // Delete videos of those topics
      await client.query(
        `DELETE FROM videos WHERE topic_id = ANY($1)`,
        [topicIds]
      );

      // Delete topics themselves
      await client.query(
        `DELETE FROM topics WHERE module_id = $1`,
        [module_id]
      );
    }

    // Finally, delete the module
    await client.query(
      `DELETE FROM modules WHERE module_id = $1`,
      [module_id]
    );

    // Commit transaction
    await client.query("COMMIT");

    const response = {
      success: true,
      message: "Module and related topics/videos deleted successfully",
      responsecode: 200,
    };

    res.setHeader("responseheader", encryptresponse(response));
    return res.status(200).send(response);

  } catch (error) {
    // Rollback transaction on error
    await client.query("ROLLBACK");
    console.error("Error deleting module:", error);
    const response = {
      success: false,
      message: "Server error: " + error.message,
      responsecode: -1,
    };
    res.setHeader("responseheader", encryptresponse(response));
    return res.status(500).send(response);
  }
};
