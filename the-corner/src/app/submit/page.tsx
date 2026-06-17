'use client';

import { useState } from 'react';
import { collection, addDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';

export default function SubmitPage() {
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    const form = e.target as HTMLFormElement;
    const formData = new FormData(form);
    
    await addDoc(collection(db, 'businesses'), {
      name: formData.get('name'),
      category: formData.get('category'),
      description: formData.get('description'),
      phone: formData.get('phone'),
      whatsapp: formData.get('whatsapp'),
      email: formData.get('email'),
      address: formData.get('address'),
      area: formData.get('area'),
      status: 'pending',
      submittedAt: new Date().toISOString()
    });
    
    setLoading(false);
    setSubmitted(true);
  };

  if (submitted) {
    return (
      <main className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <h1 className="text-3xl font-bold mb-4">Thank You!</h1>
          <p className="text-gray-600">Your business has been submitted for review.</p>
          <a href="/" className="text-yellow-600 font-semibold mt-4 inline-block">Back to Home</a>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-2xl mx-auto bg-white rounded-lg shadow p-8">
        <h1 className="text-3xl font-bold mb-2">List Your Business</h1>
        <p className="text-gray-500 mb-8">Join The Corner platform</p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block font-semibold mb-1">Business Name</label>
            <input name="name" required className="w-full border rounded px-3 py-2" />
          </div>

          <div>
            <label className="block font-semibold mb-1">Category</label>
            <select name="category" required className="w-full border rounded px-3 py-2">
              <option>Food & Drinks</option>
              <option>Home Services</option>
              <option>Beauty & Wellness</option>
              <option>Retail & Shopping</option>
              <option>Automotive</option>
              <option>Professional Services</option>
            </select>
          </div>

          <div>
            <label className="block font-semibold mb-1">Description</label>
            <textarea name="description" required rows={3} className="w-full border rounded px-3 py-2" />
          </div>

          <div>
            <label className="block font-semibold mb-1">Phone</label>
            <input name="phone" required className="w-full border rounded px-3 py-2" />
          </div>

          <div>
            <label className="block font-semibold mb-1">WhatsApp (optional)</label>
            <input name="whatsapp" className="w-full border rounded px-3 py-2" />
          </div>

          <div>
            <label className="block font-semibold mb-1">Email (optional)</label>
            <input name="email" type="email" className="w-full border rounded px-3 py-2" />
          </div>

          <div>
            <label className="block font-semibold mb-1">Address</label>
            <input name="address" required className="w-full border rounded px-3 py-2" />
          </div>

          <div>
            <label className="block font-semibold mb-1">Area</label>
            <select name="area" required className="w-full border rounded px-3 py-2">
              <option>Brits</option>
              <option>Hartbeespoort</option>
              <option>Mabopane</option>
            </select>
          </div>

          <button 
            type="submit" 
            disabled={loading}
            className="w-full bg-yellow-500 text-black font-bold py-3 rounded hover:bg-yellow-400 disabled:opacity-50"
          >
            {loading ? 'Submitting...' : 'Submit for Review'}
          </button>
        </form>
      </div>
    </main>
  );
}
