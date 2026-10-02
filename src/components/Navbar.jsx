import React from 'react';
import { Link, useNavigate } from 'react-router-dom';

const Navbar = ({ user, setUser, cartCount }) => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('userInfo');
    setUser(null);
    navigate('/login');
  };

  return (
    <header>
      <nav className="navbar navbar-expand-lg navbar-custom py-3">
        <div className="container">
          <Link className="navbar-brand brand-logo" to="/">
            <i className="bi bi-capsule-pill text-teal fs-3"></i>
            <span>PharmStock</span>
          </Link>

          <button
            className="navbar-toggler border-0 shadow-none"
            type="button"
            data-bs-toggle="collapse"
            data-bs-target="#navbarContent"
          >
            <span className="navbar-toggler-icon"></span>
          </button>

          <div className="collapse navbar-collapse" id="navbarContent">
            <ul className="navbar-nav me-auto mb-2 mb-lg-0 ms-lg-4">
              <li className="nav-item">
                <Link className="nav-link fw-medium" to="/">
                  <i className="bi bi-house me-1"></i>Home
                </Link>
              </li>
              <li className="nav-item">
                <Link className="nav-link fw-medium" to="/catalog">
                  <i className="bi bi-grid me-1"></i>Medicines
                </Link>
              </li>
              {user && (
                <li className="nav-item">
                  <Link className="nav-link fw-medium" to="/orders">
                    <i className="bi bi-receipt me-1"></i>Orders
                  </Link>
                </li>
              )}
              {user?.role === 'admin' && (
                <li className="nav-item">
                  <Link className="nav-link fw-semibold text-primary" to="/admin">
                    <i className="bi bi-speedometer2 me-1"></i>Pharmacist Admin
                  </Link>
                </li>
              )}
            </ul>

            <div className="d-flex align-items-center gap-3">
              {/* Cart Button */}
              <Link to="/cart" className="btn btn-light position-relative border rounded-pill px-3 py-2">
                <i className="bi bi-cart3 fs-6"></i>
                <span className="ms-2 d-none d-sm-inline">Cart</span>
                {cartCount > 0 && (
                  <span className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger">
                    {cartCount}
                  </span>
                )}
              </Link>

              {user ? (
                <div className="d-flex align-items-center gap-2">
                  <span className="badge bg-light text-dark border px-3 py-2 rounded-pill">
                    <i className="bi bi-person-circle me-1 text-primary"></i>
                    {user.name} ({user.role})
                  </span>
                  <button onClick={handleLogout} className="btn btn-outline-danger btn-sm rounded-pill px-3">
                    <i className="bi bi-box-arrow-right me-1"></i>Logout
                  </button>
                </div>
              ) : (
                <div className="d-flex gap-2">
                  <Link to="/login" className="btn btn-pharm-outline btn-sm px-3">
                    Login
                  </Link>
                  <Link to="/register" className="btn btn-pharm btn-sm px-3">
                    Register
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
      </nav>
    </header>
  );
};

export default Navbar;
