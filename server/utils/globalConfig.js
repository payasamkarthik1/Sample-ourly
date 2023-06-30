
require('dotenv').config()

//mode = "local";
mode = "staging";
// mode = "prod";
//mode = "aws";
//mode="dr"
config = {};

if (mode === "staging") {
    config.user = process.env.staging_user,
    config.host = process.env.staging_host,
    config.password = process.env.staging_password,
    config.database = process.env.staging_database,
    config.multipleStatements = process.env.staging_multipleStatements,
    config.sceret_key = process.env.staging_sceret_key
} else if (mode === "prod") {
    config.user = process.env.prod_user,
    config.host = process.env.prod_host,
    config.password = process.env.prod_password,
    config.database = process.env.prod_database,
    config.multipleStatements = process.env.prod_multipleStatements,
    config.sceret_key = process.env.prod_sceret_key
} else if (mode === "local") {
    config.user = process.env.local_user;
    config.host = process.env.local_host;
    config.password = process.env.local_password;
    config.database = process.env.local_database;
    config.multipleStatements = process.env.local_multipleStatements;
    config.secret_key = process.env.local_secret_key;
} else if (mode === "aws") {
    config.user = process.env.aws_user;
    config.host = process.env.aws_host;
    config.password = process.env.aws_password;
    config.database = process.env.aws_database;
    config.multipleStatements = process.env.aws_multipleStatements;
    config.secret_key = process.env.aws_secret_key;
} else if (mode === "dr") {
    config.user = process.env.dr_user;
    config.host = process.env.dr_host;
    config.password = process.env.dr_password;
    config.database = process.env.dr_database;
    config.multipleStatements = process.env.dr_multipleStatements;
    config.secret_key = process.env.dr_secret_key;
}


