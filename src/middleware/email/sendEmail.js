// backend/utils/email/sendEmail.js

import nodemailer from "nodemailer";

const sendEmail = async (toEmail, template) => {
    // Input validation
    if (!toEmail || !toEmail.trim()) {
        console.error("Error: Recipient email is required");
        return { success: false, error: 'Recipient email is required' };
    }

    if (!template || !template.subject) {
        console.error("Error: Email template is invalid");
        return { success: false, error: 'Invalid email template' };
    }

    if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
        console.error("Error: Email credentials not configured");
        return { success: false, error: 'Email service configuration error' };
    }

    console.log("Sending email to:", toEmail);

    try {
        const transporter = nodemailer.createTransport({
            host: 'smtp.gmail.com',
            port: 587,
            secure: false, // true for 465, false for other ports
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASS
            },
            tls: {
                rejectUnauthorized: false // For development only, remove in production with valid certificates
            }
        });

        // Verify connection configuration
        await transporter.verify();

        const mailOptions = {
            from: `"InternBoys" <${process.env.EMAIL_USER}>`,
            to: toEmail.trim(),
            subject: template.subject,
            text: template.text || '',
            html: template.html || template.text || ''
        };

        const info = await transporter.sendMail(mailOptions);
        console.log('Email sent:', info.messageId);
        return {
            success: true,
            messageId: info.messageId,
            message: 'Email sent successfully'
        };
    }
    catch (error) {
        console.error("Error sending email:", error);
        return {
            success: false,
            error: error.message || 'Failed to send email',
            details: error
        };
    }
};

export default sendEmail;
