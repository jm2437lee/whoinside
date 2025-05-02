// /lib/schema.ts

import { mysqlTable, bigint, varchar, timestamp } from "drizzle-orm/mysql-core";

// users 테이블
export const users = mysqlTable("users", {
  id: bigint("id", { mode: "bigint" }).primaryKey().autoincrement(),
  uuid: varchar("uuid", { length: 255 }).notNull().unique(),
  nickname: varchar("nickname", { length: 100 }).notNull(),
  type: varchar("type", { length: 3 }).notNull(),
  email: varchar("email", { length: 255 }),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// relations 테이블
export const relations = mysqlTable("relations", {
  id: bigint("id", { mode: "bigint" }).primaryKey().autoincrement(),
  fromUuid: varchar("from_uuid", { length: 255 }).notNull(),
  toUuid: varchar("to_uuid", { length: 255 }).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});
