import { Insertable, Selectable, Updateable } from "kysely";

export interface ProductReviewTable {
    user_id: number;
    product_id: number;
    rating: number;
    note: string;
}
export type ProductReviewSelect = Selectable<ProductReviewTable>;
export type ProductReviewInsert = Insertable<ProductReviewTable>;
export type ProductReviewUpdate = Updateable<ProductReviewTable>;