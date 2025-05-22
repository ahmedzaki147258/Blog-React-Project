import './App.css';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Header } from './components/header';
import { Login } from './pages/Login';
import { Register } from './pages/Register';
import { Blogs } from './pages/Blogs';
import { Profile } from './pages/Profile';

function App() {
  return (
    <Router>
      <Header />
      <div className="container mx-auto py-4 px-4">
        <Routes>
          <Route path="/" element={<Blogs />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/profile" element={<Profile />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
