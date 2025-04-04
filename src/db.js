const mysql = require("mysql2/promise");
require("dotenv").config();

const pool = mysql.createPool({
	host: process.env.DB_HOST || "localhost",
	user: process.env.DB_USER || "root",
	password: process.env.DB_PASSWORD || "",
	database: process.env.DB_NAME || "blog_techno",
	waitForConnections: true,
	connectionLimit: 10,
	queueLimit: 0,
});

// Test de la connexion au démarrage
(async () => {
	try {
		const connection = await pool.getConnection();
		console.log("Connexion à la base de données réussie");
		connection.release();
	} catch (error) {
		console.error("Erreur de connexion à la base de données :", error);
	}
})();

module.exports = pool;
