import { Generated, Insertable, Selectable, Updateable } from "kysely";

export interface ProductTable {
    id: Generated<number>;
    name: string;
    desc: string | null;
    price: number;
    enabled: boolean;
}
export type ProductSelect = Selectable<ProductTable>;
export type ProductInsert = Insertable<ProductTable>;
export type ProductUpdate = Updateable<ProductTable>;