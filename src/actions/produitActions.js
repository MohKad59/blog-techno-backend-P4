const produitRepository = require("../repository/produitRepository");
const db = require("../db"); // Ajout

const obtenirTousProduits = async () => {
	return await produitRepository.obtenirTousProduits();
};

const ajouterProduit = async (nom, description, prix, photo) => {
	return await produitRepository.ajouterProduit(nom, description, prix, photo);
};

const modifierProduit = async (id, nom, description, prix, photo) => {
	return await produitRepository.modifierProduit(
		id,
		nom,
		description,
		prix,
		photo,
	);
};

const supprimerProduit = async (id) => {
	console.log(`produitActions.supprimerProduit appelé pour ID : ${id}`);
	try {
		// Supprimer les avis liés
		await db.query("DELETE FROM Avis WHERE produit_id = ?", [id]);
		console.log(`Avis liés au produit ID=${id} supprimés`);
		// Supprimer les comparatifs liés (produit1_id ou produit2_id)
		await db.query(
			"DELETE FROM Comparatifs WHERE produit1_id = ? OR produit2_id = ?",
			[id, id],
		);
		console.log(`Comparatifs liés au produit ID=${id} supprimés`);
		// Supprimer les tutoriels liés
		await db.query("DELETE FROM Tutoriels WHERE produit_id = ?", [id]);
		console.log(`Tutoriels liés au produit ID=${id} supprimés`);
		// Supprimer le produit
		await produitRepository.supprimerProduit(id);
		console.log(`Produit ID=${id} supprimé avec succès`);
	} catch (error) {
		console.error("Erreur dans supprimerProduit :", error);
		throw error; // Relance l’erreur pour que la route la capture
	}
};

module.exports = {
	obtenirTousProduits,
	ajouterProduit,
	modifierProduit,
	supprimerProduit,
};
