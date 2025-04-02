const repository = require("../repository/avisRepository");

const obtenirTousAvis = async () => await repository.obtenirTousAvis();
const obtenirAvisParId = async (id) => await repository.obtenirAvisParId(id);
const obtenirAvisParProduit = async (produitId) =>
	await repository.obtenirAvisParProduit(produitId);
const ajouterAvis = async (contenu, note, produit_id) =>
	await repository.ajouterAvis(contenu, note, produit_id);
const modifierAvis = async (id, contenu, note) =>
	await repository.modifierAvis(id, contenu, note);
const supprimerAvis = async (id) => await repository.supprimerAvis(id);

module.exports = {
	obtenirTousAvis,
	obtenirAvisParId,
	obtenirAvisParProduit,
	ajouterAvis,
	modifierAvis,
	supprimerAvis,
};
