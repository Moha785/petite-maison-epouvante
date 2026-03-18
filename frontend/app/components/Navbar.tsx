'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { useKeycloak } from '@/hooks/useKeycloak';

interface ArticlePanier {
  produit: { id: number; nom: string; prix: number; };
  quantite: number;
}

export default function Navbar() {
  const { isAuthenticated, username, login, logout, register, loading } = useKeycloak();
  const router = useRouter();
  const [panierOuvert, setPanierOuvert] = useState(false);
  const [panier, setPanier] = useState<ArticlePanier[]>([]);
  const [profil, setProfil] = useState<{ avatarUrl: string; prenom: string; nom: string }>({ avatarUrl: '', prenom: '', nom: '' });
  const initialise = useRef(false);

  useEffect(() => {
    if (!initialise.current) {
      const saved = localStorage.getItem('panier');
      if (saved) setPanier(JSON.parse(saved));
      initialise.current = true;
    }
  }, []);

  useEffect(() => {
    if (username) {
      fetch(`http://localhost:8080/api/profil/${username}`)
        .then(res => res.json())
        .then(data => setProfil(data))
        .catch(() => {});
    }
  }, [username]);

  const retirerDuPanier = (produitId: number) => {
    const updated = panier.filter(a => a.produit.id !== produitId);
    setPanier(updated);
    localStorage.setItem('panier', JSON.stringify(updated));
  };

  const totalPanier = panier.reduce((acc, a) => acc + a.produit.prix * a.quantite, 0);
  const nbArticles = panier.reduce((acc, a) => acc + a.quantite, 0);
  const initiale = username?.charAt(0).toUpperCase() || '?';

  return (
    <>
      <header className="bg-gray-900 border-b border-red-800 py-4 px-8 sticky top-0 z-40">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-8">
            <div>
              <h1
                onClick={() => router.push('/')}
                className="text-2xl font-bold text-red-500 cursor-pointer hover:text-red-400 transition"
              >
                La Petite Maison de Epouvante
              </h1>
              <p className="text-gray-400 text-xs mt-0.5">Fanzine Horreur et Fantastique</p>
            </div>
            <nav className="flex items-center gap-4">
              <button
                onClick={() => router.push('/')}
                className="text-gray-400 hover:text-white text-sm transition"
              >
                🏚️ Catalogue
              </button>
              <button
                onClick={() => router.push('/troc')}
                className="text-gray-400 hover:text-red-400 text-sm transition"
              >
                🔄 Troc & Échange
              </button>
            </nav>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => setPanierOuvert(!panierOuvert)}
              className="relative bg-gray-800 hover:bg-gray-700 px-4 py-2 rounded text-sm font-medium transition"
            >
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
                <button onClick={() => router.push('/profil')} className="flex items-center gap-2 hover:opacity-80 transition">
                  {profil.avatarUrl ? (
                    <img src={profil.avatarUrl} alt="Avatar" className="w-8 h-8 rounded-full object-cover border border-red-700" />
                  ) : (
                    <div className="bg-red-700 rounded-full w-8 h-8 flex items-center justify-center text-sm font-bold">
                      {initiale}
                    </div>
                  )}
                  <span className="text-gray-300 text-sm">{username}</span>
                </button>
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
    </>
  );
}
