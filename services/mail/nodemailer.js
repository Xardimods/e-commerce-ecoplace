import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
  service: 'gmail',
  host: "smtp.gmail.com", //replace with your email provider
  port: 587,
  auth: {
    type: 'OAuth2',
    user: process.env.MAIL_USERNAME,
    pass: process.env.MAIL_PASSWORD,
    clientId: process.env.OAUTH_CLIENTID,
    clientSecret: process.env.OAUTH_CLIENT_SECRET,
    refreshToken: process.env.OAUTH_REFRESH_TOKEN
  }
});

export function sendMail(email, subject, html) {
  return new Promise((resolve, reject) => {
    const mailOptions = {
      from: process.env.MAIL_USERNAME,
      to: email,
      subject: subject,
      html: html,
    };

    transporter.sendMail(mailOptions, function (error, info) {
      if (error) {
        reject(error); // Rechazar la promesa en caso de error
      } else {
        resolve(info.response); // Resolver la promesa con la información de respuesta
      }
    });
  });
}
