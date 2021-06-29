import openDatabase from "websql";
const db = openDatabase("mydb.db", "1.0", "description", 1);

const table = `foo${Math.floor(Math.random() * 100000)}`;
const sql1 = `create table if not exists ${table} ( id int primary key )`;
const sql2 = `insert into ${table} (id) values (${Math.floor(
  Math.random() * 1000000
)})`;
const sql3 = `select * from ${table}`;

const p = async () =>
  new Promise<void>((resolve, reject) => {
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
      (txObj: any) => {
        console.error("Success");
        resolve();
      }
    );
  });

setTimeout(p, 0);
