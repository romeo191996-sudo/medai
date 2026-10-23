import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Header from './components/Header';
import Footer from './components/Footer';
import Home from './pages/Home';
import Register from './pages/Register';
import Login from './pages/Login';
import History from './pages/History';
import Result from './pages/Result'; // <-- Import the new Result page

function App() {
  return (
    <Router>
      <div className="flex flex-col min-h-screen bg-medical-light">
        <Header />
        
        <main className="flex-grow flex flex-col">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/register" element={<Register />} />
            <Route path="/login" element={<Login />} />
            <Route path="/history" element={<History />} />
            <Route path="/result" element={<Result />} /> {/* <-- Add the route */}
          </Routes>
        </main>

        <Footer />
      </div>
    </Router>
  );
}

export default App;