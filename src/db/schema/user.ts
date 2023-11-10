import { relations } from "drizzle-orm";
import { boolean, pgTable, serial, timestamp, varchar } from "drizzle-orm/pg-core";
import { UserProviderTable } from "./user_provider.js";
import { ProductReviewTable } from "./product_review.js";
import { createSelectSchema, createInsertSchema } from "drizzle-zod";

export const UserTable = pgTable('user', {
    id: serial('id').primaryKey(),
    username: varchar('username', { length: 30 }).notNull(),
    password: varchar('password', { length: 100 }),
    email: varchar('email', { length: 256 }),
    is_admin: boolean('is_admin').notNull(),
    created_at: timestamp('created_at').notNull().defaultNow()
});

export const UserSelectSchema = createSelectSchema(UserTable)
    .omit({
        password: true
    });
export type UserSelect = Zod.infer<typeof UserSelectSchema>;

export const UserInsertSchema = createInsertSchema(UserTable)
    .pick({
        username: true,
        password: true,
        email: true,
        is_admin: true
    });
export type UserInsert = Zod.infer<typeof UserInsertSchema>;

export const userRelations = relations(UserTable, ({ many }) => ({
    user_providers: many(UserProviderTable),
    product_reviews: many(ProductReviewTable)
}));