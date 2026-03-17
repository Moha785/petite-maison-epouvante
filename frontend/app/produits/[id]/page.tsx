'use client';

import { useEffect, useState } from 'react';
import { useKeycloak } from '@/hooks/useKeycloak';
import { useParams, useRouter } from 'next/navigation';

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

const ajouterAuPanierStorage = (produit: Produit) => {
  try {
    const saved = localStorage.getItem('panier');
    const panier: ArticlePanier[] = saved ? JSON.parse(saved) : [];
    const existant = panier.find(a => a.produit.id === produit.id);
    if (existant) {
      const updated = panier.map(a => a.produit.id === produit.id ? { ...a, quantite: a.quantite + 1 } : a);
      localStorage.setItem('panier', JSON.stringify(updated));
    } else {
      localStorage.setItem('panier', JSON.stringify([...panier, { produit, quantite: 1 }]));
    }
  } catch (e) {
    console.error('Erreur panier', e);
  }
};

export default function DetailProduit() {
  const { id } = useParams();
  const router = useRouter();
  const { isAuthenticated, login } = useKeycloak();
  const [produit, setProduit] = useState<Produit | null>(null);
  const [loading, setLoading] = useState(true);
  const [ajoute, setAjoute] = useState(false);

  useEffect(() => {
    fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080'}/api/produits/${id}`)
      .then(res => res.json())
      .then(data => { setProduit(data); setLoading(false); })
      .catch(() => setLoading(false));
  }, [id]);

  const handleAjouterAuPanier = () => {
    if (!isAuthenticated) { login(); return; }
    if (!produit) return;
    ajouterAuPanierStorage(produit);
    setAjoute(true);
    setTimeout(() => setAjoute(false), 2000);
  };

  if (loading) return (
    <div className="min-h-screen bg-gray-950 text-white flex items-center justify-center">
      Chargement...
    </div>
  );

  if (!produit) return (
    <div className="min-h-screen bg-gray-950 text-white flex items-center justify-center">
      Produit introuvable
    </div>
  );

  return (
    <main className="min-h-screen bg-gray-950 text-white">
      <header className="bg-gray-900 border-b border-red-800 py-6 px-8">
        <div className="max-w-6xl mx-auto">
          <button onClick={() => router.back()} className="text-gray-400 hover:text-white text-sm mb-2 flex items-center gap-2">
            ← Retour au catalogue
          </button>
          <h1 className="text-3xl font-bold text-red-500">La Petite Maison de Epouvante</h1>
        </div>
      </header>

      <section className="max-w-4xl mx-auto px-8 py-12">
        <div className="bg-gray-900 border border-gray-800 rounded-lg overflow-hidden grid grid-cols-1 md:grid-cols-2 gap-0">
          <div className="bg-gray-800 flex items-center justify-center text-9xl p-16">
            {produit.categorie === 'VETEMENT' ? '👕' :
             produit.categorie === 'LIVRE' ? '📚' :
             produit.categorie === 'ACCESSOIRE' ? '🎭' : '🛒'}
          </div>
          <div className="p-8">
            <span className="text-xs text-red-400 uppercase font-semibold">{produit.categorie}</span>
            <h2 className="text-3xl font-bold mt-2 mb-4">{produit.nom}</h2>
            <p className="text-gray-400 mb-6 leading-relaxed">{produit.description}</p>
            <div className="border-t border-gray-700 pt-6 mb-6">
              <div className="flex justify-between mb-2">
                <span className="text-gray-400">Prix</span>
                <span className="text-2xl font-bold text-red-400">{produit.prix.toFixed(2)} €</span>
              </div>
              <div className="flex justify-between mb-2">
                <span className="text-gray-400">Stock disponible</span>
                <span className={produit.stock > 10 ? 'text-green-400' : 'text-orange-400'}>
                  {produit.stock} unités
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Disponibilité</span>
                <span className={produit.disponible ? 'text-green-400' : 'text-red-400'}>
                  {produit.disponible ? '✅ En stock' : '❌ Indisponible'}
                </span>
              </div>
            </div>
            <button
              onClick={handleAjouterAuPanier}
              disabled={!produit.disponible}
              className={`w-full py-3 rounded font-medium transition ${
                ajoute ? 'bg-green-700' :
                produit.disponible ? 'bg-red-700 hover:bg-red-600' : 'bg-gray-700 text-gray-500'
              }`}
            >
              {ajoute ? '✅ Ajouté au panier !' :
               !produit.disponible ? 'Indisponible' :
               isAuthenticated ? 'Ajouter au panier' : 'Connectez-vous pour acheter'}
            </button>
          </div>
        </div>
      </section>
    </main>
  );
}
