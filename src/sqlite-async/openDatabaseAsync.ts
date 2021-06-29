// import * as SQLite from 'expo-sqlite';
import openDatabase, { WebSQLDatabase } from "websql";
import { SQLiteAsyncDatabase } from "./SQLiteAsyncDatabase";

/**
 *
 * @param name filename for the database
 * @param version version (ignored by the engine)
 * @returns database
 */
export async function openDatabaseAsync(
  name: string,
  version?: string
): Promise<SQLiteAsyncDatabase> {
  return new Promise((resolve) => {
    openDatabase(name, version, "", 0, (db: WebSQLDatabase) => {
      resolve(new SQLiteAsyncDatabase(db));
    });
  });
}
