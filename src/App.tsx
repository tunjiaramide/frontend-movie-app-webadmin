import { Routes, Route } from "react-router-dom";
import Dashboard from "./pages/Dashboard";
import UploadMovie from "./pages/UploadMovie";
import Login from "./pages/Login";
import PrivateRoute from "./components/PrivateRoute";
import { AuthProvider } from "./context/AuthContext";
import NotFound from "./pages/NotFound";
import './App.css';

function App() {
  return (
    <AuthProvider>
      <Routes>
        <Route 
          path="/dashboard" 
          element={
            <PrivateRoute>
              <Dashboard />
            </PrivateRoute>
          } 
        />
        <Route 
          path="/upload-movie" 
          element={
            <PrivateRoute>
              <UploadMovie />
            </PrivateRoute>
          } 
        />
        <Route path="/" element={<Login />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </AuthProvider>
  );
}

export default App;
