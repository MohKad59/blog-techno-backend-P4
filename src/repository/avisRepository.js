const mysql = require("mysql2/promise");
require("dotenv").config();

const db = mysql.createPool({
	host: process.env.DB_HOST,
	user: process.env.DB_USER,
	password: process.env.DB_PASSWORD,
	database: process.env.DB_NAME,
});

const obtenirTousAvis = async () => {
	const [rows] = await db.query(`
    SELECT
      Avis.*,
      Produits.nom AS produit_nom,
      Produits.photo AS produit_photo 
    FROM Avis
    JOIN Produits ON Avis.produit_id = Produits.id
  `);
	return rows;
};

const obtenirAvisParId = async (id) => {
	const [rows] = await db.query(
		`SELECT 
      Avis.*, 
      Produits.nom AS produit_nom, 
      Produits.photo AS produit_photo 
     FROM Avis 
     JOIN Produits ON Avis.produit_id = Produits.id 
     WHERE Avis.id = ?`,
		[id],
	);
	return rows[0];
};

const obtenirAvisParProduit = async (produitId) => {
	const [rows] = await db.query(
		`SELECT 
      Avis.*, 
      Produits.nom AS produit_nom, 
      Produits.photo AS produit_photo 
     FROM Avis 
     JOIN Produits ON Avis.produit_id = Produits.id 
     WHERE Avis.produit_id = ?`,
		[produitId],
	);
	return rows;
};

const ajouterAvis = async (contenu, note, produit_id) => {
	const [result] = await db.query(
		"INSERT INTO Avis (contenu, note, produit_id) VALUES (?, ?, ?)",
		[contenu, note, produit_id],
	);
	return { id: result.insertId, contenu, note, produit_id };
};

const modifierAvis = async (id, contenu, note) => {
	await db.query("UPDATE Avis SET contenu = ?, note = ? WHERE id = ?", [
		contenu,
		note,
		id,
	]);
	return { id, contenu, note };
};

const supprimerAvis = async (id) => {
	await db.query("DELETE FROM Avis WHERE id = ?", [id]);
	return { id };
};

module.exports = {
	obtenirTousAvis,
	obtenirAvisParId,
	obtenirAvisParProduit,
	ajouterAvis,
	modifierAvis,
	supprimerAvis,
};
