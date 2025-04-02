const mysql = require("mysql2/promise");
require("dotenv").config();

const db = mysql.createPool({
	host: process.env.DB_HOST,
	user: process.env.DB_USER,
	password: process.env.DB_PASSWORD,
	database: process.env.DB_NAME,
});

const obtenirTousProduits = async () => {
	const [rows] = await db.query("SELECT * FROM Produits");
	return rows;
};

const obtenirProduitParId = async (id) => {
	const [rows] = await db.query("SELECT * FROM Produits WHERE id = ?", [id]);
	return rows[0];
};

const ajouterProduit = async (nom, description, prix, photo) => {
	const [result] = await db.query(
		"INSERT INTO Produits (nom, description, prix, photo) VALUES (?, ?, ?, ?)",
		[nom, description, prix, photo],
	);
	return { id: result.insertId, nom, description, prix, photo };
};

const modifierProduit = async (id, nom, description, prix, photo) => {
	await db.query(
		"UPDATE Produits SET nom = ?, description = ?, prix = ?, photo = ? WHERE id = ?",
		[nom, description, prix, photo, id],
	);
	return { id, nom, description, prix, photo };
};

const supprimerProduit = async (id) => {
	await db.query("DELETE FROM Produits WHERE id = ?", [id]);
	return { id };
};

module.exports = {
	obtenirTousProduits,
	obtenirProduitParId,
	ajouterProduit,
	modifierProduit,
	supprimerProduit,
};
