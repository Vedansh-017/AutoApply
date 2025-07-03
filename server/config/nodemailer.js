import nodemailer from 'nodemailer';
const transporter=nodemailer.createTransport({
  host: 'smtp-relay.brevo.com',
  port: 587,
  auth: {
    user: process.env.SMTP_USER ,
    pass: process.env.SMTP_PASS,
  },
});

export default transporter;
// This code sets up a Nodemailer transporter using the SMTP host defined in the configuration file.