
let mysql = require('mysql');


function Dbinitiate() {
    if (mode === 'staging') {
        i = 0
        var connStag = mysql.createPool({
            multipleStatements: global.config.multipleStatements,
            host: global.config.host,
            user: global.config.user,
            password: global.config.password,
            database: global.config.database,
        });
    } else if (mode === 'prod') {
        i = 1
        var connProd = mysql.createPool({
            multipleStatements: global.config.multipleStatements,
            host: global.config.host,
            user: global.config.user,
            password: global.config.password,
            database: global.config.database,
        });
    }
    else if (mode === 'local') {
        i = 2
        var connLocal = mysql.createPool({
            multipleStatements: global.config.multipleStatements,
            host: global.config.host,
            user: global.config.user,
            password: global.config.password,
            database: global.config.database,
        });
    }
    else if (mode === 'aws') {
        i = 3
        var connAws = mysql.createPool({
            multipleStatements: global.config.multipleStatements,
            host: global.config.host,
            user: global.config.user,
            password: global.config.password,
            database: global.config.database,
        });
    }else if (mode === 'dr') {
        i = 4
        var connDr = mysql.createPool({
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
            console.log(i);
            switch (i) {
                case 0:
                    conPool = connStag;
                    break;
                case 1:
                    conPool = connProd;
                    break;
                case 2:
                    conPool = connLocal;
                    break;
                case 3:
                    conPool = connAws;
                    break;
                case 4:
                    conPool = connDr;
                    break;
            }

            try {
                conPool.getConnection((err, conn) => {
                    if (err) {
                        console.log(err)
                    } else {
                        // console.log(`db credentials has been fetched`);
                        // console.log(`Successfully connected to database running on host ${global.config.host}`);
                        conn.query(queryString, function (err, rows, fields) {
                            if (!err) {
                                //  console.log(`dbcall - ${queryString}`);
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






