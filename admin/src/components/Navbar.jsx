import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import glytic from '../assets/Glytic-nav-logo.png'

 
const Navbar = ({ onLogout }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);
 
  const handleLogout = () => {
    localStorage.removeItem('adminLoggedIn');
    onLogout();
    navigate('/login');
  };
 
  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };
 
  const closeMenu = () => {
    setIsMenuOpen(false);
  };
 
  // Handle window resize
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768);
      if (window.innerWidth > 768) {
        setIsMenuOpen(false);
      }
    };
 
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);
 
  // Close sidebar when clicking outside on mobile
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (isMenuOpen && isMobile) {
        const sidebar = document.querySelector('.sidebar');
        if (sidebar && !sidebar.contains(event.target)) {
          closeMenu();
        }
      }
    };
 
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isMenuOpen, isMobile]);
 
  return (
    <>
      {isMobile && (
        <div className="mobile-header">
          <Link to="/" className="mobile-brand">
            <img src={glytic} alt="Glyptic Admin" />
          </Link>
          <button className="mobile-toggle" onClick={toggleMenu}>
            <span></span>
            <span></span>
            <span></span>
          </button>
        </div>
      )}
     
      {isMenuOpen && isMobile && (
        <div className="sidebar-overlay" onClick={closeMenu}></div>
      )}
      <nav className={`sidebar ${isMenuOpen ? 'sidebar-nav-open' : ''}`}>
        <div className="sidebar-header">
        <Link to="/" className="sidebar-brand">
          <img src={glytic} alt="Glyptic Admin" />
        </Link>
       
        <button className="sidebar-toggle" onClick={toggleMenu}>
          <span></span>
          <span></span>
          <span></span>
        </button>
      </div>
     
      <div className="sidebar-nav">
      <ul>
        <li>
          <Link
            to="/"
            className={`sidebar-link ${location.pathname === '/' ? 'active' : ''}`}
            onClick={closeMenu}
          >
             Dashboard
          </Link>
        </li>
        <li>
          <Link
            to="/hero-slider"
            className={`sidebar-link ${location.pathname.includes('/hero-slider') ? 'active' : ''}`}
            onClick={closeMenu}
          >
             Home Slider
          </Link>
        </li>
        <li>
          <Link
            to="/home-page"
            className={`sidebar-link ${location.pathname.includes('/home-page') ? 'active' : ''}`}
            onClick={closeMenu}
          >
             Home Page
          </Link>
        </li>
        <li>
          <Link
            to="/home-logos"
            className={`sidebar-link ${location.pathname.includes('/home-logos') ? 'active' : ''}`}
            onClick={closeMenu}
          >
             Home Logos
          </Link>
        </li>
        <li>
          <Link
            to="/contact-us"
            className={`sidebar-link ${location.pathname.includes('/contact-us') ? 'active' : ''}`}
            onClick={closeMenu}
          >
             Contact Us
          </Link>
        </li>
        <li>
          <Link
            to="/services"
            className={`sidebar-link ${location.pathname.includes('/services') ? 'active' : ''}`}
            onClick={closeMenu}
          >
             Services
          </Link>
        </li>
        <li>
          <Link
            to="/solutions"
            className={`sidebar-link ${location.pathname.includes('/solutions') ? 'active' : ''}`}
            onClick={closeMenu}
          >
             Solutions
          </Link>
        </li>
        <li>
          <Link
            to="/products"
            className={`sidebar-link ${location.pathname.includes('/products') ? 'active' : ''}`}
            onClick={closeMenu}
          >
            Products
          </Link>
        </li>
        <li>
          <Link
            to="/blogs"
            className={`sidebar-link ${location.pathname.includes('/blogs') ? 'active' : ''}`}
            onClick={closeMenu}
          >
            Blogs
          </Link>
        </li>
        <li>
          <Link
            to="/gallery"
            className={`sidebar-link ${location.pathname.includes('/gallery') ? 'active' : ''}`}
            onClick={closeMenu}
          >
             Gallery
          </Link>
        </li>
        <li>
          <Link
            to="/careers"
            className={`sidebar-link ${location.pathname.includes('/careers') ? 'active' : ''}`}
            onClick={closeMenu}
          >
             Careers
          </Link>
        </li>
        <li>
          <Link
            to="/contacts"
            className={`sidebar-link ${location.pathname.includes('/contacts') ? 'active' : ''}`}
            onClick={closeMenu}
          >
             Contacts
          </Link>
        </li>
        <li>
          <Link
            to="/faqs"
            className={`sidebar-link ${location.pathname.includes('/faqs') ? 'active' : ''}`}
            onClick={closeMenu}
          >
             FAQs
          </Link>
        </li>
        <li>
          <Link
            to="/training-calendar"
            className={`sidebar-link ${location.pathname.includes('/training-calendar') ? 'active' : ''}`}
            onClick={closeMenu}
          >
             Training Calendar
          </Link>
        </li>
        <li>
          <Link
            to="/events-data"
            className={`sidebar-link ${location.pathname.includes('/events-data') ? 'active' : ''}`}
            onClick={closeMenu}
          >
             Events Data
          </Link>
        </li>
        <li>
          <Link
            to="/settings"
            className={`sidebar-link ${location.pathname.includes('/settings') ? 'active' : ''}`}
            onClick={closeMenu}
          >
             Settings
          </Link>
        </li>
        <li>
          <button
            onClick={() => { handleLogout(); closeMenu(); }}
            className="sidebar-link logout-btn"
          >
             Logout
          </button>
        </li>
      </ul>
      </div>
    </nav>
    </>
  );
};
 
export default Navbar;