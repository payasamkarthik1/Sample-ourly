


mode = "local";
// mode = "staging";
// mode = "prod";
config = {};

if (mode === "local") {
    config.user = "root",
        config.host = "localhost",
        config.password = "",
        config.database = "clockify",
        config.multipleStatements = true,

        config.sceret_key = "clockify"
}
