import "dotenv/config";

export const API_URL = process.env.API_URL ?? "http://localhost:8080";
export const FRONTEND_URL =
  process.env.FRONTEND_URL ?? "http://localhost:3000";
