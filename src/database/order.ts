import { ColumnType, Generated, Insertable, Selectable, Updateable } from "kysely";

export interface OrderTable {
    id: Generated<number>;
    long_id: ColumnType<string, never, never>;
    user_id: number;
    created_at: ColumnType<Date, never, never>;
}
export type OrderSelect = Selectable<OrderTable>;
export type OrderInsert = Insertable<OrderTable>;
export type OrderUpdate = Updateable<OrderTable>;