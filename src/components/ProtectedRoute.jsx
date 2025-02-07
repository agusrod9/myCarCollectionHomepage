import { Navigate } from 'react-router';

export default function ProtectedRoute({ user, Component }) {
  return user ? <Component loggedUserId={user} /> : <Navigate to="/login" />;
}