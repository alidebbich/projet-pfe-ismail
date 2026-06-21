import { Navigate, Outlet } from 'react-router-dom';

export default function AdminRoute() {
  const role = localStorage.getItem('uib_role');
  
  if (role !== 'ROLE_ADMIN' && role !== 'ROLE_MANAGER') {
    return <Navigate to="/dashboard" replace />;
  }

  return <Outlet />;
}
