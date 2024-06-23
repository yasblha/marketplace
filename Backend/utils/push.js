const admin = require('firebase-admin');
const serviceAccount = require('../conf/serviceAccountKey.json');

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount)
});

const sendPushNotification = (userToken, message) => {
    const payload = {
        notification: {
            title: 'New Alert',
            body: message,
        }
    };

    admin.messaging().sendToDevice(userToken, payload)
        .then(response => {
            console.log('Successfully sent message:', response);
        })
        .catch(error => {
            console.error('Error sending message:', error);
        });
};

module.exports = { sendPushNotification };
