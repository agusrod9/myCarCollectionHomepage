import { Navigate } from 'react-router';
import { AppContext } from '../context/AppContext';
import { useContext } from 'react';

export default function ProtectedRoute({ Component }) {
  const{loggedUserId, loggedUserName, loggedUserProfilePicture} = useContext(AppContext)
  return loggedUserId ? <Component loggedUserId={loggedUserId} loggedUserName= {loggedUserName} loggedUserProfilePicture= {loggedUserProfilePicture}/> : <Navigate to="/login" />;
}