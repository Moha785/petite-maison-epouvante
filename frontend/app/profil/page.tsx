'use client';

import { useEffect, useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { useKeycloak } from '@/hooks/useKeycloak';

interface ArticlePanier {
  produit: {
    id: number;
    nom: string;
    prix: number;
    categorie: string;
  };
  quantite: number;
}

interface ProfilData {
  username: string;
  avatarUrl: string;
  bio: string;
  ville: string;
  prenom: string;
  nom: string;
}

export default function Profil() {
  const { isAuthenticated, username, roles, logout, loading } = useKeycloak();
  const router = useRouter();
  const [panier, setPanier] = useState<ArticlePanier[]>([]);
  const [profil, setProfil] = useState<ProfilData>({
    username: '',
    avatarUrl: '',
    bio: '',
    ville: '',
    prenom: '',
    nom: '',
  });
  const [modeEdition, setModeEdition] = useState(false);
  const [sauvegarde, setSauvegarde] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!loading && !isAuthenticated) router.push('/');
  }, [loading, isAuthenticated, router]);

  useEffect(() => {
    const saved = localStorage.getItem('panier');
    if (saved) setPanier(JSON.parse(saved));
  }, []);

  useEffect(() => {
    if (username) {
      fetch(`http://localhost:8080/api/profil/${username}`)
        .then(res => res.json())
        .then(data => setProfil(data))
        .catch(() => {});
    }
  }, [username]);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 2 * 1024 * 1024) {
      alert('Image trop grande ! Maximum 2MB.');
      return;
    }
    const reader = new FileReader();
    reader.onloadend = () => {
      setProfil(prev => ({ ...prev, avatarUrl: reader.result as string }));
    };
    reader.readAsDataURL(file);
  };

  const sauvegarderProfil = async () => {
    try {
      await fetch(`http://localhost:8080/api/profil/${username}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(profil),
      });
      setSauvegarde(true);
      setModeEdition(false);
      setTimeout(() => setSauvegarde(false), 3000);
    } catch (e) {
      console.error('Erreur sauvegarde', e);
    }
  };

  const totalPanier = panier.reduce((acc, a) => acc + a.produit.prix * a.quantite, 0);
  const nbArticles = panier.reduce((acc, a) => acc + a.quantite, 0);

  if (loading) return (
    <div className="min-h-screen bg-gray-950 text-white flex items-center justify-center">
      Chargement...
    </div>
  );

  const initiale = username?.charAt(0).toUpperCase() || '?';

  return (
    <main className="min-h-screen bg-gray-950 text-white">
      <header className="bg-gray-900 border-b border-red-800 py-6 px-8">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div>
            <button onClick={() => router.push('/')} className="text-gray-400 hover:text-white text-sm mb-2 flex items-center gap-2">
              ← Retour au catalogue
            </button>
            <h1 className="text-3xl font-bold text-red-500">La Petite Maison de Epouvante</h1>
          </div>
          <button onClick={logout} className="bg-gray-700 hover:bg-gray-600 px-4 py-2 rounded text-sm font-medium transition">
            Déconnexion
          </button>
        </div>
      </header>

      <section className="max-w-4xl mx-auto px-8 py-12">

        {sauvegarde && (
          <div className="bg-green-900 border border-green-600 text-green-200 px-6 py-3 rounded mb-6">
            ✅ Profil sauvegardé avec succès !
          </div>
        )}

        <div className="flex items-center gap-6 bg-gradient-to-r from-gray-900 to-gray-800 border border-gray-700 rounded-xl px-8 py-6 mb-8 shadow-lg">
          <div className="relative">
            {profil.avatarUrl ? (
              <img src={profil.avatarUrl} alt="Avatar" className="w-20 h-20 rounded-full object-cover border-2 border-red-700" />
            ) : (
              <div className="bg-red-700 rounded-full w-20 h-20 flex items-center justify-center text-4xl font-bold shadow-md">
                {initiale}
              </div>
            )}
          </div>
          <div>
            <h2 className="text-2xl font-bold text-white">
              {profil.prenom || profil.nom ? `${profil.prenom} ${profil.nom}` : username}
            </h2>
            <p className="text-gray-400 text-sm mt-1">{profil.bio || 'Membre de La Petite Maison de l\'Épouvante'}</p>
            {profil.ville && <p className="text-gray-500 text-xs mt-1">📍 {profil.ville}</p>}
            <div className="flex gap-2 mt-2">
              {roles.includes('admin') && (
                <span className="bg-red-900 text-red-300 text-xs px-3 py-1 rounded-full border border-red-700">👑 Admin</span>
              )}
              <span className="bg-gray-700 text-gray-300 text-xs px-3 py-1 rounded-full">✓ Membre actif</span>
            </div>
          </div>
          <button
            onClick={() => setModeEdition(!modeEdition)}
            className="ml-auto bg-gray-700 hover:bg-gray-600 px-4 py-2 rounded text-sm font-medium transition"
          >
            {modeEdition ? 'Annuler' : '✏️ Modifier'}
          </button>
        </div>

        {modeEdition && (
          <div className="bg-gray-900 border border-gray-700 rounded-xl p-6 mb-8">
            <h3 className="text-lg font-bold mb-6 text-red-400">✏️ Modifier mon profil</h3>

            <div className="flex items-center gap-6 mb-6 p-4 bg-gray-800 rounded-xl border border-gray-700">
              {profil.avatarUrl ? (
                <img src={profil.avatarUrl} alt="Avatar" className="w-16 h-16 rounded-full object-cover border-2 border-red-700" />
              ) : (
                <div className="bg-red-700 rounded-full w-16 h-16 flex items-center justify-center text-2xl font-bold">
                  {initiale}
                </div>
              )}
              <div>
                <p className="text-gray-400 text-sm mb-2">Photo de profil</p>
                <input
                  type="file"
                  accept="image/*"
                  ref={fileInputRef}
                  onChange={handleImageUpload}
                  className="hidden"
                />
                <button
                  onClick={() => fileInputRef.current?.click()}
                  className="bg-red-700 hover:bg-red-600 px-4 py-2 rounded text-sm font-medium transition"
                >
                  📁 Choisir une image
                </button>
                {profil.avatarUrl && (
                  <button
                    onClick={() => setProfil(prev => ({ ...prev, avatarUrl: '' }))}
                    className="ml-2 bg-gray-700 hover:bg-gray-600 px-4 py-2 rounded text-sm font-medium transition"
                  >
                    🗑 Supprimer
                  </button>
                )}
                <p className="text-gray-500 text-xs mt-1">JPG, PNG — max 2MB</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-gray-400 text-xs uppercase tracking-widest mb-1 block">Prénom</label>
                <input
                  type="text"
                  value={profil.prenom || ''}
                  onChange={e => setProfil({...profil, prenom: e.target.value})}
                  className="w-full bg-gray-800 border border-gray-700 rounded px-4 py-2 text-white focus:outline-none focus:border-red-500"
                  placeholder="Votre prénom"
                />
              </div>
              <div>
                <label className="text-gray-400 text-xs uppercase tracking-widest mb-1 block">Nom</label>
                <input
                  type="text"
                  value={profil.nom || ''}
                  onChange={e => setProfil({...profil, nom: e.target.value})}
                  className="w-full bg-gray-800 border border-gray-700 rounded px-4 py-2 text-white focus:outline-none focus:border-red-500"
                  placeholder="Votre nom"
                />
              </div>
              <div>
                <label className="text-gray-400 text-xs uppercase tracking-widest mb-1 block">Ville</label>
                <input
                  type="text"
                  value={profil.ville || ''}
                  onChange={e => setProfil({...profil, ville: e.target.value})}
                  className="w-full bg-gray-800 border border-gray-700 rounded px-4 py-2 text-white focus:outline-none focus:border-red-500"
                  placeholder="Votre ville"
                />
              </div>
              <div className="md:col-span-2">
                <label className="text-gray-400 text-xs uppercase tracking-widest mb-1 block">Bio</label>
                <textarea
                  value={profil.bio || ''}
                  onChange={e => setProfil({...profil, bio: e.target.value})}
                  rows={3}
                  className="w-full bg-gray-800 border border-gray-700 rounded px-4 py-2 text-white focus:outline-none focus:border-red-500"
                  placeholder="Parlez-nous de vous..."
                />
              </div>
            </div>
            <button
              onClick={sauvegarderProfil}
              className="mt-6 w-full bg-red-700 hover:bg-red-600 py-3 rounded font-medium transition"
            >
              💾 Sauvegarder les modifications
            </button>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <div className="bg-gray-900 border border-gray-800 rounded-xl p-6 text-center">
            <p className="text-4xl font-bold text-red-400">{nbArticles}</p>
            <p className="text-gray-400 text-sm mt-1">Articles dans le panier</p>
          </div>
          <div className="bg-gray-900 border border-gray-800 rounded-xl p-6 text-center">
            <p className="text-4xl font-bold text-red-400">{totalPanier.toFixed(2)} €</p>
            <p className="text-gray-400 text-sm mt-1">Total panier</p>
          </div>
          <div className="bg-gray-900 border border-gray-800 rounded-xl p-6 text-center">
            <p className="text-4xl font-bold text-red-400">{panier.length}</p>
            <p className="text-gray-400 text-sm mt-1">Produits différents</p>
          </div>
        </div>

        {panier.length > 0 && (
          <div className="bg-gray-900 border border-gray-800 rounded-xl p-6 mb-8">
            <h3 className="text-lg font-bold mb-4 text-red-400">🛒 Mon Panier actuel</h3>
            {panier.map(article => (
              <div key={article.produit.id} className="flex items-center justify-between py-3 border-b border-gray-800 last:border-0">
                <div>
                  <p className="font-medium">{article.produit.nom}</p>
                  <p className="text-gray-500 text-xs">{article.produit.categorie}</p>
                </div>
                <div className="text-right">
                  <p className="text-red-400 font-bold">{(article.produit.prix * article.quantite).toFixed(2)} €</p>
                  <p className="text-gray-500 text-xs">x{article.quantite}</p>
                </div>
              </div>
            ))}
            <div className="flex justify-between font-bold text-lg mt-4 pt-4 border-t border-gray-700">
              <span>Total</span>
              <span className="text-red-400">{totalPanier.toFixed(2)} €</span>
            </div>
            <button onClick={() => router.push('/')} className="mt-4 w-full bg-red-700 hover:bg-red-600 py-3 rounded font-medium transition">
              Commander
            </button>
          </div>
        )}

        <div className="bg-gray-900 border border-gray-800 rounded-xl p-6">
          <h3 className="text-lg font-bold mb-4 text-red-400">⚙️ Informations du compte</h3>
          <div className="space-y-3">
            <div className="flex justify-between py-2 border-b border-gray-800">
              <span className="text-gray-400">Nom d'utilisateur</span>
              <span className="font-medium">{username}</span>
            </div>
            <div className="flex justify-between py-2 border-b border-gray-800">
              <span className="text-gray-400">Rôle</span>
              <span className="font-medium">{roles.includes('admin') ? 'Administrateur' : 'Client'}</span>
            </div>
            <div className="flex justify-between py-2">
              <span className="text-gray-400">Statut</span>
              <span className="text-green-400 font-medium">✓ Actif</span>
            </div>
          </div>
        </div>

      </section>
    </main>
  );
}
