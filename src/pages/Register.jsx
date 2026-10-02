import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import API from '../services/api';

const Register = ({ setUser }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    phone: '',
    role: 'customer',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await API.post('/auth/register', formData);
      localStorage.setItem('userInfo', JSON.stringify(response.data));
      setUser(response.data);

      if (response.data.role === 'admin') {
        navigate('/admin');
      } else {
        navigate('/catalog');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container py-4">
      <div className="auth-container">
        <div className="text-center mb-4">
          <div className="display-6 text-teal mb-2">
            <i className="bi bi-person-plus"></i>
          </div>
          <h3 className="fw-bold">Create Account</h3>
          <p className="text-muted small">Register to start ordering or managing inventory</p>
        </div>

        {error && <div className="alert alert-danger py-2 small">{error}</div>}

        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label className="form-label fw-medium small">Full Name</label>
            <input
              type="text"
              name="name"
              className="form-control"
              placeholder="e.g. Alex Johnson"
              value={formData.name}
              onChange={handleChange}
              required
            />
          </div>

          <div className="mb-3">
            <label className="form-label fw-medium small">Email Address</label>
            <input
              type="email"
              name="email"
              className="form-control"
              placeholder="alex@example.com"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </div>

          <div className="mb-3">
            <label className="form-label fw-medium small">Phone Number</label>
            <input
              type="tel"
              name="phone"
              className="form-control"
              placeholder="+1-555-0123"
              value={formData.phone}
              onChange={handleChange}
            />
          </div>

          <div className="mb-3">
            <label className="form-label fw-medium small">Account Role</label>
            <select
              name="role"
              className="form-select"
              value={formData.role}
              onChange={handleChange}
            >
              <option value="customer">Customer / Patient</option>
              <option value="admin">Pharmacist / Admin (Manage Stock)</option>
            </select>
          </div>

          <div className="mb-4">
            <label className="form-label fw-medium small">Password</label>
            <input
              type="password"
              name="password"
              className="form-control"
              placeholder="Min 6 characters"
              value={formData.password}
              onChange={handleChange}
              minLength="6"
              required
            />
          </div>

          <button
            type="submit"
            className="btn btn-pharm w-100 py-2 mb-3"
            disabled={loading}
          >
            {loading ? 'Creating Account...' : 'Register'}
          </button>
        </form>

        <div className="text-center mt-3">
          <span className="text-muted small">Already have an account? </span>
          <Link to="/login" className="small fw-bold text-teal">
            Sign In
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Register;
