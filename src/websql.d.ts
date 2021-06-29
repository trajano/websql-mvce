// @types/websql does not appear to work correctly
declare module "websql" {
  declare class WebSQLTransaction {
    executeSql(
      sqlStatement: string,
      args?: any[],
      callback?: SQLStatementCallback,
      errorCallback?: SQLStatementErrorCallback
    );
  }
  declare class SQLStatementCallback {}
  declare class SQLStatementErrorCallback {}
  declare class SQLResultSetRowList {
    item(i: index): Object;
  }
  declare class SQLResultSet {
    rows: SQLResultSetRowList;
  }
  export type SQLTransactionCallback = (tx: WebSQLTransaction) => void;
  export type SQLTransactionErrorCallback = (err: any) => void;
  export type SQLVoidCallback = () => void;

  export type SQLTransactionCallback = (
    tx: WebSQLTransaction,
    rs: SQLResultSet
  ) => void;

  declare class WebSQLDatabase {
    transaction(
      callback: SQLite.SQLTransactionCallback,
      errorCallback?: SQLite.SQLTransactionErrorCallback,
      successCallback?: SQLite.SQLVoidCallback
    );
    readTransaction(
      callback: SQLite.SQLTransactionCallback,
      errorCallback?: SQLite.SQLTransactionErrorCallback,
      successCallback?: SQLite.SQLVoidCallback
    );
  }

  export default function openDatabase(
    name: string,
    version?: string,
    description?: string,
    size?: number,
    callback?: (db: WebSQLDatabase) => void
  ): WebSQLDatabase;
}
