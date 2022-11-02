
let mysql = require('mysql');


function Dbinitiate() {
    if (mode === 'local') {
        let i = 0
        var connLocal = mysql.createPool({
            multipleStatements: global.config.multipleStatements,
            host: global.config.host,
            user: global.config.user,
            password: global.config.password,
            database: global.config.database,
        });
    }

    this.executeQuery = function (flag, queryString, request) {
        return new Promise((resolve, reject) => {
            let conPool;
            switch (0) {

                case 0:
                    conPool = connLocal;
                    break;
                case 1:
                    conPool = connstaging;
                    break;
                case 3:
                    conPool = connprod;
                    break;
            }

            try {
                conPool.getConnection((err, conn) => {
                    if (err) {
                        console.log(err)
                    } else {
                        console.log(`db credentials has been fetched`);
                        console.log(`Successfully connected to database running on host ${global.config.host}`);
                        conn.query(queryString, function (err, rows, fields) {
                            if (!err) {
                                console.log(`dbcall - ${queryString}`);
                                conn.release();
                                resolve(rows[0])

                            } else {
                                console.log("error: err: ", err);
                                conn.release();
                                reject(err);
                            }
                        })
                    }
                })

            } catch (exception) {
                console.log("error", exception);
            }
        })

    }

}



module.exports = Dbinitiate






