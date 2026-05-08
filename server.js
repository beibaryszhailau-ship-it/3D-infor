import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import OpenAI from "openai";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;
const MODEL = process.env.OPENAI_MODEL || "gpt-4o-mini";

app.use(cors());
app.use(express.json());

if (!process.env.OPENAI_API_KEY) {
  console.warn("WARNING: OPENAI_API_KEY is not set. Create a .env file from .env.example.");
}

const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

app.get("/", (req, res) => {
  res.send("3D Oqulyq AI server is running. Use POST /ask");
});

app.post("/ask", async (req, res) => {
  try {
    const message = (req.body?.message || "").trim();

    if (!message) {
      return res.status(400).json({ answer: "Сұрақ бос болмауы керек." });
    }

    const completion = await client.chat.completions.create({
      model: MODEL,
      messages: [
        {
          role: "system",
          content: `Сен 6-сынып оқушыларына арналған «3D Баспа» электрондық оқулығының AI ассистентісің. Қазақ тілінде қысқа, түсінікті жауап бер. Негізгі тақырыптар: 3D баспа, 3D модельдеу, SketchUp, 3D принтер, модель құру, теория, тест, практика. Егер сұрақ тақырыпқа қатысы болмаса, 3D баспа немесе SketchUp бойынша сұрақ қоюды ұсын.`,
        },
        { role: "user", content: message },
      ],
      temperature: 0.4,
      max_tokens: 500,
    });

    const answer = completion.choices?.[0]?.message?.content || "Жауап алу мүмкін болмады.";
    res.json({ answer });
  } catch (error) {
    console.error("AI error:", error);
    res.status(500).json({
      answer: "AI серверде қате шықты. .env ішіндегі API кілтті және интернет қосылымын тексер.",
    });
  }
});

app.listen(PORT, () => {
  console.log(`AI assistant server running on http://localhost:${PORT}`);
});
