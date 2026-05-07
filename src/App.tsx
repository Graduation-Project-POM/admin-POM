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
import { AdminRoute } from "./components/AdminRoute";
import { AdminApprovalsPage } from "./pages/admin/approval/ApprovalsPage";
import { AdminUsersPage } from "./pages/admin/users/UsersPage";
import { AdminProblemsPage } from "./pages/admin/problem/ProblemsPage";
import ContestsManager from "./pages/trainer/contests/ContestPage";
import StudentProblemsPage from "./pages/student/problem/ProblemsPage";
import StudentSubmissonsPage from "./pages/student/problem/SubmissonsPage";
import StudentContestsPage from "./pages/student/contest/ContestsPage";
import GroupsPage from "./pages/admin/group/groupPage";
import ContestsPage from "./pages/admin/contest/contestPage";
import CoursesPage from "./pages/trainer/groups/groupsPage";
import { ProblemBank } from "./pages/trainer/problem/problemPage";
import ProfilePage from "./pages/admin/profile/profilePage";

const USER_DATA = {
  ADMIN: { name: "Admin User", email: "admin@pmo.ps" },
  TRAINER: { name: "Trainer Ahmad", email: "ahmad@pmo.ps" },
  STUDENT: { name: "Student Sara", email: "sara@pmo.ps" },
};

function App() {
  const [role, setRole] = useState<UserRole>('ADMIN');

  return (
    <Router>
      <DashboardLayout
        role={role}
        userName={USER_DATA[role].name}
        userEmail={USER_DATA[role].email}
      >
        <Routes>
          {/* Admin Routes */}
          <Route
            path="/admin/dashboard"
            element={<Page title="Admin Dashboard" />}
          />
          <Route
            path="/admin/users"
            element={
              <AdminRoute role={role}>
                <AdminUsersPage />
              </AdminRoute>
            }
          />
          <Route path="/admin/approvals" element={<AdminApprovalsPage />} />
          <Route
            path="/admin/announcements"
            element={<Page title="Announcements" />}
          />
          <Route path="/admin/groups" element={<GroupsPage />} />
          <Route path="/admin/contests" element={<ContestsPage />} />
          <Route path="/admin/problems" element={<AdminProblemsPage />} />
          <Route
            path="/admin/reports"
            element={<Page title="System Reports" />}
          />
          <Route path="/admin/profile" element={<ProfilePage />} />
          {/* Trainer Routes */}
          <Route
            path="/trainer/dashboard"
            element={<Page title="Trainer Dashboard" />}
          />
          <Route path="/trainer/groups" element={<CoursesPage />} />
          <Route
            path="/trainer/contests"
            element={<ContestsManager />}
          />
          <Route path="/trainer/problems" element={<ProblemBank />} />
          <Route path="/trainer/profile" element={<ProfilePage />} />

          {/* Student Routes */}
          <Route
            path="/student/dashboard"
            element={<Page title="Student Dashboard" />}
          />
          <Route path="/student/groups" element={<Page title="My Groups" />} />
          <Route path="/student/contests" element={<StudentContestsPage />} />
          <Route path="/student/problems" element={<StudentProblemsPage />} />
          <Route
            path="/student/problems/submissions"
            element={<StudentSubmissonsPage />}
          />

          {/* Shared Routes */}
          <Route path="/settings" element={<Page title="Account Settings" />} />

          {/* Default Route redirects to role-specific dashboard */}
          <Route
            path="/"
            element={
              <Navigate
                to={
                  role === "ADMIN"
                    ? "/admin/dashboard"
                    : role === "TRAINER"
                      ? "/trainer/dashboard"
                      : "/student/dashboard"
                }
                replace
              />
            }
          />
          {/* Catch-all redirect */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </DashboardLayout>
    </Router>
  );
}
export default App;
