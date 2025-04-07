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

    const user_id = result1[0].id;

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

    // await sendEmail({
    //   to: "sistemascip@sena.edu.co",
    //   subject: "Petición de Reservación",
    //   text: `Buen día querido Administrador, un usuario ha realizado una reserva, ingrese a su cuenta y realice su función. Link: http:localhost:5173/`,
    // });

    res.status(201).json({
      message: "Reservation registered successfully",
      id: result2.insertId,
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

export default router;
