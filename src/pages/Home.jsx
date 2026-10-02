import React from 'react';
import { Link } from 'react-router-dom';

const Home = ({ user }) => {
  return (
    <div className="container py-5">
      {/* Hero Section */}
      <section className="bg-white p-5 rounded-4 border shadow-sm mb-5 text-center text-lg-start">
        <div className="row align-items-center">
          <div className="col-lg-7">
            <span className="badge bg-primary-subtle text-primary mb-3 px-3 py-2 rounded-pill fw-semibold">
              <i className="bi bi-shield-check me-1"></i> Full-Stack MERN Pharmacy System
            </span>
            <h1 className="display-4 fw-extrabold text-dark mb-3">
              Smart Medicine Inventory & Expiry Tracking
            </h1>
            <p className="lead text-muted mb-4">
              PharmStock enables retail pharmacies to maintain accurate medicine stocks, receive automated expiry & low-stock alerts, and offer customers a seamless digital ordering experience.
            </p>
            <div className="d-flex flex-wrap gap-3 justify-content-center justify-content-lg-start">
              <Link to="/catalog" className="btn btn-pharm btn-lg px-4">
                <i className="bi bi-capsule me-2"></i>Browse Medicines
              </Link>
              {user?.role === 'admin' ? (
                <Link to="/admin" className="btn btn-pharm-outline btn-lg px-4">
                  <i className="bi bi-speedometer2 me-2"></i>Pharmacist Admin Panel
                </Link>
              ) : (
                <Link to="/register" className="btn btn-pharm-outline btn-lg px-4">
                  <i className="bi bi-person-plus me-2"></i>Create Account
                </Link>
              )}
            </div>
          </div>
          <div className="col-lg-5 text-center mt-4 mt-lg-0">
            <div className="p-4 bg-light rounded-4 border">
              <div className="display-1 text-teal mb-3">
                <i className="bi bi-hospital"></i>
              </div>
              <h5 className="fw-bold mb-2">Real-Time Medical Store Dashboard</h5>
              <p className="text-muted small mb-0">
                Automated stock calculations, instant expiry warnings, and role-based access security.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Feature Highlights Grid */}
      <section className="mb-5">
        <div className="text-center mb-4">
          <h2 className="fw-bold">Key System Capabilities</h2>
          <p className="text-muted">Designed according to MERN Full-Stack Course Requirements</p>
        </div>

        <div className="row g-4">
          <div className="col-md-4">
            <div className="card h-100 border p-3 rounded-3 shadow-none">
              <div className="stat-icon-wrapper bg-info-subtle text-info mb-3">
                <i className="bi bi-bell"></i>
              </div>
              <h5 className="fw-bold">Smart Expiry & Stock Alerts</h5>
              <p className="text-muted small">
                Automated identification of batches expiring within 30 days and inventory falling below critical thresholds.
              </p>
            </div>
          </div>

          <div className="col-md-4">
            <div className="card h-100 border p-3 rounded-3 shadow-none">
              <div className="stat-icon-wrapper bg-success-subtle text-success mb-3">
                <i className="bi bi-sliders"></i>
              </div>
              <h5 className="fw-bold">Complete CRUD Operations</h5>
              <p className="text-muted small">
                Full Create, Read, Update, and Delete operations for inventory records with batch and manufacturer indexing.
              </p>
            </div>
          </div>

          <div className="col-md-4">
            <div className="card h-100 border p-3 rounded-3 shadow-none">
              <div className="stat-icon-wrapper bg-warning-subtle text-warning mb-3">
                <i className="bi bi-shield-lock"></i>
              </div>
              <h5 className="fw-bold">JWT & bcrypt Security</h5>
              <p className="text-muted small">
                Encrypted password storage and role-based token authentication differentiating store staff from customers.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
