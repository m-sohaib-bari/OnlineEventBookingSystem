const NotificationService = require('../services/notificationService');

const sendNotification = async (req, res) => {
    const { userId, message, channel } = req.body;

    // Validate request body
    if (!userId || !message || !channel) {
        return res.status(400).json({ error: 'Missing required fields' });
    }

    try {
        // Prepare the notification object
        const notification = { userId, message, channel };

        // Send the notification
        await NotificationService.sendNotification(notification);

        // Send success response
        res.status(200).json({ message: 'Notification sent' });
    } catch (err) {
        console.error('Error sending notification:', err);
        res.status(500).json({ error: 'Failed to send notification' });
    }
};

module.exports = { sendNotification };