const mysql = require("mysql2/promise");
require("dotenv").config();

const db = mysql.createPool({
	host: process.env.DB_HOST,
	user: process.env.DB_USER,
	password: process.env.DB_PASSWORD,
	database: process.env.DB_NAME,
});

const obtenirTousComparatifs = async () => {
	const [rows] = await db.query(
		"SELECT c.id, c.titre, c.contenu, p1.nom AS produit1_nom, p2.nom AS produit2_nom, c.produit1_id, c.produit2_id FROM Comparatifs c JOIN Produits p1 ON c.produit1_id = p1.id JOIN Produits p2 ON c.produit2_id = p2.id",
	);
	return rows;
};

const obtenirComparatifParId = async (id) => {
	const [rows] = await db.query(
		"SELECT c.id, c.titre, c.contenu, p1.nom AS produit1_nom, p2.nom AS produit2_nom, c.produit1_id, c.produit2_id FROM Comparatifs c JOIN Produits p1 ON c.produit1_id = p1.id JOIN Produits p2 ON c.produit2_id = p2.id WHERE c.id = ?",
		[id],
	);
	return rows[0];
};

const ajouterComparatif = async (titre, contenu, produit1_id, produit2_id) => {
	const [result] = await db.query(
		"INSERT INTO Comparatifs (titre, contenu, produit1_id, produit2_id) VALUES (?, ?, ?, ?)",
		[titre, contenu, produit1_id, produit2_id],
	);
	return { id: result.insertId, titre, contenu, produit1_id, produit2_id };
};

const modifierComparatif = async (
	id,
	titre,
	contenu,
	produit1_id,
	produit2_id,
) => {
	await db.query(
		"UPDATE Comparatifs SET titre = ?, contenu = ?, produit1_id = ?, produit2_id = ? WHERE id = ?",
		[titre, contenu, produit1_id, produit2_id, id],
	);
	return { id, titre, contenu, produit1_id, produit2_id };
};

const supprimerComparatif = async (id) => {
	await db.query("DELETE FROM Comparatifs WHERE id = ?", [id]);
	return { id };
};

module.exports = {
	obtenirTousComparatifs,
	obtenirComparatifParId,
	ajouterComparatif,
	modifierComparatif,
	supprimerComparatif,
};
