const Notification = require('../models/Notification');
const nodemailer = require('nodemailer');
const axios = require('axios');
require('dotenv').config();

const getUserNameById = async (userId) => {
    try {
        const response = await axios.get(process.env.USER_SERVICE_URL + '/id/' + userId);
        
        // Extract username from the response
        const username = response.data.username;

        return username;
    } catch (error) {
        console.error("Error fetching user:", error.response ? error.response.data : error.message);
        return null;
    }
};

// Email transporter (configure with your email provider)
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
    },
});

async function sendNotification(notification) {
    try {
        // Get username from user service
        const username = await getUserNameById(notification.userId);
        if (!username) {
            throw new Error('User not found');
        }

        // Send email
        if (notification.channel === 'email') {
            await transporter.sendMail({
                from: process.env.EMAIL_USER,
                to: username + '@nu.edu.pk',
                subject: 'Notification',
                text: notification.message,
            });
        }

        // Save notification log to MongoDB
        const notificationLog = new Notification(notification);
        notificationLog.status = 'sent';
        await notificationLog.save();

        return { success: true }; // Return success
    } catch (err) {
        const notificationLog = new Notification(notification);
        notificationLog.status = 'failed';
        await notificationLog.save();

        throw err; // Rethrow error to controller
    }
}


module.exports = { sendNotification };