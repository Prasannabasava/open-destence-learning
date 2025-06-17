const client = require('../DataBase/database');
require("../middlewares/functions")();
const nodemailer = require("nodemailer");


// Configure Nodemailer transporter for Hostinger SMTP
let transporter = nodemailer.createTransport({
    host: "smtp.gmail.com", // Hostinger SMTP server
    port: 465, // Secure port for Hostinger
    secure: true, // Use SSL (for port 465)
    auth: {
        user: process.env.SMTP_USER, // Your Hostinger email (set in .env)
        pass: process.env.SMTP_PASS,  // Your Hostinger email password (set in .env)
    },
    tls: {
        rejectUnauthorized: false, // Ignore self-signed certificate (if needed for development)
    }
});

// Function to send an email
const sendEmail = async (options) => {
    // Email options
    const mailOptions = {
        from: process.env.EMAIL_FROM,   // Sender email (your Hostinger email)
        to: options.to,                 // Recipient email
        subject: options.subject,       // Subject of the email
        html: options.text,             // Email body (HTML content)
    };

    let priority = isEmptyOrNull(options.priority) ? "Normal" : options.priority;

    try {
        // 1. Send the email via Hostinger SMTP
        let info = await transporter.sendMail(mailOptions);

        // 2. Insert email log into the database
        const query = `INSERT INTO emails(
                       user_id, email_subject, email_content, email_received, email_status, email_date, email_priority, email_info) 
                       VALUES ($1, $2, $3, $4, $5, NOW(), $6, $7);`;

        const values = [mailOptions.subject, mailOptions.html, mailOptions.to, 'Sent', priority, info];

        client.query(query, values, (err, result) => {
            if (err) {
                console.error("Database insert error: ", err.message);
            } else {
                console.log({
                    success: true,
                    message: 'Email log inserted into database',
                    rowCount: result.rowCount,
                    responseCode: 200
                });
            }
        });

    } catch (error) {
        console.error("Error sending email: ", error);
        // Handle any error that occurred during email sending
    }
};

// Function to send an unsuccessful email
const sendUnsuccessEmail = async ({ to, subject, text, html, priority }) => {
    const mailOptions = {
        from: process.env.EMAIL_FROM,   // Sender email (your Hostinger email)
        to: to,                         // Recipient email
        subject: subject,               // Subject of the email
        text: text,                     // Text content of the email
        html: html,                     // HTML content of the email
        priority: priority              // Priority of the email
    };

    try {
        // 1. Send the email via Hostinger SMTP
        let info = await transporter.sendMail(mailOptions);

        // 2. Insert email log into the database
        const query = `INSERT INTO public.emails(
                         email_subject, email_content, email_received, email_status, email_date, email_priority,email_info)
                       VALUES ($1, $2, $3, $4, NOW(), $5, $6)`;

        const values = [mailOptions.subject, mailOptions.html, mailOptions.to, 'Sent', priority, info];

        // Log the email to the database
        client.query(query, values, (err, result) => {
            if (err) {
                console.error("Database insert error: ", err.message);
            } else {
                console.log({
                    success: true,
                    message: 'Email log inserted into database',
                    rowCount: result.rowCount,
                    responseCode: 200
                });
            }
        });

    } catch (error) {
        console.error("Error sending unsuccessful email: ", error);
        // Handle error that occurred during unsuccessful email sending
    }
};

// const registeragainEmail = async ({ to, subject, text, html, priority }) => {
//     const mailOptions = {
//         from: process.env.EMAIL_FROM,   // Sender email (your Hostinger email)
//         to: to,                         // Recipient email
//         subject: subject,               // Subject of the email
//         text: text,                     // Text content of the email
//         html: html,                     // HTML content of the email
//         priority: priority              // Priority of the email
//     };

//     try {
//         // 1. Send the email via Hostinger SMTP
//         let info = await transporter.sendMail(mailOptions);

//         // 2. Insert email log into the database
//         const query = `INSERT INTO public.bs_emails(
//                          email_subject, email_content, email_received, email_status, email_date, email_priority,email_info)
//                        VALUES ($1, $2, $3, $4, NOW(), $5, $6)`;

//         const values = [mailOptions.subject, mailOptions.html, mailOptions.to, 'Sent', priority, info];

//         // Log the email to the database
//         client.query(query, values, (err, result) => {
//             if (err) {
//                 console.error("Database insert error: ", err.message);
//             } else {
//                 console.log({
//                     success: true,
//                     message: 'Email log inserted into database',
//                     rowCount: result.rowCount,
//                     responseCode: 200
//                 });
//             }
//         });

//     } catch (error) {
//         console.error("Error sending unsuccessful email: ", error);
//         // Handle error that occurred during unsuccessful email sending
//     }
// };
module.exports = { sendEmail, sendUnsuccessEmail };