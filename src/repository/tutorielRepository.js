const mysql = require("mysql2/promise");
require("dotenv").config();

const db = mysql.createPool({
	host: process.env.DB_HOST,
	user: process.env.DB_USER,
	password: process.env.DB_PASSWORD,
	database: process.env.DB_NAME,
});

const obtenirTousTutoriels = async () => {
	const [rows] = await db.query(
		"SELECT t.id, t.titre, t.contenu, t.produit_id, p.nom AS produit_nom FROM Tutoriels t JOIN Produits p ON t.produit_id = p.id",
	);
	return rows;
};

const obtenirTutorielParId = async (id) => {
	const [rows] = await db.query(
		"SELECT t.id, t.titre, t.contenu, t.produit_id, p.nom AS produit_nom FROM Tutoriels t JOIN Produits p ON t.produit_id = p.id WHERE t.id = ?",
		[id],
	);
	return rows[0];
};

const obtenirTutorielsParProduit = async (produitId) => {
	const [rows] = await db.query(
		"SELECT * FROM Tutoriels WHERE produit_id = ?",
		[produitId],
	);
	return rows;
};

const ajouterTutoriel = async (titre, contenu, produit_id) => {
	const [result] = await db.query(
		"INSERT INTO Tutoriels (titre, contenu, produit_id) VALUES (?, ?, ?)",
		[titre, contenu, produit_id],
	);
	return { id: result.insertId, titre, contenu, produit_id };
};

const modifierTutoriel = async (id, titre, contenu, produit_id) => {
	await db.query(
		"UPDATE Tutoriels SET titre = ?, contenu = ?, produit_id = ? WHERE id = ?",
		[titre, contenu, produit_id, id],
	);
	return { id, titre, contenu, produit_id };
};

const supprimerTutoriel = async (id) => {
	await db.query("DELETE FROM Tutoriels WHERE id = ?", [id]);
	return { id };
};

module.exports = {
	obtenirTousTutoriels,
	obtenirTutorielParId,
	obtenirTutorielsParProduit,
	ajouterTutoriel,
	modifierTutoriel,
	supprimerTutoriel,
};
