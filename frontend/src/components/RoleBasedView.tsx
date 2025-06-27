import React from 'react';
import { useAuth } from '../context/AuthContext';

interface RoleBasedViewProps {
  allowedRoles: string[];
  children: React.ReactNode;
}

const RoleBasedView: React.FC<RoleBasedViewProps> = ({ allowedRoles, children }) => {
  const { role } = useAuth();
  if (!role || !allowedRoles.includes(role)) return null;
  return <>{children}</>;
};

export default RoleBasedView; 