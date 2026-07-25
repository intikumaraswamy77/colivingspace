import React from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Login from './pages/Login'
import Register from './pages/Register'
import OwnerDashboard from './pages/OwnerDashboard'
import TenantDashboard from './pages/TenantDashboard'
import AdminDashboard from './pages/AdminDashboard'
import Explore from './pages/Explore'
import PropertyDetails from './pages/PropertyDetails'
import ProfileSetup from './pages/ProfileSetup'
import FindRoommates from './pages/FindRoommates'
import Home from './pages/Home'
import ProtectedRoute from './components/ProtectedRoute'

// Layouts
import TenantLayout from './layouts/TenantLayout'
import PortalLayout from './layouts/PortalLayout'

function App() {
  return (
    <Router>
      <Routes>
        {/* TENANT / PUBLIC PORTAL */}
        <Route element={<TenantLayout />}>
          {/* Public Pages */}
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          {/* Protected Tenant Pages */}
          <Route element={<ProtectedRoute allowedRoles={['tenant']} />}>
            <Route path="/explore" element={<Explore />} />
            <Route path="/property/:id" element={<PropertyDetails />} />
            <Route path="/tenant-dashboard" element={<TenantDashboard />} />
            <Route path="/profile-setup" element={<ProfileSetup />} />
            <Route path="/find-roommates" element={<FindRoommates />} />
          </Route>
        </Route>

        {/* OWNER / ADMIN PORTAL */}
        <Route path="/portal" element={<PortalLayout />}>
          {/* Public Portal Pages */}
          <Route path="login" element={<Login />} />
          <Route path="register" element={<Register />} />
          
          {/* Protected Portal Pages */}
          <Route element={<ProtectedRoute allowedRoles={['owner', 'admin']} />}>
            <Route path="owner-dashboard" element={<OwnerDashboard />} />
          </Route>
          <Route element={<ProtectedRoute allowedRoles={['admin']} />}>
            <Route path="admin-dashboard" element={<AdminDashboard />} />
          </Route>
        </Route>
      </Routes>
    </Router>
  )
}

export default App
