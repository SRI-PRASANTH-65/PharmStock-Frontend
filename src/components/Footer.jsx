import React from 'react';

const Footer = () => {
  return (
    <footer className="bg-white border-top mt-auto py-4">
      <div className="container">
        <div className="row align-items-center">
          <div className="col-md-6 text-center text-md-start mb-3 mb-md-0">
            <span className="fw-bold text-teal">
              <i className="bi bi-capsule-pill me-1"></i>PharmStock
            </span>
            <span className="text-muted ms-2">
              – Smart Pharmacy Inventory & Expiry Management System
            </span>
          </div>
          <div className="col-md-6 text-center text-md-end text-muted small">
            <span>Built with MERN Stack • MongoDB, Express, React & Node.js</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
