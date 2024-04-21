import nodemailer from 'nodemailer';
import nodemailerExpressHandlebars from 'nodemailer-express-handlebars';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

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

const viewPath =  path.resolve(__dirname, './templates/');

const handlebarOptions = {
  viewEngine: {
    extname: '.hbs',
    layoutsDir: viewPath,
    defaultLayout: false, 
  },
  viewPath,
  extName: '.hbs',
};

transporter.use('compile', nodemailerExpressHandlebars(handlebarOptions));

export function sendMail(email, subject, templateName, context) {
  return new Promise((resolve, reject) => {
    const mailOptions = {
      from: process.env.MAIL_USERNAME,
      to: email,
      subject: subject,
      template: templateName,
      context,
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
