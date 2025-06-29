import React, { useEffect, useState } from 'react';
import { Card } from '../components/ui/card';
import { Badge } from '../components/ui/badge';

interface Outlet {
  id: number;
  name: string;
  location: string;
  contactNumber: string;
  managerName: string;
}

export default function Outlets() {
  const [outlets, setOutlets] = useState<Outlet[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/outlets')
      .then(res => res.json())
      .then(data => {
        setOutlets(data);
        setLoading(false);
      });
  }, []);

  return (
    <div className="max-w-5xl mx-auto py-8">
      <h1 className="text-3xl font-bold text-yellow-500 mb-6">Outlets</h1>
      <Card className="p-6 bg-white/10 rounded-xl shadow-lg border border-yellow-400">
        {loading ? (
          <div className="text-center py-8 text-yellow-700">Loading...</div>
        ) : (
          <table className="min-w-full rounded shadow bg-[#3b2412]">
            <thead className="bg-[#4e2e13]">
              <tr>
                <th className="p-4 text-left text-yellow-500">Name</th>
                <th className="p-4 text-left text-yellow-500">Location</th>
                <th className="p-4 text-left text-yellow-500">Contact Number</th>
                <th className="p-4 text-left text-yellow-500">Manager</th>
              </tr>
            </thead>
            <tbody>
              {outlets.map(outlet => (
                <tr key={outlet.id} className="border-b border-[#6b4a2b] hover:bg-[#4e2e13]/80 transition-colors group">
                  <td className="p-4 font-medium text-[#fbbf24]">{outlet.name}</td>
                  <td className="p-4 text-[#fbbf24]">{outlet.location}</td>
                  <td className="p-4 text-[#fbbf24]">{outlet.contactNumber}</td>
                  <td className="p-4 text-[#fbbf24]">{outlet.managerName}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </Card>
    </div>
  );
} 