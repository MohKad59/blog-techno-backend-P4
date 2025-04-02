const repository = require("../repository/produitRepository");

const obtenirTousProduits = async () => await repository.obtenirTousProduits();
const obtenirProduitParId = async (id) =>
	await repository.obtenirProduitParId(id);
const ajouterProduit = async (nom, description, prix, photo) =>
	await repository.ajouterProduit(nom, description, prix, photo);
const modifierProduit = async (id, nom, description, prix, photo) =>
	await repository.modifierProduit(id, nom, description, prix, photo);
const supprimerProduit = async (id) => await repository.supprimerProduit(id);

module.exports = {
	obtenirTousProduits,
	obtenirProduitParId,
	ajouterProduit,
	modifierProduit,
	supprimerProduit,
};
