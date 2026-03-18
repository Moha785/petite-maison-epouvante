'use client';

import { useEffect, useState, useRef } from 'react';
import { useKeycloak } from '@/hooks/useKeycloak';
import Navbar from '@/app/components/Navbar';

interface Annonce {
  id: number;
  titre: string;
  description: string;
  categorie: string;
  username: string;
  imageUrl: string;
  createdAt: string;
}

const CATEGORIES = ['VETEMENT', 'LIVRE', 'ACCESSOIRE', 'AUTRE'];

export default function Troc() {
  const { isAuthenticated, username, login, loading } = useKeycloak();
  const [annonces, setAnnonces] = useState<Annonce[]>([]);
  const [formulaireOuvert, setFormulaireOuvert] = useState(false);
  const [nouvelle, setNouvelle] = useState({ titre: '', description: '', categorie: 'VETEMENT', imageUrl: '' });
  const [succes, setSucces] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    fetch('http://localhost:8080/api/annonces')
      .then(res => res.json())
      .then(data => setAnnonces(data))
      .catch(() => {});
  }, []);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 2 * 1024 * 1024) { alert('Image trop grande ! Maximum 2MB.'); return; }
    const reader = new FileReader();
    reader.onloadend = () => setNouvelle(prev => ({ ...prev, imageUrl: reader.result as string }));
    reader.readAsDataURL(file);
  };

  const publierAnnonce = async () => {
    if (!nouvelle.titre || !nouvelle.description) { alert('Remplissez tous les champs !'); return; }
    try {
      const res = await fetch('http://localhost:8080/api/annonces', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...nouvelle, username }),
      });
      const data = await res.json();
      setAnnonces(prev => [data, ...prev]);
      setNouvelle({ titre: '', description: '', categorie: 'VETEMENT', imageUrl: '' });
      setFormulaireOuvert(false);
      setSucces(true);
      setTimeout(() => setSucces(false), 3000);
    } catch (e) {
      console.error('Erreur publication', e);
    }
  };

  const supprimerAnnonce = async (id: number) => {
    try {
      await fetch(`http://localhost:8080/api/annonces/${id}`, { method: 'DELETE' });
      setAnnonces(prev => prev.filter(a => a.id !== id));
    } catch (e) {
      console.error('Erreur suppression', e);
    }
  };

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' });
  };

  return (
    <main className="min-h-screen bg-gray-950 text-white">
      <Navbar />

      <section className="max-w-6xl mx-auto px-8 py-12">

        <div className="flex items-center justify-between mb-8">
          <h2 className="text-2xl font-bold text-red-400">🔄 Troc & Échange</h2>
          {!loading && (
            isAuthenticated ? (
              <button
                onClick={() => setFormulaireOuvert(!formulaireOuvert)}
                className="bg-red-700 hover:bg-red-600 px-6 py-3 rounded font-medium transition"
              >
                + Publier une annonce
              </button>
            ) : (
              <button onClick={login} className="bg-red-700 hover:bg-red-600 px-6 py-3 rounded font-medium transition">
                Connectez-vous pour publier
              </button>
            )
          )}
        </div>

        {succes && (
          <div className="bg-green-900 border border-green-600 text-green-200 px-6 py-3 rounded mb-6">
            ✅ Votre annonce a été publiée avec succès !
          </div>
        )}

        {!isAuthenticated && !loading && (
          <div className="bg-gray-900 border border-red-700 rounded-xl p-8 mb-8 text-center">
            <p className="text-5xl mb-4">🔒</p>
            <h2 className="text-xl font-bold mb-2">Espace réservé aux membres</h2>
            <p className="text-gray-400 mb-4">Connectez-vous pour publier vos annonces et échanger avec la communauté.</p>
            <button onClick={login} className="bg-red-700 hover:bg-red-600 px-6 py-3 rounded font-medium transition">
              Se connecter
            </button>
          </div>
        )}

        {formulaireOuvert && isAuthenticated && (
          <div className="bg-gray-900 border border-gray-700 rounded-xl p-6 mb-8">
            <h3 className="text-lg font-bold mb-6 text-red-400">📢 Nouvelle annonce</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="md:col-span-2">
                <label className="text-gray-400 text-xs uppercase tracking-widest mb-1 block">Titre</label>
                <input
                  type="text"
                  value={nouvelle.titre}
                  onChange={e => setNouvelle({...nouvelle, titre: e.target.value})}
                  className="w-full bg-gray-800 border border-gray-700 rounded px-4 py-2 text-white focus:outline-none focus:border-red-500"
                  placeholder="Ex: T-shirt Halloween taille M"
                />
              </div>
              <div>
                <label className="text-gray-400 text-xs uppercase tracking-widest mb-1 block">Catégorie</label>
                <select
                  value={nouvelle.categorie}
                  onChange={e => setNouvelle({...nouvelle, categorie: e.target.value})}
                  className="w-full bg-gray-800 border border-gray-700 rounded px-4 py-2 text-white focus:outline-none focus:border-red-500"
                >
                  {CATEGORIES.map(cat => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="text-gray-400 text-xs uppercase tracking-widest mb-1 block">Photo</label>
                <input type="file" accept="image/*" ref={fileInputRef} onChange={handleImageUpload} className="hidden" />
                <button
                  onClick={() => fileInputRef.current?.click()}
                  className="w-full bg-gray-800 border border-gray-700 rounded px-4 py-2 text-gray-400 hover:border-red-500 transition text-left"
                >
                  {nouvelle.imageUrl ? '✅ Image sélectionnée' : '📁 Choisir une image'}
                </button>
              </div>
              <div className="md:col-span-2">
                <label className="text-gray-400 text-xs uppercase tracking-widest mb-1 block">Description</label>
                <textarea
                  value={nouvelle.description}
                  onChange={e => setNouvelle({...nouvelle, description: e.target.value})}
                  rows={3}
                  className="w-full bg-gray-800 border border-gray-700 rounded px-4 py-2 text-white focus:outline-none focus:border-red-500"
                  placeholder="Décrivez votre article, son état, ce que vous recherchez en échange..."
                />
              </div>
            </div>
            <div className="flex gap-3 mt-6">
              <button onClick={publierAnnonce} className="flex-1 bg-red-700 hover:bg-red-600 py-3 rounded font-medium transition">
                📢 Publier
              </button>
              <button onClick={() => setFormulaireOuvert(false)} className="bg-gray-700 hover:bg-gray-600 px-6 py-3 rounded font-medium transition">
                Annuler
              </button>
            </div>
          </div>
        )}

        <p className="text-gray-500 text-sm mb-6">📋 {annonces.length} annonce{annonces.length > 1 ? 's' : ''}</p>

        {annonces.length === 0 ? (
          <div className="text-center text-gray-500 py-20">
            <p className="text-5xl mb-4">👻</p>
            <p>Aucune annonce pour le moment.</p>
            {isAuthenticated && (
              <button onClick={() => setFormulaireOuvert(true)} className="mt-4 bg-red-700 hover:bg-red-600 px-6 py-3 rounded font-medium transition">
                Soyez le premier à publier !
              </button>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {annonces.map(annonce => (
              <div key={annonce.id} className="bg-gray-900 border border-gray-800 rounded-lg overflow-hidden hover:border-red-700 transition">
                <div className="bg-gray-800 h-48 flex items-center justify-center overflow-hidden">
                  {annonce.imageUrl ? (
                    <img src={annonce.imageUrl} alt={annonce.titre} className="w-full h-full object-cover" />
                  ) : (
                    <span className="text-6xl">
                      {annonce.categorie === 'VETEMENT' ? '👕' :
                       annonce.categorie === 'LIVRE' ? '📚' :
                       annonce.categorie === 'ACCESSOIRE' ? '🎭' : '📦'}
                    </span>
                  )}
                </div>
                <div className="p-5">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs text-red-400 uppercase font-semibold">{annonce.categorie}</span>
                    <span className="text-xs text-gray-500">{annonce.createdAt ? formatDate(annonce.createdAt) : ''}</span>
                  </div>
                  <h3 className="text-lg font-bold mb-2">{annonce.titre}</h3>
                  <p className="text-gray-400 text-sm mb-4 line-clamp-3">{annonce.description}</p>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-500 text-xs">👤 {annonce.username}</span>
                    {annonce.username === username && (
                      <button
                        onClick={() => supprimerAnnonce(annonce.id)}
                        className="text-gray-500 hover:text-red-400 text-xs transition"
                      >
                        🗑 Supprimer
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      <footer className="border-t border-gray-800 text-center text-gray-600 py-6 text-sm">
        2026 La Petite Maison de Epouvante — Angouleme · Aix · Lyon · Londres
      </footer>
    </main>
  );
}
