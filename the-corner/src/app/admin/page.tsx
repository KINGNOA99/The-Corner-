'use client';
import { useEffect, useState } from 'react';
import { collection, getDocs, query, where, doc, updateDoc } from 'firebase/firestore';
import { onAuthStateChanged, signInWithEmailAndPassword, signOut, User } from 'firebase/auth';
import { db, auth } from '@/lib/firebase';

interface Business {
  id: string;
  name: string;
  category: string;
  description: string;
  phone: string;
  area: string;
  status: string;
  submittedAt: string;
}

export default function AdminPage() {
  const [user, setUser] = useState<User | null>(null);
  const [authLoading, setAuthLoading] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loginError, setLoginError] = useState('');

  const [pending, setPending] = useState<Business[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setAuthLoading(false);
    });
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    if (user) {
      fetchPending();
    }
  }, [user]);

  const fetchPending = async () => {
    setLoading(true);
    const q = query(collection(db, 'businesses'), where('status', '==', 'pending'));
    const snapshot = await getDocs(q);
    const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Business));
    setPending(data);
    setLoading(false);
  };

  const approve = async (id: string) => {
    await updateDoc(doc(db, 'businesses', id), { status: 'approved' });
    await fetchPending();
  };

  const reject = async (id: string) => {
    await updateDoc(doc(db, 'businesses', id), { status: 'rejected' });
    await fetchPending();
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError('');
    try {
      await signInWithEmailAndPassword(auth, email, password);
    } catch (err) {
      setLoginError('Invalid email or password.');
    }
  };

  const handleLogout = async () => {
    await signOut(auth);
  };

  if (authLoading) {
    return <main className="min-h-screen flex items-center justify-center"><p>Loading...</p></main>;
  }

  if (!user) {
    return (
      <main className="min-h-screen bg-gray-50 flex items-center justify-center p-8">
        <form onSubmit={handleLogin} className="bg-white p-8 rounded-lg shadow max-w-sm w-full space-y-4">
          <h1 className="text-2xl font-bold">Admin Login</h1>
          {loginError && <p className="text-red-600 text-sm">{loginError}</p>}
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full border rounded p-2"
            required
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full border rounded p-2"
            required
          />
          <button type="submit" className="w-full bg-yellow-500 font-semibold py-2 rounded">
            Log In
          </button>
        </form>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-gray-50 p-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Admin Dashboard</h1>
        <button onClick={handleLogout} className="text-sm text-gray-500 underline">
          Log out
        </button>
      </div>

      {loading ? (
        <p>Loading...</p>
      ) : pending.length === 0 ? (
        <p className="text-gray-500">No pending submissions.</p>
      ) : (
        <div className="space-y-4">
          {pending.map(business => (
            <div key={business.id} className="bg-white rounded-lg shadow p-6">
              <div className="flex justify-between items-start">
                <div>
                  <h2 className="text-xl font-bold">{business.name}</h2>
                  <span className="bg-yellow-100 text-yellow-800 text-sm px-2 py-1 rounded">
                    {business.category}
                  </span>
                  <p className="text-gray-600 mt-2">{business.description}</p>
                  <p className="text-sm text-gray-500 mt-2">
                    Area: {business.area} | Phone: {business.phone}
                  </p>
                </div>
                <div className="space-x-2">
                  <button
                    onClick={() => approve(business.id)}
                    className="bg-green-500 text-white px-4 py-2 rounded font-semibold"
                  >
                    Approve
                  </button>
                  <button
                    onClick={() => reject(business.id)}
                    className="bg-red-500 text-white px-4 py-2 rounded font-semibold"
                  >
                    Reject
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </main>
  );
}
