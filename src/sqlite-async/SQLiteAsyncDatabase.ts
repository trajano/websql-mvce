import {
  SQLResultSet,
  SQLResultSetRowList,
  SQLTransactionCallback,
  SQLTransactionErrorCallback,
  SQLVoidCallback,
  WebSQLTransaction,
} from "websql";
import { AsyncSQLTransaction } from "./AsyncSQLTransaction";

type AsyncTransactionCallback<T> = (tx: AsyncSQLTransaction) => Promise<T>;

export class SQLiteAsyncDatabase {
  version: string;

  constructor(private db: any, private log = false) {
    this.version = db.version;
  }
  /**
   * Forwards to existing database
   * @param callback
   * @param errorCallback
   * @param successCallback
   */
  transaction(
    callback: SQLTransactionCallback,
    errorCallback?: SQLTransactionErrorCallback,
    successCallback?: SQLVoidCallback
  ): void {
    this.db.transaction(callback, errorCallback, successCallback);
  }
  /**
   * Forwards to existing database
   * @param callback
   * @param errorCallback
   * @param successCallback
   */
  readTransaction(
    callback: SQLTransactionCallback,
    errorCallback?: SQLTransactionErrorCallback,
    successCallback?: SQLVoidCallback
  ): void {
    this.db.readTransaction(callback, errorCallback, successCallback);
  }
  /**
   * Creates a transaction and executes a callback passing in the transaction wrapped with an async API
   * @param callback callback function that would get a transaction that provides async capability.  The return value of the callback will be the return value of this method.
   */
  async txn<T>(callback: AsyncTransactionCallback<T>): Promise<T> {
    return new Promise((resolve, reject) => {
      this.db.transaction(
        (tx: WebSQLTransaction) => {
          callback(new AsyncSQLTransaction(tx, this.log))
            .then(resolve)
            .catch(reject);
        },
        (error: any) => reject(error)
      );
    });
  }
  /**
   * Creates a read-only transaction and executes a callback passing in the transaction wrapped with an async API
   * @param callback callback function that would get a transaction that provides async capability.  The return value of the callback will be the return value of this method.
   */
  async rtxn<T>(callback: AsyncTransactionCallback<T>): Promise<T> {
    return new Promise((resolve, reject) => {
      this.db.readTransaction(
        (tx: WebSQLTransaction) => {
          callback(new AsyncSQLTransaction(tx, this.log))
            .then(resolve)
            .catch(reject);
        },
        (error: any) => reject(error)
      );
    });
  }

  /**
   * Executes a single SQL statement and returns the result set.  The statement does not need to be read-only.
   * @param sqlStatement
   * @param args arguments
   * @returns result set promise
   */
  async e(sqlStatement: string, ...args: any): Promise<SQLResultSet> {
    return new Promise((resolve, reject) => {
      this.db.transaction(
        (tx: WebSQLTransaction) => {
          new AsyncSQLTransaction(tx, this.log)
            .q(sqlStatement, ...args)
            .then(resolve)
            .catch(reject);
        },
        (error: any) => reject(error)
      );
    });
  }

  /**
   * Executes an read only SQL statement and returns the result set.
   * @param sqlStatement
   * @param args arguments
   * @returns result set promise
   */
  async q(sqlStatement: string, ...args: any): Promise<SQLResultSetRowList> {
    return new Promise((resolve, reject) => {
      this.db.readTransaction(
        (tx: WebSQLTransaction) => {
          new AsyncSQLTransaction(tx, this.log)
            .q(sqlStatement, ...args)
            .then((resultSet) => resolve(resultSet.rows))
            .catch(reject);
        },
        (error: any) => reject(error)
      );
    });
  }
}
