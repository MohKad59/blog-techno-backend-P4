const express = require("express");
const cors = require("cors");
const Joi = require("joi");
const produitActions = require("./actions/produitActions");
require("dotenv").config();

const app = express();
app.use(cors());
app.use(express.json());

// Schémas Joi pour la validation
const produitSchema = Joi.object({
	nom: Joi.string().min(1).max(100).required(),
	description: Joi.string().min(1).max(500).required(),
	prix: Joi.number().positive().required(),
	photo: Joi.string().uri().required(),
});

const idSchema = Joi.object({
	id: Joi.number().integer().positive().required(),
});

// Middleware de validation
const validateProduit = (req, res, next) => {
	const { error } = produitSchema.validate(req.body);
	if (error) {
		console.error("Validation erreur produit :", error.details);
		return res
			.status(400)
			.json({ message: "Données invalides", details: error.details });
	}
	next();
};

const validateId = (req, res, next) => {
	const rawId = req.params.id;
	const id = Number.parseInt(rawId, 10); // Utilisation de Number.parseInt
	if (Number.isNaN(id)) {
		// Utilisation de Number.isNaN
		console.error(`ID invalide : ${rawId} n’est pas un nombre`);
		return res
			.status(400)
			.json({
				message: "ID invalide",
				details: "L’ID doit être un nombre entier positif",
			});
	}
	const { error } = idSchema.validate({ id });
	if (error) {
		console.error("Validation erreur ID :", error.details);
		return res
			.status(400)
			.json({ message: "ID invalide", details: error.details });
	}
	req.validatedId = id; // Stocke l’ID validé pour usage ultérieur (optionnel)
	next();
};

// Routes Produits
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

app.post("/produits", validateProduit, async (req, res) => {
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

app.put("/produits/:id", validateId, validateProduit, async (req, res) => {
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

app.delete("/produits/:id", validateId, async (req, res) => {
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
