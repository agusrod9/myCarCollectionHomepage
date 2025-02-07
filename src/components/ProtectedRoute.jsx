import { Navigate } from 'react-router-dom';

export default function ProtectedRoute({ user, Component }) {
  return user ? <Component /> : <Navigate to="/login" />;
}