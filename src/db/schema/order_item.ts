import { relations } from "drizzle-orm";
import { serial, pgTable, integer, timestamp, varchar, boolean, numeric, doublePrecision } from "drizzle-orm/pg-core";
import { OrderTable } from "./order.js";

export const OrderItemTable = pgTable('order_item', {
    id: serial('id').primaryKey(),
    order_id: integer('order_id').notNull(),
    product_id: integer('product_id').notNull(),
    is_delivered: boolean('is_delivered').notNull(),
    price: numeric('price', { precision: 12, scale: 2 }).notNull(),
    amount: integer('amount').notNull(),
    total: numeric('total', { precision: 12, scale: 2 }).notNull()
});

export const orderItemRelations = relations(OrderItemTable, ({ one }) => ({
    orderer: one(OrderTable, {
        fields: [OrderItemTable.order_id],
        references: [OrderTable.id],
    }),
}));