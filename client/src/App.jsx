import { GoogleOAuthProvider } from '@react-oauth/google';
import { AuthContextProvider } from './contexts/AuthContextProvider'
import AppRoutes from './routes/AppRoutes'
import './App.css'

function App() {
  const GOOGLE_CLIENT_ID = "911744725245-j5kl474sg00nm8jtl0v3qi6m2qvs74ma.apps.googleusercontent.com";

  return (
    <GoogleOAuthProvider clientId={GOOGLE_CLIENT_ID}>
      <AuthContextProvider>
        <AppRoutes />
      </AuthContextProvider>
    </GoogleOAuthProvider>
  )
}

export default App;