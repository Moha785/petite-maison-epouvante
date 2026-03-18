'use client';

import { useRouter } from 'next/navigation';
import Navbar from '@/app/components/Navbar';

export default function PaiementAnnule() {
  const router = useRouter();

  return (
    <main className="min-h-screen bg-gray-950 text-white">
      <Navbar />
      <section className="max-w-2xl mx-auto px-8 py-24 text-center">
        <div className="bg-gray-900 border border-red-700 rounded-xl p-12">
          <p className="text-7xl mb-6">❌</p>
          <h1 className="text-3xl font-bold text-red-400 mb-4">Paiement annulé</h1>
          <p className="text-gray-400 mb-8">Votre paiement a été annulé. Votre panier est toujours disponible.</p>
          <button
            onClick={() => router.push('/')}
            className="bg-red-700 hover:bg-red-600 px-8 py-3 rounded font-medium transition"
          >
            Retour au catalogue
          </button>
        </div>
      </section>
    </main>
  );
}
