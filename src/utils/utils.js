import { Outlet, Navigate } from 'react-router-dom';

export function getCookie(name) {
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) {
    return parts.pop().split(';').shift();
  }
  return null; // Return null if the cookie is not found
}


const PrivateRoutes = () => {
    const isAuthenticated = localStorage.getItem('loggedIn') == 'true';

    return isAuthenticated ? <Outlet /> : <Navigate to="/" />;
};

export default PrivateRoutes;