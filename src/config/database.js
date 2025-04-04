const mysql = require("mysql2/promise");
require("dotenv").config();

const pool = mysql.createPool({
	host: process.env.DB_HOST || "localhost",
	user: process.env.DB_USER || "root",
	password: process.env.DB_PASSWORD || "K@ddour7559",
	database: process.env.DB_NAME || "blog_techno",
});

pool
	.getConnection()
	.then(() => console.log("Connexion à la base de données réussie"))
	.catch((err) =>
		console.error("Erreur de connexion à la base de données :", err),
	);

module.exports = pool;
