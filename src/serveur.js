const express = require("express");
const cors = require("cors");
const produitActions = require("./actions/produitActions");
const avisActions = require("./actions/avisActions");
const comparatifActions = require("./actions/comparatifActions");
const tutorielActions = require("./actions/tutorielActions");
require("dotenv").config();

const app = express();
app.use(cors());
app.use(express.json());

// Produits
app.get("/produits", async (req, res) => {
	const produits = await produitActions.obtenirTousProduits();
	res.json(produits);
});

app.get("/produits/:id", async (req, res) => {
	const produit = await produitActions.obtenirProduitParId(req.params.id);
	res.json(produit);
});

app.post("/produits", async (req, res) => {
	const { nom, description, prix, photo } = req.body;
	const nouveauProduit = await produitActions.ajouterProduit(
		nom,
		description,
		prix,
		photo,
	);
	res.json(nouveauProduit);
});

app.put("/produits/:id", async (req, res) => {
	const { nom, description, prix, photo } = req.body;
	const produitModifie = await produitActions.modifierProduit(
		req.params.id,
		nom,
		description,
		prix,
		photo,
	);
	res.json(produitModifie);
});

app.delete("/produits/:id", async (req, res) => {
	await produitActions.supprimerProduit(req.params.id);
	res.json({ message: "Produit supprimé" });
});

// Avis
app.get("/avis", async (req, res) => {
	const avis = await avisActions.obtenirTousAvis();
	res.json(avis);
});

app.get("/avis/:id", async (req, res) => {
	const avis = await avisActions.obtenirAvisParId(req.params.id);
	res.json(avis);
});

app.get("/avis/produit/:produitId", async (req, res) => {
	const avis = await avisActions.obtenirAvisParProduit(req.params.produitId);
	res.json(avis);
});

app.post("/avis", async (req, res) => {
	const { contenu, note, produit_id } = req.body;
	const nouvelAvis = await avisActions.ajouterAvis(contenu, note, produit_id);
	res.json(nouvelAvis);
});

app.put("/avis/:id", async (req, res) => {
	const { contenu, note } = req.body;
	const avisModifie = await avisActions.modifierAvis(
		req.params.id,
		contenu,
		note,
	);
	res.json(avisModifie);
});

app.delete("/avis/:id", async (req, res) => {
	await avisActions.supprimerAvis(req.params.id);
	res.json({ message: "Avis supprimé" });
});

// Comparatifs
app.get("/comparatifs", async (req, res) => {
	const comparatifs = await comparatifActions.obtenirTousComparatifs();
	res.json(comparatifs);
});

app.get("/comparatifs/:id", async (req, res) => {
	const comparatif = await comparatifActions.obtenirComparatifParId(
		req.params.id,
	);
	res.json(comparatif);
});

app.post("/comparatifs", async (req, res) => {
	const { titre, contenu, produit1_id, produit2_id } = req.body;
	const nouveauComparatif = await comparatifActions.ajouterComparatif(
		titre,
		contenu,
		produit1_id,
		produit2_id,
	);
	res.json(nouveauComparatif);
});

app.put("/comparatifs/:id", async (req, res) => {
	const { titre, contenu, produit1_id, produit2_id } = req.body;
	const comparatifModifie = await comparatifActions.modifierComparatif(
		req.params.id,
		titre,
		contenu,
		produit1_id,
		produit2_id,
	);
	res.json(comparatifModifie);
});

app.delete("/comparatifs/:id", async (req, res) => {
	await comparatifActions.supprimerComparatif(req.params.id);
	res.json({ message: "Comparatif supprimé" });
});

// Tutoriels
app.get("/tutoriels", async (req, res) => {
	const tutoriels = await tutorielActions.obtenirTousTutoriels();
	res.json(tutoriels);
});

app.get("/tutoriels/:id", async (req, res) => {
	const tutoriel = await tutorielActions.obtenirTutorielParId(req.params.id);
	res.json(tutoriel);
});

app.get("/tutoriels/produit/:produitId", async (req, res) => {
	const tutoriels = await tutorielActions.obtenirTutorielsParProduit(
		req.params.produitId,
	);
	res.json(tutoriels);
});

app.post("/tutoriels", async (req, res) => {
	const { titre, contenu, produit_id } = req.body;
	const nouveauTutoriel = await tutorielActions.ajouterTutoriel(
		titre,
		contenu,
		produit_id,
	);
	res.json(nouveauTutoriel);
});

app.put("/tutoriels/:id", async (req, res) => {
	const { titre, contenu, produit_id } = req.body;
	const tutorielModifie = await tutorielActions.modifierTutoriel(
		req.params.id,
		titre,
		contenu,
		produit_id,
	);
	res.json(tutorielModifie);
});

app.delete("/tutoriels/:id", async (req, res) => {
	await tutorielActions.supprimerTutoriel(req.params.id);
	res.json({ message: "Tutoriel supprimé" });
});

const port = process.env.PORT || 5000;
app.listen(port, () => console.log(`Serveur démarré sur le port ${port}`));
