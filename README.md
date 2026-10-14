# Tempo — prototype Sprint 1

Prototype interactif mobile-first d’une plateforme SaaS de pointage des intérimaires. Toutes les données, l’authentification, le temps réel et la géolocalisation sont simulés dans le navigateur : aucune donnée réelle n’est envoyée.

## Démarrage

Prérequis : Node.js 20 ou plus récent.

```bash
npm ci
npm run dev
```

Ouvrir `http://localhost:3000`. Choisir un profil, conserver le numéro proposé, puis utiliser le code de démonstration `123456`.

Pour tester le circuit complet :

1. Profil **Intérimaire** : pointer puis soumettre le relevé.
2. Profil **Responsable** : valider le relevé de Paul.
3. Profil **Agence** : effectuer la validation finale.
4. Observer chaque action dans le flux d’activité de l’agence.

## Vérifications

```bash
npm test
npm run lint
npm run build
```

## Périmètre

Ce Sprint 1 est une démonstration locale. Supabase, SMS OTP réel, persistance, RLS, géolocalisation réelle et export CSV seront traités dans les sprints ultérieurs après validation. Aucun secret ne doit être ajouté au dépôt.
