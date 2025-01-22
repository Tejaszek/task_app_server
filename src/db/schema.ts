import { pgTable, uuid, text, timestamp } from "drizzle-orm/pg-core"

 export const users = pgTable("users", {
    id: uuid("id").primaryKey().defaultRandom(),
    name: text("name").notNull(),
    email: text("email").notNull().unique(),
    password: text("password").notNull(),
    created_at: timestamp("created_at").defaultNow(),
    updated_at: timestamp("updated_at").defaultNow(),



})

export type user = typeof users.$inferSelect;
export type NewUser = typeof users.$inferInsert;