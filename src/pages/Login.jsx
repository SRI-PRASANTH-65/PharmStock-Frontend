import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import API from '../services/api';

const Login = ({ setUser }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await API.post('/auth/login', { email, password });
      localStorage.setItem('userInfo', JSON.stringify(response.data));
      setUser(response.data);

      if (response.data.role === 'admin') {
        navigate('/admin');
      } else {
        navigate('/catalog');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed. Please check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  // One-click demo credentials fill for viva demonstration
  const setDemoCredentials = (role) => {
    if (role === 'admin') {
      setEmail('admin@pharmstock.com');
      setPassword('adminpassword123');
    } else {
      setEmail('customer@pharmstock.com');
      setPassword('customerpassword123');
    }
  };

  return (
    <div className="container py-4">
      <div className="auth-container">
        <div className="text-center mb-4">
          <div className="display-6 text-teal mb-2">
            <i className="bi bi-person-lock"></i>
          </div>
          <h3 className="fw-bold">Sign In</h3>
          <p className="text-muted small">Access your pharmacy account</p>
        </div>

        {error && <div className="alert alert-danger py-2 small">{error}</div>}

        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label className="form-label fw-medium small">Email Address</label>
            <div className="input-group">
              <span className="input-group-text bg-light"><i className="bi bi-envelope"></i></span>
              <input
                type="email"
                className="form-control"
                placeholder="name@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
          </div>

          <div className="mb-4">
            <label className="form-label fw-medium small">Password</label>
            <div className="input-group">
              <span className="input-group-text bg-light"><i className="bi bi-key"></i></span>
              <input
                type="password"
                className="form-control"
                placeholder="Enter password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
          </div>

          <button
            type="submit"
            className="btn btn-pharm w-100 py-2 mb-3"
            disabled={loading}
          >
            {loading ? 'Authenticating...' : 'Sign In'}
          </button>
        </form>

        {/* Demo Viva Fill Buttons */}
        <div className="border-top pt-3 mt-3">
          <p className="text-center text-muted small mb-2">Quick Viva Demo Fill:</p>
          <div className="d-flex gap-2">
            <button
              type="button"
              onClick={() => setDemoCredentials('admin')}
              className="btn btn-sm btn-outline-primary w-50"
            >
              <i className="bi bi-shield-check me-1"></i>Pharmacist Admin
            </button>
            <button
              type="button"
              onClick={() => setDemoCredentials('customer')}
              className="btn btn-sm btn-outline-secondary w-50"
            >
              <i className="bi bi-person me-1"></i>Customer
            </button>
          </div>
        </div>

        <div className="text-center mt-4">
          <span className="text-muted small">Don't have an account? </span>
          <Link to="/register" className="small fw-bold text-teal">
            Create an Account
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Login;
