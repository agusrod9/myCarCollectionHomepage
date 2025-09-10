import { Navigate } from 'react-router';
import { AppContext } from '../context/AppContext';
import { useContext } from 'react';

export default function ProtectedRoute({ Component }) {
  const{loggedUserId, loggedUserName} = useContext(AppContext)
  return loggedUserId ? <Component loggedUserId={loggedUserId} loggedUserName= {loggedUserName} /> : <Navigate to="/login" />;
}