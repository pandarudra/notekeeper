import nodemailer from "nodemailer";
import { google } from "googleapis";
import dotenv from "dotenv";
dotenv.config();

const OAuth2 = google.auth.OAuth2;
const oauth2Client = new OAuth2(
  process.env.CLIENT_ID,
  process.env.CLIENT_SECRET,
  process.env.URL // This is where Google will redirect to after the user grants permission
);
oauth2Client.setCredentials({
  refresh_token: process.env.REFRESH_TOKEN,
});
async function sendEmail(to, name) {
  try {
    const accessToken = await oauth2Client.getAccessToken();
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        type: "OAuth2",
        user: process.env.EMAIL,
        clientId: process.env.CLIENT_ID,
        clientSecret: process.env.CLIENT_SECRET,
        refreshToken: process.env.REFRESH_TOKEN,
        accessToken: accessToken,
      },
    });
    const mailOptions = {
      from: process.env.EMAIL,
      to: to,
      subject: "Hello from Sweet Chat",
      text: `Hello ${name}! Welcome to Sweet Chat!`,
      html: `<div>Hello ${name}! Welcome to Sweet Chat!</div>`,
    };
    const result = await transporter.sendMail(mailOptions);
    return result;
  } catch (error) {
    return error;
  }
}

export default sendEmail;
