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

module.exports = {
	obtenirTousProduits,
	ajouterProduit,
	modifierProduit,
	supprimerProduit,
};
