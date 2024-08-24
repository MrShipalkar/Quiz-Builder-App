import './App.css';
import Auth from './pages/auth/auth';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Dashboard from './pages/dashboard/dashboard';
import QuizInterface from './pages/QuizInterface/QuizInterface'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Auth />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/quiz/:quizId" element={<QuizInterface />} /> {/* Add the quiz route */}
      </Routes>
    </BrowserRouter>
  );
}

export default App;
