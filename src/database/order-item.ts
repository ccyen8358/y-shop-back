import { Insertable, Selectable, Updateable } from "kysely";

export interface OrderItemTable {
    order_id: number;
    product_id: number;
    delivered: boolean;
    price: number;
    amount: number;
    total: number;
}
export type OrderItemSelect = Selectable<OrderItemTable>;
export type OrderItemInsert = Insertable<OrderItemTable>;
export type OrderItemUpdate = Updateable<OrderItemTable>;