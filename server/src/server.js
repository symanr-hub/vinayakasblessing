import app from "./app.js";

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`🌾 AgroAI Agricultural Advisory Backend running on port ${PORT}`);
  console.log(`📡 Base API endpoint: http://localhost:${PORT}/api/v1`);
  console.log(`🩺 Health check: http://localhost:${PORT}/health`);
});

