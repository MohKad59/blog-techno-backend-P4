const repository = require("../repository/tutorielRepository");

const obtenirTousTutoriels = async () =>
	await repository.obtenirTousTutoriels();
const obtenirTutorielParId = async (id) =>
	await repository.obtenirTutorielParId(id);
const obtenirTutorielsParProduit = async (produitId) =>
	await repository.obtenirTutorielsParProduit(produitId);
const ajouterTutoriel = async (titre, contenu, produit_id) =>
	await repository.ajouterTutoriel(titre, contenu, produit_id);
const modifierTutoriel = async (id, titre, contenu, produit_id) =>
	await repository.modifierTutoriel(id, titre, contenu, produit_id);
const supprimerTutoriel = async (id) => await repository.supprimerTutoriel(id);

module.exports = {
	obtenirTousTutoriels,
	obtenirTutorielParId,
	obtenirTutorielsParProduit,
	ajouterTutoriel,
	modifierTutoriel,
	supprimerTutoriel,
};
