import http from 'k6/http';
import { check, sleep } from 'k6';

export const options = {
  stages: [
    { duration: '30s', target: 10 },
    { duration: '1m',  target: 50 },
    { duration: '30s', target: 100 },
    { duration: '30s', target: 0 },
  ],
  thresholds: {
    http_req_duration: ['p(95)<500'],
    http_req_failed:   ['rate<0.01'],
  },
};

const BASE_URL = 'http://localhost:8080';

function scenarioVisite() {
  const res = http.get(`${BASE_URL}/api/produits`);
  check(res, { '✅ Catalogue chargé': (r) => r.status === 200 });
  sleep(Math.random() * 3 + 1);

  const produits = JSON.parse(res.body);
  const produit = produits[Math.floor(Math.random() * produits.length)];
  const res2 = http.get(`${BASE_URL}/api/produits/${produit.id}`);
  check(res2, { '✅ Détail produit chargé': (r) => r.status === 200 });
  sleep(Math.random() * 2 + 1);
}

function scenarioRecherche() {
  const categories = ['VETEMENT', 'LIVRE', 'ACCESSOIRE'];
  const cat = categories[Math.floor(Math.random() * categories.length)];
  const res = http.get(`${BASE_URL}/api/produits/recherche?categorie=${cat}`);
  check(res, { '✅ Recherche catégorie': (r) => r.status === 200 });
  sleep(Math.random() * 2 + 1);
}

function scenarioTroc() {
  const res = http.get(`${BASE_URL}/api/annonces`);
  check(res, { '✅ Annonces chargées': (r) => r.status === 200 });
  sleep(Math.random() * 2 + 1);
}

export default function () {
  const rand = Math.random();
  if (rand < 0.5) {
    scenarioVisite();
  } else if (rand < 0.8) {
    scenarioRecherche();
  } else {
    scenarioTroc();
  }
}
