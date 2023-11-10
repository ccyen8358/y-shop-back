import { relations } from "drizzle-orm";
import { integer, pgTable, serial, varchar } from "drizzle-orm/pg-core";
import { UserTable } from "./user.js";

export const UserProviderTable = pgTable('user_provider', {
    id: serial('id').primaryKey(),
    user_id: integer('user_id').notNull(),
    provider: varchar('provider', { length: 50, enum: ["github", "google"] }).notNull(),
    provider_uid: varchar('provider_uid', { length: 255 }).notNull(),
});

export const userProviderRelations = relations(UserProviderTable, ({ one }) => ({
    user: one(UserTable, {
        fields: [UserProviderTable.user_id],
        references: [UserTable.id],
    }),
}));