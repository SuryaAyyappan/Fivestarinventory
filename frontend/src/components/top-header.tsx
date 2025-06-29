import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { LogOut, User, ChevronDown, Settings, Shield } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function TopHeader() {
  const navigate = useNavigate();
  const { logout, username, role, switchRole } = useAuth();
  const [showRoleMenu, setShowRoleMenu] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  const handleLogout = () => {
    logout();
    navigate('/login', { replace: true });
  };

  const handleRoleSwitch = (newRole: string) => {
    switchRole(newRole);
    setShowRoleMenu(false);
  };

  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setShowRoleMenu(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const getRoleColor = (role: string) => {
    switch (role?.toUpperCase()) {
      case 'ADMIN':
        return 'text-red-400';
      case 'MAKER':
        return 'text-blue-400';
      case 'CHECKER':
        return 'text-green-400';
      default:
        return 'text-gray-400';
    }
  };

  const getRoleIcon = (role: string) => {
    switch (role?.toUpperCase()) {
      case 'ADMIN':
        return '👑';
      case 'MAKER':
        return '🔨';
      case 'CHECKER':
        return '✅';
      default:
        return '👤';
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      className="fixed top-0 right-0 z-50 p-4 flex items-center space-x-4"
    >
      {/* Role Display & Switcher */}
      <div className="relative" ref={menuRef}>
        <button
          onClick={() => setShowRoleMenu(!showRoleMenu)}
          className="flex items-center space-x-2 bg-white/10 backdrop-blur-lg border border-white/20 rounded-lg px-4 py-2 hover:bg-white/20 transition-all duration-300"
        >
          <span className="text-lg">{getRoleIcon(role || '')}</span>
          <div className="text-left">
            <div className={`text-sm font-medium ${getRoleColor(role || '')}`}>
              {role?.toUpperCase() || 'USER'}
            </div>
            <div className="text-xs text-gray-300">{username}</div>
          </div>
          <ChevronDown className={`h-4 w-4 text-gray-300 transition-transform duration-300 ${showRoleMenu ? 'rotate-180' : ''}`} />
        </button>

        {/* Role Menu */}
        <AnimatePresence>
          {showRoleMenu && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: -10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: -10 }}
              transition={{ duration: 0.2 }}
              className="absolute top-full right-0 mt-2 w-64 bg-white/10 backdrop-blur-lg border border-white/20 rounded-lg shadow-2xl overflow-hidden"
            >
              <div className="p-4 border-b border-white/10">
                <div className="flex items-center space-x-2 mb-2">
                  <Shield className="h-4 w-4 text-primary" />
                  <span className="text-sm font-medium text-white">Current Role</span>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="text-lg">{getRoleIcon(role || '')}</span>
                  <div>
                    <div className={`text-sm font-medium ${getRoleColor(role || '')}`}>
                      {role?.toUpperCase() || 'USER'}
                    </div>
                    <div className="text-xs text-gray-300">Active Session</div>
                  </div>
                </div>
              </div>
              
              <div className="p-2">
                <div className="text-xs text-gray-400 mb-2 px-2">Switch Role</div>
                {['ADMIN', 'MAKER', 'CHECKER'].map((availableRole) => (
                  <button
                    key={availableRole}
                    onClick={() => handleRoleSwitch(availableRole)}
                    className={`w-full flex items-center space-x-2 px-3 py-2 rounded-lg cursor-pointer transition-all duration-200 ${
                      role?.toUpperCase() === availableRole
                        ? 'bg-primary/20 text-primary'
                        : 'hover:bg-white/10 text-gray-300 hover:text-white'
                    }`}
                  >
                    <span className="text-sm">{getRoleIcon(availableRole)}</span>
                    <span className="text-sm font-medium">{availableRole}</span>
                    {role?.toUpperCase() === availableRole && (
                      <div className="ml-auto w-2 h-2 bg-primary rounded-full"></div>
                    )}
                  </button>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Logout Button */}
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={handleLogout}
        className="flex items-center space-x-2 bg-red-500/20 hover:bg-red-500/30 backdrop-blur-lg border border-red-500/30 hover:border-red-500/50 rounded-lg px-4 py-2 transition-all duration-300 group"
      >
        <LogOut className="h-4 w-4 text-red-400 group-hover:text-red-300" />
        <span className="text-sm font-medium text-red-400 group-hover:text-red-300">Logout</span>
      </motion.button>
    </motion.div>
  );
} 