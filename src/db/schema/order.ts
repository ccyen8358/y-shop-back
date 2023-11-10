import { relations } from "drizzle-orm";
import { serial, pgTable, integer, timestamp, varchar } from "drizzle-orm/pg-core";
import { UserTable } from "./user.js";
import { OrderItemTable } from "./order_item.js";

export const OrderTable = pgTable('order', {
    id: serial('id').primaryKey(),
    user_id: integer('user_id').notNull(),
    created_at: timestamp('created_at').notNull(),
    long_id: varchar('long_id', { length: 30 }).notNull()
});

export const orderRelations = relations(OrderTable, ({ many, one }) => ({
    order_items: many(OrderItemTable),
    orderer: one(UserTable, {
        fields: [OrderTable.user_id],
        references: [UserTable.id],
    }),
}));