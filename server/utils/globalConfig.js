



// mode = "local";
 // mode = "staging";
// mode = "prod";
 mode = "aws";
config = {};

if (mode === "staging") {
    config.user = "root",
        config.host = "localhost",
        config.password = "Welcome@1234",
        config.database = "clockify",
        config.multipleStatements = true,
        config.sceret_key = "clockify"
} else if (mode === "prod") {
    config.user = "root",
        config.host = "localhost",
        config.password = "admin123",
        config.database = "prod_ourly",
        config.multipleStatements = true,
        config.sceret_key = "clockify"
}
else if (mode === "local") {
    config.user = "root",
        config.host = "localhost",
        config.password = "",
        config.database = "clockify_v2",
        config.multipleStatements = true,
        config.sceret_key = "clockify"
}else if (mode === "aws") {
    config.user = "admin",
        config.host = "ourly.ctthlmqttiri.ap-south-1.rds.amazonaws.com",
        config.password = "admin123",
        config.database = "prod_ourly",
        config.multipleStatements = true,
        config.sceret_key = "clockify"
}


