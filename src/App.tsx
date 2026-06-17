import "./App.css";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
  Outlet,
} from "react-router-dom";
import { Page } from "./components/common/Page";
import { DashboardLayout } from "./components/layout/Dashboard";
import { AdminApprovalsPage } from "./pages/admin/approval/ApprovalsPage";
import AdminDashboard from "./pages/admin/dashboard/dashboardPage";
import { AdminUsersPage } from "./pages/admin/users/UsersPage";
import TrainerDashboard from "./pages/trainer/dashboard/dashboard";
import { ProblemsPage } from "./pages/common/problem/ProblemsPage";
import GroupsPage from "./pages/common/group/groupPage";
import ContestsPage from "./pages/common/contest/contestPage";
import StudentContestsPage from "./pages/student/contest/ContestsPage";
import { ProblemBank } from "./pages/student/problem/ProblemsPage";
import { MySubmissions } from "./pages/student/problem/SubmissonsPage";
import ProfilePage from "./pages/common/profile/profilePage";
import StudentGroupsPage from "./pages/student/group/GroupsPage";
import StudentDashboardPage from "./pages/student/dashboard/dashboard";
import Signup from "./components/Credentials/signup/signup";
import Login from "./components/Credentials/Login/login";
import { AuthProvider, useAuth } from "./services/AuthContext";
import type { UserRole } from "./types";

function AppRoutes() {
  const { role, userName, token } = useAuth();

  function RequireRole({ allow }: { allow: UserRole[] }) {
    const { role } = useAuth();
    // logged in but wrong role → send them back to their own area
    if (!role || !allow.includes(role)) {
      return <Navigate to="/" replace />;
    }
    return <Outlet />;
  }
  return (
    <Routes>
      <Route path="/credentials/login" element={<Login />} />
      <Route path="/credentials/signup" element={<Signup />} />

      <Route
        path="/*"
        element={
          !token || !role ? (
            <Navigate to="/credentials/login" replace />
          ) : (
            <DashboardLayout role={role} userName={userName ?? ""}>
              <Routes>
                {/* Admin-only */}
                <Route element={<RequireRole allow={["Admin"]} />}>
                  <Route path="/admin/dashboard" element={<AdminDashboard />} />
                  <Route path="/admin/users" element={<AdminUsersPage />} />
                  <Route
                    path="/admin/approvals"
                    element={<AdminApprovalsPage />}
                  />
                  <Route
                    path="/admin/announcements"
                    element={<Page title="Announcements" />}
                  />
                  <Route path="/admin/groups" element={<GroupsPage />} />
                  <Route path="/admin/contests" element={<ContestsPage />} />
                  <Route path="/admin/problems" element={<ProblemsPage />} />
                  <Route
                    path="/admin/reports"
                    element={<Page title="System Reports" />}
                  />
                  <Route path="/admin/profile" element={<ProfilePage />} />
                </Route>

                {/* Trainer-only */}
                <Route element={<RequireRole allow={["Trainer"]} />}>
                  <Route
                    path="/trainer/dashboard"
                    element={<TrainerDashboard />}
                  />
                  <Route path="/trainer/groups" element={<GroupsPage />} />
                  <Route path="/trainer/contests" element={<ContestsPage />} />
                  <Route path="/trainer/problems" element={<ProblemsPage />} />
                  <Route path="/trainer/profile" element={<ProfilePage />} />
                </Route>

                {/* Student-only */}
                <Route element={<RequireRole allow={["Student"]} />}>
                  <Route
                    path="/student/dashboard"
                    element={<StudentDashboardPage />}
                  />
                  <Route
                    path="/student/groups"
                    element={<StudentGroupsPage />}
                  />
                  <Route
                    path="/student/contests"
                    element={<StudentContestsPage />}
                  />
                  <Route path="/student/problems" element={<ProblemBank />} />
                  <Route
                    path="/student/problems/submissions"
                    element={<MySubmissions />}
                  />
                  <Route path="/student/profile" element={<ProfilePage />} />
                </Route>

                {/* Shared - any logged-in role */}
                <Route
                  path="/settings"
                  element={<Page title="Account Settings" />}
                />

                <Route
                  path="/"
                  element={
                    <Navigate
                      to={
                        role === "Admin"
                          ? "/admin/dashboard"
                          : role === "Trainer"
                            ? "/trainer/dashboard"
                            : "/student/dashboard"
                      }
                      replace
                    />
                  }
                />
                <Route path="*" element={<Navigate to="/" replace />} />
              </Routes>
            </DashboardLayout>
          )
        }
      />
    </Routes>
  );
}

function App() {
  return (
    <AuthProvider>
      <Router>
        <AppRoutes />
      </Router>
    </AuthProvider>
  );
}

export default App;
