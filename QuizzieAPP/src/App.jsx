import './App.css';
import Auth from './pages/auth/auth';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Dashboard from './pages/dashboard/dashboard';
import QuizInterface from './pages/QuizInterface/QuizInterface'
import ProtectedRoute from './components/protectedroute/ProtectedRoute'


function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Auth />} />
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />
        <Route path="/quiz/:quizId" element={<QuizInterface />} /> {/* Add the quiz route */}
      </Routes>
    </BrowserRouter>
  );
}

export default App;
