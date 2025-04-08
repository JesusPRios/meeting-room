import SMTPConnection from "smtp-connection";

// Function to send an email using SMTP
export const sendEmail = ({ to, from, subject, text, attachments = [] }) => {
  // Create a new SMTP connection
  return new Promise((resolve, reject) => {
    const smtp = new SMTPConnection({
      host: "smtp.gmail.com",
      port: 587,
      secure: false,
      debug: true,
    });

    // Connect to the SMTP server
    smtp.connect((err) => {
      if (err) {
        console.error("Error conectando al servidor SMTP:", err);
        smtp.quit();
        return reject(err);
      }

      // Authenticate with the SMTP server
      // Replace the username and password with your own
      smtp.login(
        {
          user: "mjesusprimera@gmail.com",
          pass: "hgyz sewu nncy qevx",
        },
        (loginErr) => {
          if (loginErr) {
            console.error("Error al autenticar:", loginErr);
            smtp.quit();
            return reject(loginErr);
          }

          const boundary = "----=_Boundary_";
          let message =
            `From: ${from}\r\n` +
            `To: ${to}\r\n` +
            `Subject: ${subject}\r\n` +
            `MIME-Version: 1.0\r\n` +
            `Content-Type: multipart/mixed; boundary="${boundary}"\r\n\r\n` +
            `--${boundary}\r\n` +
            `Content-Type: text/plain; charset="UTF-8"\r\n\r\n` +
            `${text}\r\n\r\n`;

          // Procesar los attachments
          attachments.forEach((attachment) => {
            const { content, filename, contentType } = attachment;

            if (content) {
              message +=
                `--${boundary}\r\n` +
                `Content-Type: ${contentType};\r\n` +
                ` name="${filename}"\r\n` +
                `Content-Transfer-Encoding: base64\r\n` +
                `Content-Disposition: attachment;\r\n` +
                ` filename="${filename}"\r\n\r\n` +
                `${content.toString("base64")}\r\n\r\n`;
            } else {
              console.error("Attachment content no definido");
            }
          });

          message += `--${boundary}--`;

          // Send the email with the message body
          smtp.send(
            {
              from: "mjesusprimera@gmail.com",
              to,
              headers: {
                From: "Oficina de Sistemas <mjesusprimera@gmail.com>",
                "Reply-To": from,
                "X-Priority": "1", // 1 = Alta, 3 = Normal, 5 = Baja
                Priority: "urgent", // Opcional pero útil
                Importance: "high",
              },
            },
            message,
            (sendErr, info) => {
              if (sendErr) {
                console.error("Error al enviar el correo:", sendErr);
                smtp.quit();
                return reject(sendErr);
              }
              smtp.quit();
              resolve(info);
            }
          );
        }
      );
    });

    // Handle errors
    smtp.on("error", (error) => {
      console.error("Error general en SMTP:", error);
      smtp.quit();
      reject(error);
    });
  });
};
