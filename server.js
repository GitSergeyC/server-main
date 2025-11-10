import express from "express";
import cors from "cors";
import bodyParser from "body-parser";
import fetch from "node-fetch";
import dotenv from "dotenv";
import cors from "cors";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5050;
const TOKEN = process.env.BOT_TOKEN;
const CHAT_ID = process.env.CHAT_ID;

app.use(cors({
  origin: ["http://localhost:5174", "https://moving-v2.vercel.app/"], // адрес фронтенда
  methods: ["GET", "POST"],
  allowedHeaders: ["Content-Type"],
}));
app.use(bodyParser.json());

app.get("/", (req, res) => res.send("Сервер работает ✅"));

app.post("/send-message", async (req, res) => {
  const { name, phone, message } = req.body;
  console.log("Данные из формы:", req.body);

  const text = `
📩 Новая заявка с сайта:
👤 Имя: ${name}
📞 Телефон: ${phone}
💬 Сообщение: ${message || "—"}
`;

  try {
    const response = await fetch(`https://api.telegram.org/bot${TOKEN}/sendMessage`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ chat_id: CHAT_ID, text, parse_mode: "HTML" }),
    });

    const result = await response.json();
    console.log("Ответ Telegram:", result);

    if (!response.ok) throw new Error(result.description);

    res.json({ success: true, message: "Сообщение отправлено!" });
  } catch (error) {
    console.error("Ошибка при отправке:", error);
    res.status(500).json({ success: false, error: "Ошибка при отправке в Telegram" });
  }
});

app.listen(PORT, "0.0.0.0", () => {
  console.log(`✅ Сервер запущен на всех интерфейсах (порт ${PORT})`);
});
