require("dotenv").config();
const { PrismaClient } = require("@prisma/client");
const { PrismaMariaDb } = require("@prisma/adapter-mariadb");


const adapter = new PrismaMariaDb({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_DBNAME,
  port: Number(process.env.DB_PORT),
  connectionLimit: 10,
  ssl: { rejectUnauthorized: true },
  connectTimeout: 60000,
});

const prisma = new PrismaClient({
  adapter,
  log:
    process.env.NODE_ENV === "development"
      ? ["error", "info", "query", "warn"]
      : ["error"],
});

module.exports = prisma;
