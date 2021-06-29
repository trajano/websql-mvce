import openDatabase from "websql";
import { openDatabaseAsync } from "./sqlite-async";

const table = `foo${Math.floor(Math.random() * 100000)}`;
const sql1 = `create table if not exists ${table} ( id int primary key )`;
const sql2 = `insert into ${table} (id) values (${Math.floor(
  Math.random() * 1000000
)})`;
const sql3 = `select * from ${table}`;

const callbackHell = async () =>
  new Promise<void>((resolve, reject) => {
    const db = openDatabase("mydb.db", "1.0", "description", 1);
    db.transaction(
      (tx: any) => {
        tx.executeSql(
          sql1,
          [],
          (tx1: any, rs: any) => {
            tx1.executeSql(
              sql2,
              [],
              (tx2: any, rs: any) => {
                tx2.executeSql(
                  sql3,
                  [],
                  (tx3: any, rs: any) => {
                    console.log(rs.rows.item(0));
                  },
                  (err: any) => {
                    console.error("ERROR " + sql3, err);
                    reject(err);
                    return true;
                  }
                );
              },
              (err: any) => {
                console.error("ERROR " + sql2, err);
                reject(err);
                return true;
              }
            );
          },
          (err: any) => {
            console.error("ERROR " + sql1, err);
            reject(err);
            return true;
          }
        );
      },
      (err: any) => {
        console.error("ERROR", err);
        reject(err);
        return true;
      },
      () => {
        console.error("Success");
        resolve();
      }
    );
  });

const callbackHell2 = async () =>
  new Promise<void>((resolve, reject) => {
    openDatabaseAsync("mydb.db", "1.0").then((db) => {
      db.transaction(
        (tx: any) => {
          tx.executeSql(
            sql1,
            [],
            (tx1: any, rs: any) => {
              tx1.executeSql(
                sql2,
                [],
                (tx2: any, rs: any) => {
                  tx2.executeSql(
                    sql3,
                    [],
                    (tx3: any, rs: any) => {
                      console.log(rs.rows.item(0));
                    },
                    (err: any) => {
                      console.error("ERROR " + sql3, err);
                      reject(err);
                      return true;
                    }
                  );
                },
                (err: any) => {
                  console.error("ERROR " + sql2, err);
                  reject(err);
                  return true;
                }
              );
            },
            (err: any) => {
              console.error("ERROR " + sql1, err);
              reject(err);
              return true;
            }
          );
        },
        (err: any) => {
          console.error("ERROR", err);
          reject(err);
          return true;
        },
        () => {
          console.error("Success");
          resolve();
        }
      );
    });
  });

const asyncAwaitJustDb = async () => {
  const db = await openDatabaseAsync("mydb.db", "1.0");
  await new Promise<void>((resolve, reject) => {
    db.transaction(
      (tx: any) => {
        tx.executeSql(
          sql1,
          [],
          (tx1: any, rs: any) => {
            tx1.executeSql(
              sql2,
              [],
              (tx2: any, rs: any) => {
                tx2.executeSql(
                  sql3,
                  [],
                  (tx3: any, rs: any) => {
                    console.log(rs.rows.item(0));
                  },
                  (err: any) => {
                    console.error("ERROR " + sql3, err);
                    reject(err);
                    return true;
                  }
                );
              },
              (err: any) => {
                console.error("ERROR " + sql2, err);
                reject(err);
                return true;
              }
            );
          },
          (err: any) => {
            console.error("ERROR " + sql1, err);
            reject(err);
            return true;
          }
        );
      },
      (err: any) => {
        console.error("ERROR", err);
        reject(err);
        return true;
      },
      () => {
        console.error("Success");
        resolve();
      }
    );
  });
};

const asyncAwaitTransactionButNotExecute = async () => {
  const db = await openDatabaseAsync("mydb.db", "1.0");
  await db.txn(async (tx) => {
    await new Promise<void>((resolve, reject) => {
      tx.executeSql(
        sql1,
        [],
        (tx1: any, rs: any) => {
          tx1.executeSql(
            sql2,
            [],
            (tx2: any, rs: any) => {
              tx2.executeSql(
                sql3,
                [],
                (tx3: any, rs: any) => {
                  console.log(rs.rows.item(0));
                  resolve(rs);
                },
                (err: any) => {
                  console.error("ERROR " + sql3, err);
                  reject(err);
                  return true;
                }
              );
            },
            (err: any) => {
              console.error("ERROR " + sql2, err);
              reject(err);
              return true;
            }
          );
        },
        (err: any) => {
          console.error("ERROR " + sql1, err);
          reject(err);
          return true;
        }
      );
    });
  });
};

const asyncAwait = async () => {
  const db = await openDatabaseAsync("mydb.db", "1.0");
  await db.txn(async (tx) => {
    await tx.q(sql1);
    await tx.q(sql2);
    const rs = await tx.r(sql3);
    console.log("rs", rs);
  });
};

setTimeout(asyncAwait, 0);
