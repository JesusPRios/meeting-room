import nodemailer from 'nodemailer';

export const sendEmail = async ({ to, subject, text, html, attachments = [] }) => {
  const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 587,
    secure: false, 
    auth: {
      user: "conferenceroomsena@gmail.com",
      pass: "udvx qxxz xcrq nnzj",
    },
  });

  const mailOptions = {
    from: 'Oficina de Sistemas SENA <conferenceroomsena@gmail.com>',
    to,
    subject,
    text, // versión texto plano
    html, // versión HTML bonita
    attachments,
    // headers: {
    //   "X-Priority": "1",
    //   Importance: "high",
    //   "X-Mailer": "Nodemailer",
    // },
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    console.log('Correo enviado:', info.messageId);
    return info;
  } catch (error) {
    console.error('Error enviando correo:', error);
    throw error;
  }
};
