import express from "express";
import microserviceRoutes from "./routes/microserviceRoutes";
import authRoutes from "./routes/microserviceRoutes"
import dotenv from "dotenv";
import cors from "cors";

dotenv.config();

const app = express();
app.use(cors());
const PORT = process.env.PORT || 5173;

app.use(express.json())
app.use('/api/services', microserviceRoutes)
app.use('/api/auth', authRoutes)

app.listen(PORT, () => {
    console.log(`Service API server running on http://localhost:${PORT}`);
})