'use client';

import { useEffect, useState } from 'react';
import { useKeycloak } from '@/hooks/useKeycloak';

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

export default function Home() {
  const { isAuthenticated, username, roles, login, logout, register, loading } = useKeycloak();
  const [produits, setProduits] = useState<Produit[]>([]);
  const [produitsLoading, setProduitsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [panier, setPanier] = useState<ArticlePanier[]>([]);
  const [panierOuvert, setPanierOuvert] = useState(false);

  useEffect(() => {
    fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080'}/api/produits`)
      .then(res => res.json())
      .then(data => { setProduits(data); setProduitsLoading(false); })
      .catch(() => { setError('Erreur de connexion au serveur'); setProduitsLoading(false); });
  }, []);

  const ajouterAuPanier = (produit: Produit) => {
    if (!isAuthenticated) { login(); return; }
    setPanier(prev => {
      const existant = prev.find(a => a.produit.id === produit.id);
      if (existant) {
        return prev.map(a => a.produit.id === produit.id ? { ...a, quantite: a.quantite + 1 } : a);
      }
      return [...prev, { produit, quantite: 1 }];
    });
  };

  const retirerDuPanier = (produitId: number) => {
    setPanier(prev => prev.filter(a => a.produit.id !== produitId));
  };

  const totalPanier = panier.reduce((acc, a) => acc + a.produit.prix * a.quantite, 0);
  const nbArticles = panier.reduce((acc, a) => acc + a.quantite, 0);

  return (
    <main className="min-h-screen bg-gray-950 text-white">
      <header className="bg-gray-900 border-b border-red-800 py-6 px-8">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-red-500">La Petite Maison de Epouvante</h1>
            <p className="text-gray-400 text-sm mt-1">Fanzine Horreur et Fantastique</p>
          </div>
          <div className="flex items-center gap-3">
            <button onClick={() => setPanierOuvert(!panierOuvert)} className="relative bg-gray-800 hover:bg-gray-700 px-4 py-2 rounded text-sm font-medium transition">
              🛒 Panier
              {nbArticles > 0 && (
                <span className="absolute -top-2 -right-2 bg-red-600 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                  {nbArticles}
                </span>
              )}
            </button>
            {loading ? (
              <span className="text-gray-500 text-sm">Chargement...</span>
            ) : isAuthenticated ? (
              <div className="flex items-center gap-3">
                <span className="text-gray-300 text-sm">👤 {username}</span>
                <button onClick={logout} className="bg-gray-700 hover:bg-gray-600 px-4 py-2 rounded text-sm font-medium transition">
                  Déconnexion
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <button onClick={register} className="bg-gray-700 hover:bg-gray-600 px-4 py-2 rounded text-sm font-medium transition">
                  Créer un compte
                </button>
                <button onClick={login} className="bg-red-700 hover:bg-red-600 px-4 py-2 rounded text-sm font-medium transition">
                  Connexion
                </button>
              </div>
            )}
          </div>
        </div>
      </header>

      {panierOuvert && (
        <div className="fixed top-0 right-0 h-full w-96 bg-gray-900 border-l border-gray-700 z-50 overflow-y-auto p-6 shadow-2xl">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-bold">🛒 Mon Panier</h2>
            <button onClick={() => setPanierOuvert(false)} className="text-gray-400 hover:text-white text-2xl">×</button>
          </div>
          {panier.length === 0 ? (
            <p className="text-gray-500 text-center py-12">Votre panier est vide</p>
          ) : (
            <>
              {panier.map(article => (
                <div key={article.produit.id} className="flex items-center justify-between bg-gray-800 rounded p-3 mb-3">
                  <div>
                    <p className="font-medium text-sm">{article.produit.nom}</p>
                    <p className="text-red-400 text-sm">{article.produit.prix.toFixed(2)} € x {article.quantite}</p>
                  </div>
                  <button onClick={() => retirerDuPanier(article.produit.id)} className="text-gray-500 hover:text-red-400 ml-4">🗑</button>
                </div>
              ))}
              <div className="border-t border-gray-700 mt-4 pt-4">
                <div className="flex justify-between font-bold text-lg mb-4">
                  <span>Total</span>
                  <span className="text-red-400">{totalPanier.toFixed(2)} €</span>
                </div>
                <button className="w-full bg-red-700 hover:bg-red-600 py-3 rounded font-medium transition">
                  Commander
                </button>
              </div>
            </>
          )}
        </div>
      )}

      <section className="max-w-6xl mx-auto px-8 py-12">
        <h2 className="text-2xl font-bold mb-8 text-red-400">Catalogue Produits</h2>

        {isAuthenticated && (
          <div className="bg-green-900 border border-green-600 text-green-200 px-6 py-3 rounded mb-6">
            Bienvenue <strong>{username}</strong> !
          </div>
        )}

        {produitsLoading && <div className="text-center text-gray-400 py-20">Chargement...</div>}
        {error && <div className="bg-red-900 border border-red-500 text-red-200 px-6 py-4 rounded">{error}</div>}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {produits.map(produit => (
            <div key={produit.id} className="bg-gray-900 border border-gray-800 rounded-lg overflow-hidden hover:border-red-700 transition">
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
                  onClick={() => ajouterAuPanier(produit)}
                  disabled={!produit.disponible}
                  className="mt-4 w-full bg-red-700 hover:bg-red-600 disabled:bg-gray-700 disabled:text-gray-500 py-2 rounded font-medium transition"
                >
                  {!produit.disponible ? 'Indisponible' : isAuthenticated ? 'Ajouter au panier' : 'Connectez-vous pour acheter'}
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
