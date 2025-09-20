import { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Login from './pages/Login';
import Settings from './pages/Settings';
import Dashboard from './pages/Dashboard';
import Services from './pages/Services';
import Solutions from './pages/Solutions';
import Products from './pages/Products';
import Blogs from './pages/Blogs';
import Gallery from './pages/Gallery';
import Careers from './pages/Careers';
import Contacts from './pages/Contacts';
import FAQs from './pages/FAQs';
import TrainingCalendar from './pages/TrainingCalendar';
import EventsData from './pages/EventsData';
import ServiceForm from './pages/ServiceForm';
import SolutionForm from './pages/SolutionForm';
import ProductForm from './pages/ProductForm';
import BlogForm from './pages/BlogForm';
import GalleryForm from './pages/GalleryForm';
import FAQForm from './pages/FAQForm';
import './App.css';
 
function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
 
  useEffect(() => {
    const loggedIn = localStorage.getItem('adminLoggedIn');
    setIsLoggedIn(loggedIn === 'true');
  }, []);
 
  const handleLogin = () => {
    setIsLoggedIn(true);
  };
 
  const handleLogout = () => {
    setIsLoggedIn(false);
  };
 
  if (!isLoggedIn) {
    return (
      <Router>
        <div className="App">
          <Routes>
            <Route path="/login" element={<Login onLogin={handleLogin} />} />
            <Route path="*" element={<Navigate to="/login" replace />} />
          </Routes>
        </div>
      </Router>
    );
  }
 
  return (
    <Router>
      <div className="App">
        <div className="admin-layout">
          <Navbar onLogout={handleLogout} />
          <div className="main-content">
            <Routes>
              <Route path="/" element={<Dashboard />} />
              <Route path="/settings" element={<Settings />} />
              <Route path="/services" element={<Services />} />
              <Route path="/services/new" element={<ServiceForm />} />
              <Route path="/services/edit/:id" element={<ServiceForm />} />
              <Route path="/solutions" element={<Solutions />} />
              <Route path="/solutions/new" element={<SolutionForm />} />
              <Route path="/solutions/edit/:id" element={<SolutionForm />} />
              <Route path="/products" element={<Products />} />
              <Route path="/products/new" element={<ProductForm />} />
              <Route path="/products/edit/:id" element={<ProductForm />} />
              <Route path="/blogs" element={<Blogs />} />
              <Route path="/blogs/new" element={<BlogForm />} />
              <Route path="/blogs/edit/:id" element={<BlogForm />} />
              <Route path="/gallery" element={<Gallery />} />
              <Route path="/gallery/new" element={<GalleryForm />} />
              <Route path="/careers" element={<Careers />} />
              <Route path="/contacts" element={<Contacts />} />
              <Route path="/faqs" element={<FAQs />} />
              <Route path="/faqs/new" element={<FAQForm />} />
              <Route path="/faqs/edit/:id" element={<FAQForm />} />
              <Route path="/training-calendar" element={<TrainingCalendar />} />
              <Route path="/events-data" element={<EventsData />} />
              <Route path="/login" element={<Navigate to="/" replace />} />
            </Routes>
          </div>
        </div>
        <Footer />
      </div>
    </Router>
  );
}
 
export default App;