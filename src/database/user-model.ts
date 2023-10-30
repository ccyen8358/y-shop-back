import { ColumnType, Generated, Insertable, Selectable, Updateable } from "kysely";

type AuthProvider = 'local' | 'github' | 'google';

export interface UserTable {
    id: Generated<number>;
    email: string;
    password: ColumnType<never, string, never>;
    name: string;
    isAdmin: boolean;
    provider: ColumnType<AuthProvider, AuthProvider, never>;
    created_at: ColumnType<Date, never, never>;
}
export type UserSelect = Selectable<UserTable>;
export type UserInsert = Insertable<UserTable>;
export type UserUpdate = Updateable<UserTable>;