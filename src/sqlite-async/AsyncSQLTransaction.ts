import { SQLResultSet, SQLStatementCallback, SQLStatementErrorCallback, WebSQLTransaction } from "websql";

export class AsyncSQLTransaction implements WebSQLTransaction {
  constructor(private tx: WebSQLTransaction, private log = false) {
  }
  /**
   * fowards to the existing method
   * @param sqlStatement
   * @param args
   * @param callback
   * @param errorCallback
   */
  executeSql(
    sqlStatement: string,
    args?: any[],
    callback?: SQLStatementCallback,
    errorCallback?: SQLStatementErrorCallback
  ): void {
    this.tx.executeSql(sqlStatement, args, callback, errorCallback);
  }
  /**
   * Executes an SQL statement as a promise
   * @param sqlStatement
   * @param args arguments
   * @returns result set promise
   */
  q(sqlStatement: string, ...args: any): Promise<SQLResultSet> {
    console.log(`> ${sqlStatement} ${JSON.stringify(args)}`);
    return new Promise((resolve, reject) => {
      this.executeSql(
        sqlStatement,
        args,
        (newTx: WebSQLTransaction, resultSet: any) => {
          resolve(resultSet);
          console.log(`<`, JSON.stringify(resultSet, null, 2));
        },
        (err: any) => {
          console.error(err);
          reject(err);
        }
      );
    });
  }
  /**
   * Executes an SQL statement as a promise
   * @param sqlStatement
   * @param args arguments
   * @returns result set promise
   */
  r(sqlStatement: string, ...args: any): Promise<SQLResultSet> {
    console.log(`> ${sqlStatement} ${JSON.stringify(args)}`);
    return new Promise((resolve, reject) => {
      this.executeSql(
        sqlStatement,
        args,
        (newTx: WebSQLTransaction, resultSet: any) => {
          resolve(resultSet);
          console.log(`<`, JSON.stringify(resultSet, null, 2));
        },
        (err: any) => {
          console.error(err);
          reject(err);
        }
      );
    });
  }
}
