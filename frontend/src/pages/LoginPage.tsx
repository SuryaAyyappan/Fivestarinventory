import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const LoginPage = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    try {
      const res = await axios.post('/api/auth/login', { username, password });
      login(res.data.token, res.data.role, res.data.username);
      navigate('/dashboard', { replace: true });
    } catch (err) {
      setError('Invalid username or password');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-chocolate-50">
      <form onSubmit={handleSubmit} className="bg-white p-8 rounded-xl shadow-xl w-full max-w-md">
        <h2 className="text-2xl font-bold mb-6 text-chocolate-800">Login</h2>
        {error && <div className="mb-4 text-red-600">{error}</div>}
        <div className="mb-4">
          <label className="block mb-1 text-chocolate-700">Username</label>
          <input type="text" value={username} onChange={e => setUsername(e.target.value)} className="w-full border rounded px-3 py-2" required />
        </div>
        <div className="mb-6">
          <label className="block mb-1 text-chocolate-700">Password</label>
          <input type="password" value={password} onChange={e => setPassword(e.target.value)} className="w-full border rounded px-3 py-2" required />
        </div>
        <button type="submit" className="w-full bg-chocolate-500 hover:bg-chocolate-600 text-white py-2 rounded font-semibold">Login</button>
      </form>
    </div>
  );
};

export default LoginPage; 