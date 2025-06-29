import React, { createContext, useContext, useState, useEffect } from 'react';

interface AuthContextType {
  token: string | null;
  role: string | null;
  username: string | null;
  login: (token: string, role: string, username: string) => void;
  logout: () => void;
  switchRole: (newRole: string) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [token, setToken] = useState<string | null>(null);
  const [role, setRole] = useState<string | null>(null);
  const [username, setUsername] = useState<string | null>(null);

  useEffect(() => {
    setToken(localStorage.getItem('token'));
    setRole(localStorage.getItem('role'));
    setUsername(localStorage.getItem('username'));
  }, []);

  const login = (token: string, role: string, username: string) => {
    setToken(token);
    setRole(role ? role.toUpperCase() : null);
    setUsername(username);
    localStorage.setItem('token', token);
    localStorage.setItem('role', role ? role.toUpperCase() : '');
    localStorage.setItem('username', username);
  };

  const logout = () => {
    setToken(null);
    setRole(null);
    setUsername(null);
    localStorage.removeItem('token');
    localStorage.removeItem('role');
    localStorage.removeItem('username');
  };

  const switchRole = (newRole: string) => {
    const validRoles = ['ADMIN', 'MAKER', 'CHECKER'];
    if (validRoles.includes(newRole.toUpperCase())) {
      setRole(newRole.toUpperCase());
      localStorage.setItem('role', newRole.toUpperCase());
    }
  };

  return (
    <AuthContext.Provider value={{ token, role, username, login, logout, switchRole }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider');
  return context;
}; 