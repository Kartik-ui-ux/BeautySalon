import React, { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, Link, useLocation } from 'react-router-dom';
import { motion, useScroll, useTransform } from 'framer-motion';
import { Menu, X, Phone, Mail, MapPin, Calendar } from 'lucide-react';
import '@/App.css';
import HomePage from './pages/HomePage';
import ServicesPage from './pages/ServicesPage';
import GalleryPage from './pages/GalleryPage';
import StaffPage from './pages/StaffPage';
import BookingPage from './pages/BookingPage';
import ReviewsPage from './pages/ReviewsPage';
import { Toaster } from '@/components/ui/sonner';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
export const API = `${BACKEND_URL}/api`;

function Navigation() {
  const [isOpen, setIsOpen] = useState(false);
  const [isVisible, setIsVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);
  const location = useLocation();

  useEffect(() => {
    const controlNavbar = () => {
      if (typeof window !== 'undefined') {
        if (window.scrollY > lastScrollY && window.scrollY > 100) {
          setIsVisible(false);
        } else {
          setIsVisible(true);
        }
        setLastScrollY(window.scrollY);
      }
    };

    if (typeof window !== 'undefined') {
      window.addEventListener('scroll', controlNavbar);
      return () => {
        window.removeEventListener('scroll', controlNavbar);
      };
    }
  }, [lastScrollY]);

  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'Services', path: '/services' },
    { name: 'Gallery', path: '/gallery' },
    { name: 'Our Team', path: '/staff' },
    { name: 'Reviews', path: '/reviews' },
  ];

  return (
    <>
      <motion.header
        initial={{ y: 0 }}
        animate={{ y: isVisible ? 0 : -100 }}
        transition={{ duration: 0.3 }}
        className="fixed top-0 left-0 right-0 z-50 glass border-b border-white/40"
        data-testid="main-header"
      >
        <nav className="max-w-[90vw] mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <Link to="/" className="flex items-center space-x-3" data-testid="logo-link">
              <motion.div
                whileHover={{ scale: 1.05 }}
                className="text-2xl md:text-3xl font-serif italic font-semibold text-primary"
              >
                Ethereal Glow
              </motion.div>
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-8">
              {navLinks.map((link) => (
                <Link
                  key={link.path}
                  to={link.path}
                  data-testid={`nav-${link.name.toLowerCase().replace(' ', '-')}`}
                  className={`text-sm font-medium uppercase tracking-widest transition-colors hover:text-primary ${
                    location.pathname === link.path ? 'text-primary' : 'text-foreground'
                  }`}
                >
                  {link.name}
                </Link>
              ))}
              <Link to="/booking">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  data-testid="book-now-button"
                  className="bg-primary text-white px-6 py-2 rounded-sm text-sm font-medium uppercase tracking-widest hover:bg-primary/90 transition-colors"
                >
                  Book Now
                </motion.button>
              </Link>
            </div>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="md:hidden text-foreground"
              data-testid="mobile-menu-toggle"
              aria-label="Toggle menu"
            >
              {isOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>

          {/* Mobile Navigation */}
          {isOpen && (
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              className="md:hidden mt-4 pb-4 space-y-4"
              data-testid="mobile-menu"
            >
              {navLinks.map((link) => (
                <Link
                  key={link.path}
                  to={link.path}
                  onClick={() => setIsOpen(false)}
                  className={`block text-sm font-medium uppercase tracking-widest transition-colors hover:text-primary ${
                    location.pathname === link.path ? 'text-primary' : 'text-foreground'
                  }`}
                >
                  {link.name}
                </Link>
              ))}
              <Link to="/booking" onClick={() => setIsOpen(false)}>
                <button className="w-full bg-primary text-white px-6 py-2 rounded-sm text-sm font-medium uppercase tracking-widest">
                  Book Now
                </button>
              </Link>
            </motion.div>
          )}
        </nav>
      </motion.header>

      {/* Floating Book Button for Mobile */}
      <Link to="/booking" className="md:hidden">
        <motion.button
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          data-testid="floating-book-button"
          className="fixed bottom-6 right-6 z-40 bg-primary text-white p-4 rounded-full shadow-lg"
        >
          <Calendar size={24} />
        </motion.button>
      </Link>
    </>
  );
}

function Footer() {
  return (
    <footer className="bg-secondary border-t border-border mt-24" data-testid="main-footer">
      <div className="max-w-[90vw] mx-auto px-6 py-16">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
          <div>
            <h3 className="text-2xl font-serif italic font-semibold text-primary mb-4">
              Ethereal Glow
            </h3>
            <p className="text-muted-foreground leading-relaxed">
              Where beauty meets artistry. Experience transformative treatments in our luxurious, serene environment.
            </p>
          </div>

          <div>
            <h4 className="text-sm font-semibold uppercase tracking-widest mb-4">Contact</h4>
            <div className="space-y-3">
              <div className="flex items-center space-x-3 text-muted-foreground">
                <Phone size={16} className="text-primary" />
                <span>(555) 123-4567</span>
              </div>
              <div className="flex items-center space-x-3 text-muted-foreground">
                <Mail size={16} className="text-primary" />
                <span>hello@etherealglow.com</span>
              </div>
              <div className="flex items-center space-x-3 text-muted-foreground">
                <MapPin size={16} className="text-primary" />
                <span>123 Beauty Lane, Wellness District</span>
              </div>
            </div>
          </div>

          <div>
            <h4 className="text-sm font-semibold uppercase tracking-widest mb-4">Hours</h4>
            <div className="space-y-2 text-muted-foreground">
              <p>Monday - Friday: 9:00 AM - 8:00 PM</p>
              <p>Saturday: 10:00 AM - 6:00 PM</p>
              <p>Sunday: 11:00 AM - 5:00 PM</p>
            </div>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-border text-center text-muted-foreground text-sm">
          <p>&copy; 2025 Ethereal Glow Beauty Salon. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}

function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <Navigation />
        <main className="pt-20">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/services" element={<ServicesPage />} />
            <Route path="/gallery" element={<GalleryPage />} />
            <Route path="/staff" element={<StaffPage />} />
            <Route path="/reviews" element={<ReviewsPage />} />
            <Route path="/booking" element={<BookingPage />} />
          </Routes>
        </main>
        <Footer />
        <Toaster position="top-center" />
      </BrowserRouter>
    </div>
  );
}

export default App;