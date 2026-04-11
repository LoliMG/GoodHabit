import { lazy, Suspense } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import PublicLayout from "../layouts/PublicLayout";
import UserLayout from "../layouts/UserLayout";
import PrivateRoute from "./PrivateRoute";
import PublicRoute from "./PublicRoute";

const Home = lazy(() => import("../pages/Home/Home"));
const Login = lazy(() => import("../pages/Login/Login"));
const Register = lazy(() => import("../pages/Register/Register"));
const Dashboard = lazy(() => import("../pages/Dashboard/Dashboard"));
const Habits = lazy(() => import("../pages/Habits/Habits"));
const Profile = lazy(() => import("../pages/Profile/Profile"));
const Notes = lazy(() => import("../pages/Notes/Notes"));
const Community = lazy(() => import("../pages/Community/Community"));
const PublicProfile = lazy(() => import("../pages/Community/PublicProfile"));

const AppRoutes = () => {
    return (
        <Router>
            <Suspense fallback={<div className="loading">Loading...</div>}>
                <Routes>
                    {/* Public Routes */}
                    <Route element={<PublicLayout />}>
                        <Route path="/" element={<Home />} />
                        
                        <Route element={<PublicRoute />}>
                            <Route path="/login" element={<Login />} />
                            <Route path="/register" element={<Register />} />
                        </Route>
                    </Route>

                    {/* Private Routes */}
                    <Route element={<PrivateRoute />}>
                        <Route element={<UserLayout />}>
                            <Route path="/dashboard" element={<Dashboard />} />
                            <Route path="/habits" element={<Habits />} />
                            <Route path="/profile" element={<Profile />} />
                            <Route path="/notes" element={<Notes />} />
                            <Route path="/community" element={<Community />} />
                            <Route path="/community/user/:userId" element={<PublicProfile />} />
                        </Route>
                    </Route>
                </Routes>
            </Suspense>
        </Router>
    );
};

export default AppRoutes;