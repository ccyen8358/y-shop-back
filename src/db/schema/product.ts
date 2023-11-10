import { relations } from "drizzle-orm";
import { boolean, numeric, pgTable, serial, varchar } from "drizzle-orm/pg-core";
import { ProductReviewTable } from "./product_review.js";

export const ProductTable = pgTable('product', {
    id: serial('id').primaryKey(),
    name: varchar('name', { length: 100 }).notNull(),
    desc: varchar('desc', { length: 100 }),
    price: numeric('price', { precision: 12, scale: 2 }).notNull(),
    is_enabled: boolean('is_enabled').notNull(),
    category_id: varchar('category_id', { length: 30, enum: ["others"] }).notNull()
});

export const productRelations = relations(ProductTable, ({ many }) => ({
    product_reviews: many(ProductReviewTable),
}));