


//
// mode = "local";
mode = "staging";
// mode = "prod";
config = {};

if (mode === "staging") {
    config.user = "root",
        config.host = "localhost",
        config.password = "Welcome@1234!",
        config.database = "clockify",
        config.multipleStatements = true,
        config.sceret_key = "clockify"
} else if (mode === "prod") {
    config.user = "root",
        config.host = "localhost",
        config.password = "Welcome@1234!",
        config.database = "clockify_prod",
        config.multipleStatements = true,
        config.sceret_key = "clockify"
}
else if (mode === "local") {
    config.user = "root",
        config.host = "localhost",
        config.password = "",
        config.database = "clockify",
        config.multipleStatements = true,
        config.sceret_key = "clockify"
}

