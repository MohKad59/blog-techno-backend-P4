const repository = require("../repository/comparatifRepository");

const obtenirTousComparatifs = async () =>
	await repository.obtenirTousComparatifs();
const obtenirComparatifParId = async (id) =>
	await repository.obtenirComparatifParId(id);
const ajouterComparatif = async (titre, contenu, produit1_id, produit2_id) =>
	await repository.ajouterComparatif(titre, contenu, produit1_id, produit2_id);
const modifierComparatif = async (
	id,
	titre,
	contenu,
	produit1_id,
	produit2_id,
) =>
	await repository.modifierComparatif(
		id,
		titre,
		contenu,
		produit1_id,
		produit2_id,
	);
const supprimerComparatif = async (id) =>
	await repository.supprimerComparatif(id);

module.exports = {
	obtenirTousComparatifs,
	obtenirComparatifParId,
	ajouterComparatif,
	modifierComparatif,
	supprimerComparatif,
};
