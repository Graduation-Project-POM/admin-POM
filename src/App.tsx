import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import type { UserRole } from './types';
import { useState } from 'react';
import { Page } from './components/common/Page';
import { DashboardLayout } from './components/layout/Dashboard';

const USER_DATA = {
  ADMIN: { name: 'Admin User', email: 'admin@pmo.ps' },
  TRAINER: { name: 'Trainer Ahmad', email: 'ahmad@pmo.ps' },
  STUDENT: { name: 'Student Sara', email: 'sara@pmo.ps' },
};

function App() {
  const [role] = useState<UserRole>('ADMIN');

  return (
    <Router>

      <DashboardLayout 
        role={role} 
        userName={USER_DATA[role].name} 
        userEmail={USER_DATA[role].email}
      >
        <Routes>
          {/* Admin Routes */}
          <Route path="/dashboard" element={<Page title="Admin Dashboard" />} />
          <Route path="/admin/users" element={<Page title="User Management" />} />
          <Route path="/admin/approvals" element={<Page title="Pending Approvals" />} />
          <Route path="/admin/announcements" element={<Page title="Announcements" />} />
          <Route path="/admin/groups" element={<Page title="Training Groups" />} />
          <Route path="/contests" element={<Page title="Olympiad Contests" />} />
          <Route path="/problems" element={<Page title="Problem Bank" />} />
          <Route path="/admin/reports" element={<Page title="System Reports" />} />

          {/* Trainer Routes */}
          <Route path="/trainer/dashboard" element={<Page title="Trainer Dashboard" />} />
          <Route path="/groups" element={<Page title="My Training Groups" />} />
          <Route path="/contests" element={<Page title="My Contests" />} />
          <Route path="/problems" element={<Page title="Problem Management" />} />

          {/* Student Routes */}
          <Route path="/student/dashboard" element={<Page title="Student Dashboard" />} />
          <Route path="/groups" element={<Page title="My Groups" />} />
          <Route path="/contests" element={<Page title="Active Contests" />} />
          <Route path="/student/practice" element={<Page title="Practice Arena" />} />

          {/* Shared Routes */}
          <Route path="/settings" element={<Page title="Account Settings" />} />
          <Route path="/profile" element={<Page title="User Profile" />} />

          {/* Default Route redirects to role-specific dashboard */}
          <Route 
            path="/" 
            element={
              <Navigate 
                to={role === 'ADMIN' ? '/admin/dashboard' : role === 'TRAINER' ? '/trainer/dashboard' : '/student/dashboard'} 
                replace 
              />
            } 
          />
          {/* Catch-all redirect */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
       </DashboardLayout>
     </Router>
  )
} 
export default App;
