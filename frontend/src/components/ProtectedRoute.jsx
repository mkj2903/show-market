import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Loader } from 'lucide-react';

const ProtectedRoute = ({ children, adminOnly = false }) => {
  const { currentUser, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader className="h-8 w-8 text-blue-600 animate-spin" />
      </div>
    );
  }

  if (!currentUser) {
    return <Navigate to="/login" />;
  }

  // Additional check for admin-only routes
  if (adminOnly) {
    const adminToken = localStorage.getItem('adminToken');
    if (!adminToken) {
      return <Navigate to="/mohitaniljangra/login" />;
    }
  }

  return children;
};

export default ProtectedRoute;