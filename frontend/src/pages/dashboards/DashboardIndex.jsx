import React from 'react';
import { useAuth } from '../../context/AuthContext';
import { StaffDashboard } from './StaffDashboard';
import { ManagerDashboard } from './ManagerDashboard';
import { OwnerDashboard } from './OwnerDashboard';
import { AdminDashboard } from './AdminDashboard';

export function DashboardIndex() {
  const { user } = useAuth();

  if (!user) return null;

  switch (user.role) {
    case 'staff':
      return <StaffDashboard />;
    case 'manager':
      return <ManagerDashboard />;
    case 'owner':
      return <OwnerDashboard />;
    case 'admin':
      return <AdminDashboard />;
    default:
      return <div>Invalid Role</div>;
  }
}
