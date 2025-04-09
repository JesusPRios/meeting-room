import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  host: "smtp.sendgrid.net",
  port: 587,
  secure: false,
  auth: {
    user: "apikey",
    pass: "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",
  },
});

export const SendGRID = async ({ to, from, subject, text }) => {
  console.log("Enviando correo a:", to);
  console.log("Desde:", from);
  console.log("Asunto:", subject);
  console.log("Texto:", text);
  console.log("Configuración del transportador:", transporter.options);
  try {
    const mailOptions = {
      from,
      to,
      subject,
      text,
      priority: "high",
      headers: {
        Importance: "high",
        "X-Priority": "1",
        "X-MSMail-Priority": "High",
      },
    };

    const info = await transporter.sendMail(mailOptions);
    console.log("Mensaje enviado:", info);

    return info;
  } catch (error) {
    console.error("Error enviando el correo:", error);
    throw error;
  }
};
