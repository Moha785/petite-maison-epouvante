'use client';

import { useEffect, useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { useKeycloak } from '@/hooks/useKeycloak';
import Navbar from '@/app/components/Navbar';

interface Produit {
  id: number;
  nom: string;
  description: string;
  prix: number;
  stock: number;
  categorie: string;
  disponible: boolean;
}

interface ArticlePanier {
  produit: Produit;
  quantite: number;
}

interface ProfilData {
  avatarUrl: string;
  prenom: string;
  nom: string;
}

const getPanierFromStorage = (): ArticlePanier[] => {
  try {
    const saved = localStorage.getItem('panier');
    return saved ? JSON.parse(saved) : [];
  } catch {
    return [];
  }
};

const CATEGORIES = ['TOUS', 'VETEMENT', 'LIVRE', 'ACCESSOIRE'];

export default function Home() {
  const { isAuthenticated, username, login, loading } = useKeycloak();
  const router = useRouter();
  const [produits, setProduits] = useState<Produit[]>([]);
  const [produitsLoading, setProduitsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [panier, setPanier] = useState<ArticlePanier[]>([]);
  const [recherche, setRecherche] = useState('');
  const [categorieActive, setCategorieActive] = useState('TOUS');
  const [profil, setProfil] = useState<ProfilData>({ avatarUrl: '', prenom: '', nom: '' });
  const initialise = useRef(false);

  useEffect(() => {
    if (!initialise.current) {
      setPanier(getPanierFromStorage());
      initialise.current = true;
    }
  }, []);

  useEffect(() => {
    if (initialise.current) {
      localStorage.setItem('panier', JSON.stringify(panier));
    }
  }, [panier]);

  useEffect(() => {
    fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080'}/api/produits`)
      .then(res => res.json())
      .then(data => { setProduits(data); setProduitsLoading(false); })
      .catch(() => { setError('Erreur de connexion au serveur'); setProduitsLoading(false); });
  }, []);

  useEffect(() => {
    if (username) {
      fetch(`http://localhost:8080/api/profil/${username}`)
        .then(res => res.json())
        .then(data => setProfil(data))
        .catch(() => {});
    }
  }, [username]);

  const produitsFiltres = produits.filter(p => {
    const matchRecherche = p.nom.toLowerCase().includes(recherche.toLowerCase()) ||
                           p.description.toLowerCase().includes(recherche.toLowerCase());
    const matchCategorie = categorieActive === 'TOUS' || p.categorie === categorieActive;
    return matchRecherche && matchCategorie;
  });

  const ajouterAuPanier = (e: React.MouseEvent, produit: Produit) => {
    e.stopPropagation();
    if (!isAuthenticated) { login(); return; }
    const updated = (() => {
      const existant = panier.find(a => a.produit.id === produit.id);
      if (existant) {
        return panier.map(a => a.produit.id === produit.id ? { ...a, quantite: a.quantite + 1 } : a);
      }
      return [...panier, { produit, quantite: 1 }];
    })();
    setPanier(updated);
    localStorage.setItem('panier', JSON.stringify(updated));
  };

  const initiale = username?.charAt(0).toUpperCase() || '?';

  return (
    <main className="min-h-screen bg-gray-950 text-white">
      <Navbar />

      <section className="max-w-6xl mx-auto px-8 py-12">
        <h2 className="text-2xl font-bold mb-6 text-red-400">Catalogue Produits</h2>

        {isAuthenticated && (
          <div className="flex items-center gap-4 bg-gradient-to-r from-gray-900 to-gray-800 border border-gray-700 rounded-xl px-6 py-4 mb-8 shadow-lg">
            <div className="rounded-full w-12 h-12 overflow-hidden flex-shrink-0">
              {profil.avatarUrl ? (
                <img src={profil.avatarUrl} alt="Avatar" className="w-full h-full object-cover" />
              ) : (
                <div className="bg-red-700 w-full h-full flex items-center justify-center text-xl font-bold">
                  {initiale}
                </div>
              )}
            </div>
            <div>
              <p className="text-gray-400 text-xs uppercase tracking-widest">Connecté en tant que</p>
              <p className="text-white font-bold text-lg">{profil.prenom || profil.nom ? `${profil.prenom} ${profil.nom}` : username}</p>
            </div>
            <div className="ml-auto bg-red-900 text-red-300 text-xs px-3 py-1 rounded-full border border-red-700">
              ✓ Membre actif
            </div>
          </div>
        )}

        <div className="flex flex-col md:flex-row gap-4 mb-8">
          <input
            type="text"
            placeholder="🔍 Rechercher un produit..."
            value={recherche}
            onChange={e => setRecherche(e.target.value)}
            className="flex-1 bg-gray-800 border border-gray-700 rounded px-4 py-2 text-white placeholder-gray-500 focus:outline-none focus:border-red-500"
          />
          <div className="flex gap-2">
            {CATEGORIES.map(cat => (
              <button
                key={cat}
                onClick={() => setCategorieActive(cat)}
                className={`px-4 py-2 rounded text-sm font-medium transition ${
                  categorieActive === cat ? 'bg-red-700 text-white' : 'bg-gray-800 text-gray-400 hover:bg-gray-700'
                }`}
              >
                {cat === 'TOUS' ? 'Tous' :
                 cat === 'VETEMENT' ? '👕 Vêtements' :
                 cat === 'LIVRE' ? '📚 Livres' : '🎭 Accessoires'}
              </button>
            ))}
          </div>
        </div>

        {produitsLoading && <div className="text-center text-gray-400 py-20">Chargement...</div>}
        {error && <div className="bg-red-900 border border-red-500 text-red-200 px-6 py-4 rounded">{error}</div>}

        {!produitsLoading && produitsFiltres.length === 0 && (
          <div className="text-center text-gray-500 py-20">
            <p className="text-5xl mb-4">👻</p>
            <p>Aucun produit ne correspond à votre recherche.</p>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {produitsFiltres.map(produit => (
            <div
              key={produit.id}
              onClick={() => router.push(`/produits/${produit.id}`)}
              className="bg-gray-900 border border-gray-800 rounded-lg overflow-hidden hover:border-red-700 transition cursor-pointer"
            >
              <div className="bg-gray-800 h-48 flex items-center justify-center text-6xl">
                {produit.categorie === 'VETEMENT' ? '👕' :
                 produit.categorie === 'LIVRE' ? '📚' :
                 produit.categorie === 'ACCESSOIRE' ? '🎭' : '🛒'}
              </div>
              <div className="p-5">
                <span className="text-xs text-red-400 uppercase font-semibold">{produit.categorie}</span>
                <h3 className="text-lg font-bold mt-1 mb-2">{produit.nom}</h3>
                <p className="text-gray-400 text-sm mb-4">{produit.description}</p>
                <div className="flex items-center justify-between">
                  <span className="text-2xl font-bold text-red-400">{produit.prix.toFixed(2)} €</span>
                  <span className="text-xs text-gray-500">Stock : {produit.stock}</span>
                </div>
                <button
                  onClick={(e) => ajouterAuPanier(e, produit)}
                  disabled={!produit.disponible || loading}
                  className="mt-4 w-full bg-red-700 hover:bg-red-600 disabled:bg-gray-700 disabled:text-gray-500 py-2 rounded font-medium transition"
                >
                  {!produit.disponible ? 'Indisponible' :
                   loading ? '...' :
                   isAuthenticated ? 'Ajouter au panier' : 'Connectez-vous pour acheter'}
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

      <footer className="border-t border-gray-800 text-center text-gray-600 py-6 text-sm">
        2026 La Petite Maison de Epouvante — Angouleme · Aix · Lyon · Londres
      </footer>
    </main>
  );
}
