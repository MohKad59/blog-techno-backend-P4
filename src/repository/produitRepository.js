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

	let query = "UPDATE Produits SET nom = ?, description = ?, prix = ?";
	const params = [nom, description, prix];

	if (photo !== undefined) {
		query += ", photo = ?";
		params.push(photo);
	}

	query += " WHERE id = ?";
	params.push(id);

	console.log("Requête UPDATE :", query);
	console.log("Paramètres UPDATE :", params);

	await db.query(query, params);

	const [updatedRows] = await db.query("SELECT * FROM Produits WHERE id = ?", [id]);
	return updatedRows[0];
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
