import { useAuth } from '../../contexts/AuthContext';
import { Navigate } from 'react-router-dom';

const PrivateRoute = ({ children }) => {
  const { signed } = useAuth();

  if (!signed) {
    return <Navigate to="/" replace />;
  }

  return children;
};

export default PrivateRoute; 