import React from 'react';
import { Outlet, Link, useNavigate, useLocation } from 'react-router-dom';
import { Building2 } from 'lucide-react';

const PortalLayout = () => {
  const userInfo = JSON.parse(localStorage.getItem('userInfo'));
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('userInfo');
    navigate('/', { replace: true });
  };

  return (
    <div className="min-h-screen bg-slate-900 flex flex-col font-sans">
      <div className="flex-1 flex flex-col">
        <Outlet />
      </div>
    </div>
  );
};

export default PortalLayout;
