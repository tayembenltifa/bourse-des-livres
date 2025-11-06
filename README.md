````markdown
name=README.md
```markdown
# Bourse des Livres — MVP

Ce dépôt contient un scaffold minimal pour l'application "Bourse des Livres" :
- Frontend : Next.js (pages minimalistes)
- Backend : Express + TypeScript
- DB : PostgreSQL (via Docker-compose)

Prérequis :
- Docker & docker-compose
- Node.js (pour installation locale sans Docker si souhaité)

Lancer en local (avec Docker) :
1. Copier `.env.example` en `.env` et ajuster si nécessaire.
2. Construire et démarrer :
   docker-compose up --build
3. Le frontend est accessible sur http://localhost:3000
   Le backend est accessible sur http://localhost:4000

Points d'extension :
- OAuth Google / Facebook : nécessite credentials (client id & secret)
- Stockage images : S3 (AWS) ou stockage local pour le MVP
- Messagerie temps réel : Socket.IO (ou polling REST pour MVP)

Si tu veux que je pousse tout le code dans le dépôt, donne l'autorisation GitHub et je pousserai l'ensemble des fichiers en un commit.
```
````