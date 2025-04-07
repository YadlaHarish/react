import { useAuth } from '../auth/AuthContext';

export default function Home() {
  const { user, logout } = useAuth();

  return (
    <div>
      <h1>Welcome, {user?.name}</h1>
      <p>Email: {user?.email}</p>
      <p>Login ID: {user?.login_id}</p> {/* Display login ID */}
      <button onClick={logout}>Logout</button>
    </div>
  );
}