import { relations } from "drizzle-orm";
import { pgTable, integer, varchar, doublePrecision } from "drizzle-orm/pg-core";
import { UserTable } from "./user.js";
import { ProductTable } from "./product.js";

export const ProductReviewTable = pgTable('product_review', {
    user_id: integer('user_id').primaryKey(),
    product_id: integer('product_id').primaryKey(),
    rating: doublePrecision('rating').notNull(),
    note: varchar('note', { length: 200 }).notNull()
});

export const productReviewRelations = relations(ProductReviewTable, ({ one }) => ({
    reviewer: one(UserTable, {
        fields: [ProductReviewTable.user_id],
        references: [UserTable.id],
    }),
    product: one(ProductTable, {
        fields: [ProductReviewTable.product_id],
        references: [ProductTable.id]
    })
}));