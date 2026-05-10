import "./App.css";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import type { UserRole } from "./types";
import { useState } from "react";
import { Page } from "./components/common/Page";
import { DashboardLayout } from "./components/layout/Dashboard";
import { AdminApprovalsPage } from "./pages/admin/approval/ApprovalsPage";
import AdminDashboard from "./pages/admin/dashboard/dashboardPage";
import TrainerDashboard from "./pages/trainer/dashboard/dashboard";
import { AdminUsersPage } from "./pages/admin/users/UsersPage";
import {ProblemsPage} from "./pages/common/problem/ProblemsPage";
import GroupsPage from "./pages/common/group/groupPage";
import ContestsPage from "./pages/common/contest/contestPage";
import StudentContestsPage from "./pages/student/contest/ContestsPage";
import {ProblemBank} from "./pages/student/problem/ProblemsPage";
import {MySubmissions} from "./pages/student/problem/SubmissonsPage";
import ProfilePage from "./pages/common/profile/profilePage";
import StudentGroupsPage from './pages/student/group/GroupsPage';
import StudentDashboardPage from './pages/student/dashboard/dashboard';


const USER_DATA = {
  ADMIN: { name: "Admin User", email: "admin@pmo.ps" },
  TRAINER: { name: "Trainer Ahmad", email: "ahmad@pmo.ps" },
  STUDENT: { name: "Student Sara", email: "sara@pmo.ps" },
};

function App() {
  const [role, setRole] = useState<UserRole>('TRAINER');

  return (
    <Router>
      <DashboardLayout 
        role={role} 
        userName={USER_DATA[role].name} 
        userEmail={USER_DATA[role].email}
      >
        <Routes>
          <Route path="/admin/dashboard" element={<AdminDashboard />} />
          <Route path="/admin/users" element={<AdminUsersPage />} />
          <Route path="/admin/approvals" element={<AdminApprovalsPage />} />
          <Route path="/admin/announcements" element={<Page title="Announcements" />} />
          <Route path="/admin/groups" element={<GroupsPage />} />
          <Route path="/admin/contests" element={<ContestsPage />} />
          <Route path="/admin/problems" element={<ProblemsPage />} />
          <Route path="/admin/reports" element={<Page title="System Reports" />} />
          <Route path="/admin/profile" element={<ProfilePage />} />

          <Route path="/trainer/dashboard" element={<TrainerDashboard />} />
          <Route path="/trainer/groups" element={<GroupsPage />} />
          <Route path="/trainer/contests" element={<ContestsPage />} />
          <Route path="/trainer/problems" element={<ProblemsPage />} />
          <Route path="/trainer/profile" element={<ProfilePage />} />

          {/* Student Routes */}
          <Route
            path="/student/dashboard"
            element={<StudentDashboardPage />} />
          <Route path="/student/groups" element={<StudentGroupsPage/>} />
          <Route path="/student/contests" element={<StudentContestsPage />} />
          <Route path="/student/problems" element={<ProblemBank />} />
          <Route
            path="/student/problems/submissions"
            element={<MySubmissions />}
          />
          <Route path="/student/profile" element={<ProfilePage />} />

          {/* Shared Routes */}
          <Route path="/settings" element={<Page title="Account Settings" />} />

          <Route 
            path="/" 
            element={
              <Navigate 
                to={role === 'ADMIN' ? '/admin/dashboard' : role === 'TRAINER' ? '/trainer/dashboard' : '/student/dashboard'} 
                replace 
              />
            } 
          />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </DashboardLayout>
    </Router>
  );
}
export default App;