'use client';

import { useEffect, useState } from 'react';

interface Produit {
  id: number;
  nom: string;
  description: string;
  prix: number;
  stock: number;
  categorie: string;
  disponible: boolean;
  imageUrl?: string;
}

export default function Home() {
  const [produits, setProduits] = useState<Produit[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetch('http://localhost:8080/api/produits')
      .then(res => res.json())
      .then(data => { setProduits(data); setLoading(false); })
      .catch(() => { setError('Erreur de connexion au serveur'); setLoading(false); });
  }, []);

  return (
    <main className="min-h-screen bg-gray-950 text-white">
      <header className="bg-gray-900 border-b border-red-800 py-6 px-8">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-red-500">La Petite Maison de Epouvante</h1>
            <p className="text-gray-400 text-sm mt-1">Fanzine Horreur et Fantastique</p>
          </div>
          <a href="http://localhost:8180" target="_blank" className="bg-red-700 hover:bg-red-600 px-4 py-2 rounded text-sm font-medium transition">
            Connexion
          </a>
        </div>
      </header>

      <section className="max-w-6xl mx-auto px-8 py-12">
        <h2 className="text-2xl font-bold mb-8 text-red-400">Catalogue Produits</h2>

        {loading && (
          <div className="text-center text-gray-400 py-20">Chargement...</div>
        )}

        {error && (
          <div className="bg-red-900 border border-red-500 text-red-200 px-6 py-4 rounded">
            {error}
          </div>
        )}

        {!loading && !error && produits.length === 0 && (
          <div className="text-center text-gray-500 py-20">
            <p className="text-5xl mb-4">👻</p>
            <p>Aucun produit disponible pour le moment.</p>
          </div>
        )}

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
                  disabled={!produit.disponible}
                  className="mt-4 w-full bg-red-700 hover:bg-red-600 disabled:bg-gray-700 disabled:text-gray-500 py-2 rounded font-medium transition"
                >
                  {produit.disponible ? 'Ajouter au panier' : 'Indisponible'}
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
