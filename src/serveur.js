const express = require("express");
const cors = require("cors");
const produitActions = require("./actions/produitActions");
require("dotenv").config();

const app = express();
app.use(cors());
app.use(express.json());

// Produits
app.get("/produits", async (req, res) => {
	console.log("GET /produits appelé");
	try {
		const produits = await produitActions.obtenirTousProduits();
		res.json(produits);
	} catch (error) {
		console.error("Erreur GET /produits :", error);
		res
			.status(500)
			.json({ message: "Erreur serveur lors de la récupération des produits" });
	}
});

app.post("/produits", async (req, res) => {
	console.log("POST /produits appelé avec :", req.body);
	try {
		const { nom, description, prix, photo } = req.body;
		const nouveauProduit = await produitActions.ajouterProduit(
			nom,
			description,
			prix,
			photo,
		);
		res.status(201).json(nouveauProduit);
	} catch (error) {
		console.error("Erreur POST /produits :", error);
		res
			.status(500)
			.json({ message: "Erreur serveur lors de l’ajout du produit" });
	}
});

app.put("/produits/:id", async (req, res) => {
	console.log(`PUT /produits/${req.params.id} appelé avec :`, req.body);
	try {
		const { nom, description, prix, photo } = req.body;
		const produitModifie = await produitActions.modifierProduit(
			req.params.id,
			nom,
			description,
			prix,
			photo,
		);
		res.json(produitModifie);
	} catch (error) {
		console.error("Erreur PUT /produits :", error);
		res
			.status(500)
			.json({ message: "Erreur serveur lors de la modification du produit" });
	}
});

app.delete("/produits/:id", async (req, res) => {
	console.log(`DELETE /produits/${req.params.id} appelé`);
	try {
		await produitActions.supprimerProduit(req.params.id);
		res.json({ message: "Produit supprimé" });
	} catch (error) {
		console.error("Erreur DELETE /produits :", error);
		res
			.status(500)
			.json({ message: "Erreur serveur lors de la suppression du produit" });
	}
});

const port = process.env.PORT || 5000;
app.listen(port, () => console.log(`Serveur démarré sur le port ${port}`));
