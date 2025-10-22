import express from "express";

const app = express();
const PORT = 3001;

app.get("/", (req, res) => {
  res.send("✅ Servidor debug funcionando!");
});

app.listen(PORT, "0.0.0.0", () => {
  console.log(`✅ Debug server rodando em http://localhost:${PORT}`);
});