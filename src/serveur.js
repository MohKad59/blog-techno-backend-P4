const express = require("express");
const cors = require("cors");
const path = require("node:path");
const multer = require("multer");
const fs = require('node:fs'); // Importer le module File System
const { validateBody, schemas } = require("./middlewares/validationMiddleware");
const produitActions = require("./actions/produitActions");
const avisActions = require("./actions/avisActions");
const comparatifActions = require("./actions/comparatifActions");
const tutorielActions = require("./actions/tutorielActions");
require("dotenv").config();

// Définir le chemin du dossier uploads
const uploadsDir = path.join(__dirname, "../../uploads");

// Créer le dossier uploads s'il n'existe pas
if (!fs.existsSync(uploadsDir)){
    fs.mkdirSync(uploadsDir, { recursive: true });
    console.log(`Dossier uploads créé à: ${uploadsDir}`);
}

// Configuration de Multer avec fonctions fléchées et template literal
const storage = multer.diskStorage({
	destination: (req, file, cb) => {
		cb(null, uploadsDir);
	},
	filename: (req, file, cb) => {
		cb(null, `${Date.now()}-${file.originalname.replace(/\s+/g, '_')}`);
	},
});
const upload = multer({ storage: storage });

const app = express();
app.use(cors());
app.use(express.json());

// Servir les fichiers statiques depuis le dossier uploads
app.use("/uploads", express.static(uploadsDir));

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

app.post("/produits", upload.single("photo"), validateBody(schemas.produitAjout), async (req, res) => {
	console.log("POST /produits validé, body:", req.body);
	console.log("Fichier reçu:", req.file);
	try {
		const { nom, description, prix } = req.body;
		let photoValue;

		if (req.file) {
			photoValue = req.file.filename;
		} else if (req.body.photo && typeof req.body.photo === 'string' && req.body.photo.startsWith('http')) {
			photoValue = req.body.photo;
		} else {
			// Normalement, cette condition ne devrait plus être atteinte si l'upload est requis
			// Mais on garde une sécurité. Ou on ajuste le schéma Joi si l'URL est obligatoire quand pas de fichier.
			// Si l'un des deux (fichier ou URL) est requis, la logique de validation devrait être plus complexe
			// ou faite ici après le middleware Joi.
			return res.status(400).json({ message: "Une image (fichier ou URL valide) est requise." });
		}

		const nouveauProduit = await produitActions.ajouterProduit(
			nom,
			description,
			prix,
			photoValue,
		);
		res.status(201).json(nouveauProduit);
	} catch (error) {
		console.error("Erreur POST /produits :", error);
		res
			.status(500)
			.json({ message: "Erreur serveur lors de l'ajout du produit" });
	}
});

app.put("/produits/:id", upload.single("photo"), async (req, res) => {
	const produitId = req.params.id;
	console.log(`PUT /produits/${produitId} appelé avec body:`, req.body);
	console.log("Fichier reçu pour modif (peut être undefined):", req.file);
	try {
		const { nom, description, prix } = req.body;
		let photoValue; // Pas de type ici (JS)

		if (req.file) {
			photoValue = req.file.filename;
			console.log("Modification photo avec fichier:", photoValue);
		} else if (
			req.body.photo &&
			typeof req.body.photo === "string" &&
			req.body.photo.startsWith("http")
		) {
			photoValue = req.body.photo;
			console.log("Modification photo avec URL:", photoValue);
		} else if (req.body.photo === "") {
			// Si le champ photo est explicitement envoyé vide (ex: URL supprimée sans fichier choisi)
			// On pourrait vouloir supprimer la photo ici ou la garder. Pour l'instant, on garde.
			photoValue = undefined; // Ne pas passer pour la mise à jour
			console.log(
				"Modification photo : Aucune nouvelle photo fournie (URL effacée ?).",
			);
		}
		// Si ni req.file, ni req.body.photo valide, photoValue reste undefined
		// et ne sera pas passé à l'action de modification (comportement voulu)
		else {
			console.log("Modification photo : Aucune nouvelle photo fournie.");
		}

		const produitModifie = await produitActions.modifierProduit(
			produitId,
			nom,
			description,
			prix,
			photoValue, // Sera undefined si pas de nouvelle photo fournie
		);
		res.json(produitModifie);
	} catch (error) {
		console.error(`Erreur PUT /produits/${produitId} :`, error);
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

// Avis
app.get("/avis", async (req, res) => {
	console.log("GET /avis appelé");
	try {
		const tousAvis = await avisActions.obtenirTousAvis();
		res.json(tousAvis);
	} catch (error) {
		console.error("Erreur GET /avis :", error);
		res
			.status(500)
			.json({ message: "Erreur serveur lors de la récupération des avis" });
	}
});

// POST /avis
app.post("/avis", async (req, res) => {
	console.log("POST /avis appelé avec:", req.body);
	try {
		const { contenu, note, produit_id } = req.body;
		const nouvelAvis = await avisActions.ajouterAvis(contenu, note, produit_id);
		res.status(201).json(nouvelAvis);
	} catch (error) {
		console.error("Erreur POST /avis :", error);
		res.status(500).json({ message: "Erreur serveur lors de l'ajout de l'avis" });
	}
});

// PUT /avis/:id
app.put("/avis/:id", async (req, res) => {
	const avisId = req.params.id;
	console.log(`PUT /avis/${avisId} appelé avec:`, req.body);
	try {
		const { contenu, note } = req.body; // produit_id n'est généralement pas modifié
		const avisModifie = await avisActions.modifierAvis(avisId, contenu, note);
		res.json(avisModifie);
	} catch (error) {
		console.error(`Erreur PUT /avis/${avisId} :`, error);
		res.status(500).json({ message: "Erreur serveur lors de la modification de l'avis" });
	}
});

// DELETE /avis/:id
app.delete("/avis/:id", async (req, res) => {
	const avisId = req.params.id;
	console.log(`DELETE /avis/${avisId} appelé`);
	try {
		await avisActions.supprimerAvis(avisId);
		res.json({ message: "Avis supprimé" });
	} catch (error) {
		console.error(`Erreur DELETE /avis/${avisId} :`, error);
		res.status(500).json({ message: "Erreur serveur lors de la suppression de l'avis" });
	}
});

// Comparatifs
app.get("/comparatifs", async (req, res) => {
	console.log("GET /comparatifs appelé");
	try {
		const tousComparatifs = await comparatifActions.obtenirTousComparatifs();
		res.json(tousComparatifs);
	} catch (error) {
		console.error("Erreur GET /comparatifs :", error);
		res
			.status(500)
			.json({
				message: "Erreur serveur lors de la récupération des comparatifs",
			});
	}
});

// POST /comparatifs
app.post("/comparatifs", async (req, res) => {
	console.log("POST /comparatifs appelé avec:", req.body);
	try {
		const { titre, contenu, produit1_id, produit2_id } = req.body;
		const nouveauComp = await comparatifActions.ajouterComparatif(titre, contenu, produit1_id, produit2_id);
		res.status(201).json(nouveauComp);
	} catch (error) {
		console.error("Erreur POST /comparatifs :", error);
		res.status(500).json({ message: "Erreur serveur lors de l'ajout du comparatif" });
	}
});

// PUT /comparatifs/:id
app.put("/comparatifs/:id", async (req, res) => {
	const compId = req.params.id;
	console.log(`PUT /comparatifs/${compId} appelé avec:`, req.body);
	try {
		const { titre, contenu, produit1_id, produit2_id } = req.body;
		const compModifie = await comparatifActions.modifierComparatif(compId, titre, contenu, produit1_id, produit2_id);
		res.json(compModifie);
	} catch (error) {
		console.error(`Erreur PUT /comparatifs/${compId} :`, error);
		res.status(500).json({ message: "Erreur serveur lors de la modification du comparatif" });
	}
});

// DELETE /comparatifs/:id
app.delete("/comparatifs/:id", async (req, res) => {
	const compId = req.params.id;
	console.log(`DELETE /comparatifs/${compId} appelé`);
	try {
		await comparatifActions.supprimerComparatif(compId);
		res.json({ message: "Comparatif supprimé" });
	} catch (error) {
		console.error(`Erreur DELETE /comparatifs/${compId} :`, error);
		res.status(500).json({ message: "Erreur serveur lors de la suppression du comparatif" });
	}
});

// Tutoriels
app.get("/tutoriels", async (req, res) => {
	console.log("GET /tutoriels appelé");
	try {
		const tousTutoriels = await tutorielActions.obtenirTousTutoriels();
		res.json(tousTutoriels);
	} catch (error) {
		console.error("Erreur GET /tutoriels :", error);
		res
			.status(500)
			.json({
				message: "Erreur serveur lors de la récupération des tutoriels",
			});
	}
});

// POST /tutoriels
app.post("/tutoriels", async (req, res) => {
	console.log("POST /tutoriels appelé avec:", req.body);
	try {
		const { titre, contenu, produit_id } = req.body;
		const nouveauTuto = await tutorielActions.ajouterTutoriel(titre, contenu, produit_id);
		res.status(201).json(nouveauTuto);
	} catch (error) {
		console.error("Erreur POST /tutoriels :", error);
		res.status(500).json({ message: "Erreur serveur lors de l'ajout du tutoriel" });
	}
});

// PUT /tutoriels/:id
app.put("/tutoriels/:id", async (req, res) => {
	const tutoId = req.params.id;
	console.log(`PUT /tutoriels/${tutoId} appelé avec:`, req.body);
	try {
		const { titre, contenu, produit_id } = req.body; // produit_id peut être modifié ici ? A vérifier
		const tutoModifie = await tutorielActions.modifierTutoriel(tutoId, titre, contenu, produit_id);
		res.json(tutoModifie);
	} catch (error) {
		console.error(`Erreur PUT /tutoriels/${tutoId} :`, error);
		res.status(500).json({ message: "Erreur serveur lors de la modification du tutoriel" });
	}
});

// DELETE /tutoriels/:id
app.delete("/tutoriels/:id", async (req, res) => {
	const tutoId = req.params.id;
	console.log(`DELETE /tutoriels/${tutoId} appelé`);
	try {
		await tutorielActions.supprimerTutoriel(tutoId);
		res.json({ message: "Tutoriel supprimé" });
	} catch (error) {
		console.error(`Erreur DELETE /tutoriels/${tutoId} :`, error);
		res.status(500).json({ message: "Erreur serveur lors de la suppression du tutoriel" });
	}
});

const port = process.env.PORT || 5000;
app.listen(port, () => console.log(`Serveur démarré sur le port ${port}`));
