import React from 'react';
import { Outlet } from 'react-router-dom';

const PortalLayout = () => {
  return (
    <div className="min-h-screen flex flex-col bg-slate-900">
      {/* Portal Layout doesn't have a consumer top navbar. 
          The Dashboards themselves handle their own Sidebar navigation. */}
      <Outlet />
    </div>
  );
};

export default PortalLayout;
