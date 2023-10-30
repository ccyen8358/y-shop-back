import { Kysely, PostgresDialect, ExpressionBuilder } from 'kysely';
import pkg from 'pg';
import { OrderItemTable } from './order-item.js';
import { OrderTable } from './order.js';
import { ProductReviewTable } from './product-review.js';
import { ProductTable } from './product.js';
import { UserTable } from './user-model.js';

export interface Database {
    order: OrderTable;
    order_item: OrderItemTable;
    product: ProductTable;
    product_review: ProductReviewTable;
    user: UserTable;
}

const dialect = new PostgresDialect({
    pool: new pkg.Pool({
        database: process.env.PG_DATABASE,
        host: process.env.PG_HOST,
        user: process.env.PG_USER,
        password: process.env.PG_PASSWORD,
        port: Number(process.env.PG_PORT) || 5432,
        max: 10,
        ssl: true
    })
})

const db = new Kysely<Database>({
    dialect,
})

export default db;