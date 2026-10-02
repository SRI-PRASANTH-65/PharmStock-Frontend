import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import ProtectedRoute from './components/ProtectedRoute';

import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import MedicineCatalog from './pages/MedicineCatalog';
import AdminDashboard from './pages/AdminDashboard';
import Cart from './pages/Cart';
import Orders from './pages/Orders';

function App() {
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem('userInfo');
    return saved ? JSON.parse(saved) : null;
  });

  const [cart, setCart] = useState(() => {
    const savedCart = localStorage.getItem('pharmCart');
    return savedCart ? JSON.parse(savedCart) : [];
  });

  const [toastMessage, setToastMessage] = useState('');

  // Persist cart
  useEffect(() => {
    localStorage.setItem('pharmCart', JSON.stringify(cart));
  }, [cart]);

  const handleAddToCart = (medicine) => {
    setCart((prevCart) => {
      const existing = prevCart.find((item) => item._id === medicine._id);
      if (existing) {
        if (existing.quantity >= medicine.stockQuantity) {
          showToast(`Cannot add more. Only ${medicine.stockQuantity} in stock.`);
          return prevCart;
        }
        showToast(`Increased quantity of ${medicine.name}`);
        return prevCart.map((item) =>
          item._id === medicine._id ? { ...item, quantity: item.quantity + 1 } : item
        );
      } else {
        showToast(`Added ${medicine.name} to cart`);
        return [...prevCart, { ...medicine, quantity: 1 }];
      }
    });
  };

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage('');
    }, 3000);
  };

  const cartCount = cart.reduce((total, item) => total + item.quantity, 0);

  return (
    <Router>
      <div className="d-flex flex-column min-vh-100">
        <Navbar user={user} setUser={setUser} cartCount={cartCount} />

        {/* Global Toast Notification */}
        {toastMessage && (
          <div
            className="position-fixed bottom-0 end-0 p-3"
            style={{ zIndex: 1080 }}
          >
            <div className="toast show align-items-center text-bg-dark border-0 shadow">
              <div className="d-flex">
                <div className="toast-body">
                  <i className="bi bi-check2-circle text-teal me-2"></i>
                  {toastMessage}
                </div>
                <button
                  type="button"
                  className="btn-close btn-close-white me-2 m-auto"
                  onClick={() => setToastMessage('')}
                ></button>
              </div>
            </div>
          </div>
        )}

        <main className="main-content">
          <Routes>
            <Route path="/" element={<Home user={user} />} />
            <Route path="/catalog" element={<MedicineCatalog onAddToCart={handleAddToCart} user={user} />} />
            <Route path="/login" element={<Login setUser={setUser} />} />
            <Route path="/register" element={<Register setUser={setUser} />} />
            <Route path="/cart" element={<Cart cart={cart} setCart={setCart} user={user} />} />
            <Route
              path="/orders"
              element={
                <ProtectedRoute user={user}>
                  <Orders user={user} />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin"
              element={
                <ProtectedRoute user={user} roleRequired="admin">
                  <AdminDashboard />
                </ProtectedRoute>
              }
            />
          </Routes>
        </main>

        <Footer />
      </div>
    </Router>
  );
}

export default App;
