
import postgres from 'postgres';
import { drizzle } from 'drizzle-orm/postgres-js';
import { UserTable, userRelations } from './schema/user.js';
import { UserProviderTable, userProviderRelations } from './schema/user_provider.js';


const db_url = process.env.NEON_DB_URL || '';
if (!db_url) {
    throw Error("Database url cannot be null");
}
const client = postgres(db_url, { ssl: 'require' });
export const db = drizzle(client, {
    schema: {
        UserTable,
        userRelations,
        UserProviderTable,
        userProviderRelations
    }
});

// const { password, ...rest } = getTableColumns(UserTable);