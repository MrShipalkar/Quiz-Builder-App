import './App.css';
import Auth from './pages/auth/auth';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Dashboard from './pages/dashboard/dashboard';
import QuizInterface from './pages/QuizInterface/QuizInterface'
import ProtectedRoute from './components/protectedroute/ProtectedRoute'
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';


function App() {
  return (
    <BrowserRouter>
    <div className='App'>
    <ToastContainer position="top-right" autoClose={5000} />
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
      </div>
    </BrowserRouter>
  );
}

export default App;
