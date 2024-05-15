const nodemailer = require('nodemailer');
const {google} = require('googleapis');
const OAuth2 = google.auth.OAuth2;


const createTransporter = async () => {
    const oauth2Client = new OAuth2(
        process.env.CLIENT_ID,
        process.env.CLIENT_SECRET,
        process.env.REDIRECT_URL
    );

    oauth2Client.setCredentials({
        refresh_token: process.env.REFRESH_TOKEN
    });

    const accessToken = await new Promise((resolve, reject) => {
        oauth2Client.getAccessToken((err, token) => {
            if (err) {
                reject("Failed to create access token :(");
            }
            resolve(token);
        });
    });

    return nodemailer.createTransport({
        service: "gmail",
        auth: {
            type: "OAuth2",
            user: "autofeedback003@gmail.com",
            accessToken,
            clientId: process.env.CLIENT_ID,
            clientSecret: process.env.CLIENT_SECRET,
            refreshToken: process.env.REFRESH_TOKEN // corrected from TOKEN_SECRET
        }
    });
};

const sendEmail = async (emailOptions) => {
    try {
        let emailTransporter = await createTransporter();
        const result = await emailTransporter.sendMail(emailOptions);
        console.log('Email sent: ', result);
        return result;
    } catch (error) {
        console.error('Error sending email: ', error);
        if (error.response) {
            console.error('Error details:', error.response);
        }
        throw error;
    }
};

module.exports = {sendEmail};
