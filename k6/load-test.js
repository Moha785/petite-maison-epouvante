import http from 'k6/http';
import { check, sleep } from 'k6';

export const options = {
  stages: [
    { duration: '30s', target: 10 },  // Montée en charge : 0 -> 10 utilisateurs
    { duration: '1m',  target: 50 },  // Charge normale : 50 utilisateurs
    { duration: '30s', target: 100 }, // Pic de charge : 100 utilisateurs
    { duration: '30s', target: 0 },   // Descente : retour à 0
  ],
  thresholds: {
    http_req_duration: ['p(95)<500'], // 95% des requêtes < 500ms
    http_req_failed:   ['rate<0.01'], // Moins de 1% d'erreurs
  },
};

const BASE_URL = 'http://localhost:8080';

export default function () {
  // Test 1 : Lister tous les produits
  const resProduits = http.get(`${BASE_URL}/api/produits`);
  check(resProduits, {
    '✅ GET /api/produits - status 200': (r) => r.status === 200,
    '✅ GET /api/produits - temps < 500ms': (r) => r.timings.duration < 500,
    '✅ GET /api/produits - retourne des produits': (r) => JSON.parse(r.body).length > 0,
  });

  sleep(1);

  // Test 2 : Détail d'un produit
  const resProduit = http.get(`${BASE_URL}/api/produits/1`);
  check(resProduit, {
    '✅ GET /api/produits/1 - status 200': (r) => r.status === 200,
    '✅ GET /api/produits/1 - temps < 300ms': (r) => r.timings.duration < 300,
  });

  sleep(1);

  // Test 3 : Recherche de produits
  const resRecherche = http.get(`${BASE_URL}/api/produits?categorie=LIVRE`);
  check(resRecherche, {
    '✅ GET /api/produits?categorie=LIVRE - status 200': (r) => r.status === 200,
  });

  sleep(1);
}
