import connectDB from "./db";
import dotenv from "dotenv";
import { app } from "./app";

dotenv.config({ path: "./.env"});

await connectDB();

export default app;