# 🏚️ La Petite Maison de l'Épouvante

Plateforme e-commerce et communautaire pour un fanzine horreur & fantastique.

> Projet CESI - Bloc INFMAALSIA2 - Master Informatique

## 📋 Présentation

La Petite Maison de l'Épouvante est une entreprise spécialisée dans le fanzine horreur/fantastique avec 4 magasins (Angoulême, Aix-en-Provence, Lyon, Londres). Ce projet consiste à développer une plateforme e-commerce avec espace communautaire.

## 🏗️ Architecture

| Couche | Technologie |
|--------|------------|
| Frontend | Next.js 14 (React + TypeScript) |
| Backend | Spring Boot 3 (Java 21) |
| Authentification | Keycloak 24 |
| Base de données | PostgreSQL 16 |
| Conteneurisation | Docker + Docker Compose |
| Orchestration | Kubernetes (Minikube) |
| CI/CD | GitHub Actions |

## 🚀 Lancement rapide

### Prérequis
- Docker Desktop
- Java 21
- Node.js 20
- Maven 3.9

### 1. Démarrer les services Docker
```bash
docker compose up -d
```

### 2. Démarrer le backend
```bash
cd backend
mvn spring-boot:run
```

### 3. Démarrer le frontend
```bash
cd frontend
npm install
npm run dev
```

### 4. Accéder à l'application
| Service | URL |
|---------|-----|
| Frontend | http://localhost:3000 |
| Backend API | http://localhost:8080/api/produits |
| Keycloak Admin | http://localhost:8180 |

## 🔐 Comptes de test

| Utilisateur | Mot de passe | Rôle |
|-------------|-------------|------|
| user_test | password123 | client |
| admin_test | admin123 | admin |
| admin (Keycloak) | admin | superadmin |

## ☸️ Déploiement Kubernetes
```bash
# Démarrer Minikube
minikube start --driver=docker --memory=3500 --cpus=2

# Charger l'image backend
docker build -t pme-backend:latest ./backend
minikube image load pme-backend:latest

# Déployer
kubectl apply -f k8s/postgres.yaml
kubectl apply -f k8s/backend.yaml

# Accéder à l'API
minikube service backend --url
```

## 🔄 Pipeline CI/CD

Le pipeline GitHub Actions effectue automatiquement à chaque push :

1. **Build & Test Backend** - Compilation Maven + tests unitaires
2. **Build Frontend** - Compilation Next.js
3. **Build Docker Image** - Construction de l'image backend

## 📁 Structure du projet
```
petite-maison-epouvante/
├── backend/          # Spring Boot API
├── frontend/         # Next.js
├── docker/           # Scripts SQL init
├── k8s/              # Manifestes Kubernetes
├── .github/workflows # Pipeline CI/CD
└── docker-compose.yml
```

## 👤 Auteur

Mohamed - CESI École d'Ingénieurs - 2026
