import React from "react";
import "./App.css";
import MainNavigation from "./shared/components/Navigation/MainNavigation";
import { AuthContext } from "./shared/context/auth-context";
import { Navigate, BrowserRouter as Router, useRoutes } from "react-router-dom";
//import Users from "./user/pages/Users";
//import UserPlaces from "./places/pages/UserPlaces";
//import NewPlace from "./places/pages/NewPlace";
//import UpdatePlace from "./places/pages/UpdatePlace";
//import Auth from "./user/pages/Auth";
import { useAuth } from "./shared/hooks/auth-hook";
import { Suspense } from "react";
import LoadingSpinner from "./shared/components/UIElements/LoadingSpinner";

const Users = React.lazy(() => import("./user/pages/Users"));
const NewPlace = React.lazy(() => import("./places/pages/NewPlace"));
const UserPlaces = React.lazy(() => import("./places/pages/UserPlaces"));
const UpdatePlace = React.lazy(() => import("./places/pages/UpdatePlace"));
const Auth = React.lazy(() => import("./user/pages/Auth"));

const AppRoutes = ({ isLoggedIn }) => {
  const routes = isLoggedIn
    ? [
        { path: "/", element: <Users /> },
        { path: "/:userId/places", element: <UserPlaces /> },
        { path: "/places/new", element: <NewPlace /> },
        { path: "/places/:placeId", element: <UpdatePlace /> },
        { path: "*", element: <Navigate to="/" replace /> },
      ]
    : [
        { path: "/", element: <Users /> },
        { path: "/:userId/places", element: <UserPlaces /> },
        { path: "/auth", element: <Auth /> },
        { path: "*", element: <Navigate to="/auth" replace /> },
      ];
  return useRoutes(routes);
};

function App() {
  const { token, login, logout, userId } = useAuth();

  return (
    <>
      <AuthContext.Provider
        value={{
          isLoggedIn: !!token,
          token: token,
          userId: userId,
          login: login,
          logout: logout,
        }}
      >
        <Router>
          <MainNavigation />
          <main>
            <Suspense
              fallback={
                <div className="center">
                  <LoadingSpinner />
                </div>
              }
            >
              <AppRoutes isLoggedIn={!!token} />
            </Suspense>
          </main>
        </Router>
      </AuthContext.Provider>
    </>
  );
}

export default App;
