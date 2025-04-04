const db = require("../db");

const obtenirTousProduits = async () => {
	const [rows] = await db.query("SELECT * FROM Produits");
	return rows;
};

const ajouterProduit = async (nom, description, prix, photo) => {
	const [result] = await db.query(
		"INSERT INTO Produits (nom, description, prix, photo) VALUES (?, ?, ?, ?)",
		[nom, description, prix, photo],
	);
	return { id: result.insertId, nom, description, prix, photo };
};

const modifierProduit = async (id, nom, description, prix, photo) => {
	console.log(`Modification Produit ID=${id} avec :`, {
		nom,
		description,
		prix,
		photo,
	});
	await db.query(
		"UPDATE Produits SET nom = ?, description = ?, prix = ?, photo = ? WHERE id = ?",
		[nom, description, prix, photo, id],
	);
	return { id, nom, description, prix, photo };
};

const supprimerProduit = async (id) => {
	console.log(`Suppression Produit ID=${id}`);
	await db.query("DELETE FROM Produits WHERE id = ?", [id]);
	console.log(`Produit ID=${id} supprimé avec succès`);
};

const obtenirTousTutoriels = async () => {
	const [rows] = await db.query(`
    SELECT
      Tutoriels.*,
      Produits.nom AS produit_nom,
      Produits.photo AS produit_photo 
    FROM Tutoriels
    JOIN Produits ON Tutoriels.produit_id = Produits.id
  `);
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
	const [updatedRows] = await db.query("SELECT * FROM Tutoriels WHERE id = ?", [id]);
	return updatedRows[0];
};

const supprimerTutoriel = async (id) => {
	await db.query("DELETE FROM Tutoriels WHERE id = ?", [id]);
	return { message: "Tutoriel supprimé" };
};

module.exports = {
	obtenirTousProduits,
	ajouterProduit,
	modifierProduit,
	supprimerProduit,
	obtenirTousTutoriels,
	ajouterTutoriel,
	modifierTutoriel,
	supprimerTutoriel,
};
