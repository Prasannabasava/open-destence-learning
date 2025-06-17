const { Pool, Client } = require("pg");
const dotenv = require("dotenv");
dotenv.config({ path: "config.env" });

const DATABASE = process.env.DB_NAME;
const HOST = process.env.DB_HOST;
const DBUSER = process.env.DB_USER;
const PASSWORD = process.env.DB_PASSWORD;
const dialectType = process.env.MDDIALECT;
const PORT = process.env.DB_PORT;

const client = new Pool({
	user: DBUSER,
	host: HOST,
	database: DATABASE,
	password: PASSWORD,
	port: PORT,
});

client.connect(function (err, data) {
	if (err) {
		console.trace(err);
	} else {
		console.log("Master Database connected successfully");
	}
})

module.exports = client;
