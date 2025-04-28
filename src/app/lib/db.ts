// /lib/db.ts

import { createPool } from "mysql2/promise";
import { drizzle } from "drizzle-orm/mysql2";
import * as schema from "@/app/lib/schema";

// DB 연결 풀 생성
const pool = createPool({
  host: process.env.DB_HOST, // .env에 정의
  port: Number(process.env.DB_PORT) || 3306,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_DATABASE,
});

// drizzle ORM 인스턴스 생성
export const db = drizzle(pool, { schema, mode: "default" });
