import express from "express";
import { pool } from "../app.js";
import cookieParser from "cookie-parser";
import multer from "multer";
import { sendEmail } from "../smtp/smtp.js";

const router = express.Router();
router.use(cookieParser());

const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

router.get("/get-reservation", async (req, res) => {
  const sql = `
    SELECT 
      r.id,
      r.reason,
      r.date,
      r.timeStart,
      r.timeEnd,
      r.duration,
      r.participants,
      r.status,
      r.user_id,
      u.name AS nombre_usuario
    FROM 
      meeting.reservation r
    JOIN 
      meeting.user u ON r.user_id = u.id
  `;

  try {
    const [result] = await pool.query(sql);

    if (result.length === 0) {
      res.status(200).json({ error: "No se encontró ninguna reservación" });
      return;
    }

    res.json(result);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

router.post("/register-reservation", async (req, res) => {
  const {
    reason,
    date,
    timeStart,
    timeEnd,
    duration,
    participants,
    status,
    cedula_user,
  } = req.body;

  try {
    const sql1 = `SELECT * FROM meeting.user WHERE cedula = ?`;
    const [result1] = await pool.query(sql1, [cedula_user]);

    if (result1.length === 0) {
      return res.status(200).json({ error: "No se encontro el usuario" });
    }

    const user = result1[0];
    const user_id = user.id;
    const user_email = user.email;
    const user_name = user.name;

    const sql2 = `INSERT INTO meeting.reservation (reason, date, timeStart, timeEnd, duration, participants, status, user_id)
    VALUES (?,?,?,?,?,?,?,?)
    `;

    const [result2] = await pool.query(sql2, [
      reason,
      date,
      timeStart,
      timeEnd,
      duration,
      participants,
      status,
      user_id,
    ]);

    await sendEmail({
      to: "sistemascip@sena.edu.co",
      subject: "Petición de Reservación",
      text: `Estimado administrador,
    
    Se le informa que el usuario ${user_name} ha realizado una solicitud de reservación.
    
    Detalles de la reservación:
    - Fecha: ${date}
    - Hora de inicio: ${timeStart}
    - Hora de finalización: ${timeEnd}
    - Motivo: ${reason}
    
    Por favor, ingrese a su cuenta para gestionar esta petición:
    http://10.4.32.29:5173/signin
    
    Cordial saludo,
    Sistema de Reservaciones`,
    });

    await sendEmail({
      to: user_email,
      from: "Oficina de Sistemas <mjesusprimera@gmail.com>",
      subject:
        "Solicitud de Reserva de Sala de Juntas Pendiente de Autorización",
      text: `Estimado/a ${user_name},

Gracias por tu solicitud de reserva para la sala de juntas. Queremos informarte que tu solicitud se encuentra actualmente pendiente de validación y autorización. En breve, nuestro equipo revisará la disponibilidad y condiciones para confirmar la reserva.

Te notificaremos lo antes posible sobre el estado de tu solicitud.

Si tienes alguna pregunta o necesitas más información, no dudes en contactarnos a traves de el correo electronico: sistemascip@sena.edu.co

Gracias por tu comprensión y paciencia.

Saludos cordiales,
Ofician de Sistemas`,
    });

    res.status(200).json({
      message: "Reservation registered successfully",
      success: true
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

router.get("/get-reservation-by-date/:date", async (req, res) => {
  const date = req.params.date;
  const sql = `
    SELECT 
      r.id,
      r.reason,
      r.date,
      r.timeStart,
      r.timeEnd,
      r.duration,
      r.participants,
      r.status,
      r.user_id,
      u.name AS nombre_usuario
    FROM 
      meeting.reservation r
    JOIN 
      meeting.user u ON r.user_id = u.id
    WHERE 
      r.date = ?
  `;

  try {
    const [result] = await pool.query(sql, [date]);

    if (result.length === 0) {
      res.status(200).json({ error: "No se encontró ninguna reservación" });
      return;
    }

    res.json(result);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

router.get("/get-reservation-by-id/:id", async (req, res) => {
  const id = req.params.id;
  const sql = `
    SELECT 
      r.id,
      r.reason,
      r.date,
      r.timeStart,
      r.timeEnd,
      r.duration,
      r.participants,
      r.status,
      r.user_id,
      u.name AS nombre_usuario,
      u.cedula AS cedula_user
    FROM 
      meeting.reservation r
    JOIN 
      meeting.user u ON r.user_id = u.id
    WHERE 
      r.id = ?
  `;

  try {
    const [result] = await pool.query(sql, [id]);

    if (result.length === 0) {
      res.status(200).json({ error: "No se encontró ninguna reservación" });
      return;
    }

    res.json(result);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

router.post("/accept-reservation/:id-:cedula", async (req, res) => {
  const id = req.params.id;
  const cedula = req.params.cedula;

  try {
    const sql = `UPDATE meeting.reservation SET status = 'Confirmada' WHERE id = ?`;
    await pool.query(sql, [id]);

    const sql2 = `SELECT * FROM meeting.user WHERE cedula = ?`;
    const [result2] = await pool.query(sql2, [cedula]);

    if (result2.length === 0) {
      return res.status(200).json({ error: "No se encontro el usuario" });
    }

    const user = result2[0];
    const user_email = user.email;
    const user_name = user.name;

    await sendEmail({
      to: user_email,
      subject: "Reservación Aceptada",
      text: `Estimado/a ${user_name},
    
    Nos complace informarte que tu solicitud de reserva para la sala de juntas ha sido aceptada y confirmada exitosamente.
    
    Te agradecemos por seguir el procedimiento correspondiente y te recordamos respetar los horarios y condiciones establecidos para el uso del espacio. Si tienes alguna pregunta o necesitas más información, no dudes en contactarnos a traves de el correo electronico: sistemascip@sena.edu.co
    
    Saludos cordiales,
    Oficina de Sistemas`,
      priority: "high",
      headers: {
        "X-Priority": "1",
        "X-MSMail-Priority": "High",
        Importance: "high",
      },
    });

    res
      .status(200)
      .json({ success: true, message: "Reservation accepted successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

router.post("/reject-reservation/:id-:cedula", async (req, res) => {
  const id = req.params.id;
  const cedula = req.params.cedula;

  try {
    const sql = `UPDATE meeting.reservation SET status = 'Rechazada' WHERE id = ?`;
    await pool.query(sql, [id]);

    const sql2 = `SELECT * FROM meeting.user WHERE cedula = ?`;
    const [result2] = await pool.query(sql2, [cedula]);

    if (result2.length === 0) {
      return res.status(200).json({ error: "No se encontro el usuario" });
    }
    const user = result2[0];
    const user_email = user.email;
    const user_name = user.name;

    await sendEmail({
      to: user_email,
      from: "Oficina de Sistemas <sistemascip@sena.edu.co>",
      subject: "Reservación Rechazada",
      text: `Estimado/a ${user_name},

Lamentamos informarte que tu solicitud de reserva para la sala de juntas ha sido rechazada.

Esto puede deberse a la no disponibilidad del espacio en la fecha y hora solicitada, o al incumplimiento de alguna condición establecida para el uso de la sala.

Si deseas más información o necesitas asistencia para realizar una nueva solicitud, estamos a tu disposición para ayudarte. Si tienes alguna pregunta o necesitas más información, no dudes en contactarnos a traves de el correo electronico: sistemascip@sena.edu.co

Agradecemos tu comprensión.

Saludos cordiales,
Oficina de Sistemas`,
    });

    res
      .status(200)
      .json({ success: true, message: "Reservation rejected successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

router.post("/login", async (req, res) => {
  const { username, password } = req.body;

  try {
    const sql = `SELECT * FROM meeting.admin WHERE username = ? AND password = ?`;
    const [result] = await pool.query(sql, [username, password]);

    if (result.length === 0) {
      return res.status(200).json({ error: "Contraseña incorrecta" });
    }

    const admin = result[0];
    res.json({ success: true, admin });
  } catch (error) {
    console.error("Error en login:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

router.get("/get-admins/:id", async (req, res) => {
  const { id } = req.params;

  try {
    const sql = `SELECT * FROM meeting.admin WHERE id = ?`;

    const [result] = await pool.query(sql, [id]);
    const admin = result[0];

    res.json({ admin });
  } catch (error) {
    console.error("Error para obtener el admin:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

router.put("/update-reservation/:id", async (req, res) => {
  const { estado } = req.body;
  const id = req.params.id;

  try {
    const sql = `UPDATE meeting.reservation SET status = ? WHERE id = ?`;
    await pool.query(sql, [estado, id]);

    res
      .status(200)
      .json({ success: true, message: "Reservation updated successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

router.post("/notify-admin-reservation-pending/:id", async (req, res) => {
  const { id } = req.params;
  console.log(id);

  try {
    const sql = `SELECT * FROM meeting.reservation WHERE id = ?`;
    const [rows] = await pool.query(sql, [id]);
    const reservation = rows[0];

    if (!reservation) {
      return res.status(404).json({ error: "Reservation not found" });
    }
    const { date, timeStart } = reservation;

    const fechaFormateada = new Date(date).toLocaleDateString("es-CO", {
      weekday: "long",
      year: "numeric",
      month: "long", 
      day: "numeric",
    });

    const capitalizada =
      fechaFormateada.charAt(0).toUpperCase() + fechaFormateada.slice(1);

    const data = {
      to: "sistemascip@sena.edu.co",
      subject: "Reservación Pendiente",
      text: `Estimado Administrador,

Se le informa que una reservación programada para el día ${capitalizada} está pendiente de autorización.
La reunión está agendada para comenzar a las ${timeStart}.

Por favor, acceda a su cuenta para gestionar esta petición:
http://10.4.32.29:5173/signin

Cordial saludo,
Sistema de Reservaciones
      `,
    };

    await sendEmail(data);

    res.status(200).json({ success: true });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

router.get("/search-users", async (req, res) => {
  const { cedula } = req.query;

  try {
    const sql = `SELECT id, name, cedula FROM meeting.user WHERE cedula LIKE ? LIMIT 5`;
    const [rows] = await pool.query(sql, [`${cedula}%`]);
    res.json(rows);
  } catch (error) {
    console.error("Error buscando usuarios por cédula:", error);
    res.status(500).json({ error: "Error en el servidor" });
  }
});

export default router;
