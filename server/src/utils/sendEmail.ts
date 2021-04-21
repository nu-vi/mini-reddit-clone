import nodemailer from 'nodemailer';
import { ZOHO_PASSWORD, ZOHO_USER } from '../privateConstants';

// async..await is not allowed in global scope, must use a wrapper
export async function sendEmail(to: string, subject: string, html: string) {
  // Generate test SMTP service account from ethereal.email
  // Only needed if you don't have a real mail account for testing
  // Only needed the first time you generate a ethereal mail fake account
  // const testAccount = await nodemailer.createTestAccount();
  // console.log('testAccount:', testAccount);

  // create reusable transporter object using the default SMTP transport
  // Only needed if you don't have a real mail account for testing
  // let transporter = nodemailer.createTransport({
  //   host: 'smtp.ethereal.email',
  //   port: 587,
  //   secure: false, // true for 465, false for other ports
  //   auth: {
  //     user: 'ooriq2kumv7lfvms@ethereal.email',
  //     pass: 'yyWqkFUY8NvDbvUrHN',
  //   },
  // });

  let transporter = nodemailer.createTransport({
    host: 'smtp.zoho.eu',
    port: 465,
    secure: true,
    auth: {
      user: ZOHO_USER,
      pass: ZOHO_PASSWORD,
    },
  });

  // send mail with defined transport object
  let info = await transporter.sendMail({
    from: '"LiReddit" <hi@nunovinagreiro.com>', // sender address
    to, // list of receivers
    subject, // Subject line
    html,
  });

  console.log('Message sent: %s', info.messageId);
  // Message sent: <b658f8ca-6296-ccf4-8306-87d57a0b4321@example.com>

  // Preview only available when sending through an Ethereal account
  console.log('Preview URL: %s', nodemailer.getTestMessageUrl(info));
  // Preview URL: https://ethereal.email/message/WaQKMgKddxQDoou...
}
