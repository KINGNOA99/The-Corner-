'use client';

import { useEffect, useState } from 'react';
import { collection, getDocs, query, where } from 'firebase/firestore';
import { db } from '@/lib/firebase';

interface Business {
  id: string;
  name: string;
  category: string;
  description: string;
  phone: string;
  area: string;
  status: string;
}

export default function Home() {
  const [businesses, setBusinesses] = useState<Business[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBusinesses = async () => {
      const q = query(collection(db, 'businesses'), where('status', '==', 'approved'));
      const snapshot = await getDocs(q);
      const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Business));
      setBusinesses(data);
      setLoading(false);
    };
    fetchBusinesses();
  }, []);

  return (
    <main className="min-h-screen bg-gray-50">
      <header className="bg-black text-white p-6">
        <h1 className="text-3xl font-bold">The Corner</h1>
        <p className="text-gray-400">Discover local businesses in Brits, Hartbeespoort & Mabopane</p>
      </header>

      <div className="max-w-6xl mx-auto p-6">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-2xl font-bold">Businesses</h2>
          <a href="/submit" className="bg-yellow-500 text-black px-4 py-2 rounded font-semibold">
            List Your Business
          </a>
        </div>

        {loading ? (
          <p>Loading...</p>
        ) : businesses.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg">No businesses listed yet.</p>
            <p className="text-gray-400">Be the first to join!</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {businesses.map(business => (
              <div key={business.id} className="bg-white rounded-lg shadow p-6">
                <h3 className="text-xl font-bold mb-2">{business.name}</h3>
                <span className="bg-yellow-100 text-yellow-800 text-sm px-2 py-1 rounded">
                  {business.category}
                </span>
                <p className="text-gray-600 mt-3">{business.description}</p>
                <div className="mt-4 text-sm text-gray-500">
                  <p>📍 {business.area}</p>
                  <p>📞 {business.phone}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
