import { Navigate } from 'react-router';

export default function ProtectedRoute({ userId, userName, Component }) {
  return userId ? <Component loggedUserId={userId} loggedUserName= {userName} /> : <Navigate to="/login" />;
}