const Joi = require('joi');

// Middleware générique pour valider req.body contre un schéma Joi
const validateBody = (schema) => {
  return (req, res, next) => {
    // On valide uniquement req.body car req.file (image) est géré séparément par multer
    const { error } = schema.validate(req.body, {
      abortEarly: false, // Rapporter toutes les erreurs, pas seulement la première
      allowUnknown: true, // Ignorer les champs non définis dans le schéma (comme 'photo' venant de multer)
      stripUnknown: true // Retirer les champs inconnus du résultat validé (optionnel)
    }); 

    if (error) {
      console.warn("Erreur de validation Joi:", error.details);
      // Formatter les erreurs pour une réponse claire
      const errors = error.details.map(detail => ({ 
        message: detail.message, 
        field: detail.context.key 
      }));
      return res.status(400).json({ message: "Données invalides", errors });
    }

    // Si la validation réussit, passer au prochain middleware ou à la route
    next();
  };
};

// Définir des schémas spécifiques ici
const schemas = {
  produitAjout: Joi.object({
    nom: Joi.string().min(3).max(100).required().messages({
      'string.base': 'Le nom doit être une chaîne de caractères.',
      'string.empty': 'Le nom ne peut pas être vide.',
      'string.min': 'Le nom doit contenir au moins {#limit} caractères.',
      'string.max': 'Le nom ne peut pas dépasser {#limit} caractères.',
      'any.required': 'Le nom est requis.'
    }),
    description: Joi.string().min(10).required().messages({
      'string.base': 'La description doit être une chaîne de caractères.',
      'string.empty': 'La description ne peut pas être vide.',
      'string.min': 'La description doit contenir au moins {#limit} caractères.',
      'any.required': 'La description est requise.'
    }),
    prix: Joi.number().positive().precision(2).required().messages({
      'number.base': 'Le prix doit être un nombre.',
      'number.positive': 'Le prix doit être un nombre positif.',
      'number.precision': 'Le prix ne peut pas avoir plus de {#limit} décimales.',
      'any.required': 'Le prix est requis.'
    }),
    // On ne valide pas 'photo' ici car elle peut venir soit de req.file (non dans req.body),
    // soit de req.body si c'est une URL. La route vérifiera la présence de l'un ou l'autre.
  }),

  // Ajouter d'autres schémas ici (ex: produitModif, avisAjout, etc.)
  produitModif: Joi.object({
    nom: Joi.string().min(3).max(100).optional(),
    description: Joi.string().min(10).optional(),
    prix: Joi.number().positive().precision(2).optional(),
    // Le champ photo est aussi optionnel ici et peut être une URL ou absent
    photo: Joi.string().uri().optional() 
  })
  // ... autres schémas ...
};

module.exports = {
  validateBody,
  schemas
}; 