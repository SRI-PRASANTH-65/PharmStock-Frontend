import React, { useState, useEffect } from 'react';
import API from '../services/api';
import MedicineCard from '../components/MedicineCard';

const categories = [
  'All',
  'Antibiotics',
  'Analgesics / Pain Relief',
  'Vitamins & Supplements',
  'Cardiovascular',
  'Antidiabetic',
  'Respiratory / Cough & Cold',
  'Dermatology',
  'First Aid & Gastro',
];

const MedicineCatalog = ({ onAddToCart, user }) => {
  const [medicines, setMedicines] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [filterType, setFilterType] = useState('all');

  const fetchMedicines = async () => {
    setLoading(true);
    try {
      const params = {};
      if (searchTerm) params.search = searchTerm;
      if (selectedCategory !== 'All') params.category = selectedCategory;
      if (filterType !== 'all') params.filter = filterType;

      const response = await API.get('/medicines', { params });
      setMedicines(response.data);
    } catch (err) {
      console.error('Failed to load medicines:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      fetchMedicines();
    }, 300);
    return () => clearTimeout(timer);
  }, [searchTerm, selectedCategory, filterType]);

  return (
    <div className="container py-4">
      <div className="d-flex flex-wrap justify-content-between align-items-center mb-4 gap-3">
        <div>
          <h2 className="fw-bold mb-1">Medicine Catalog</h2>
          <p className="text-muted small mb-0">
            Browse pharmaceutical products, view stock availability, and place orders.
          </p>
        </div>

        {/* Quick Filter Tabs */}
        <div className="btn-group" role="group">
          <button
            type="button"
            className={`btn btn-sm ${filterType === 'all' ? 'btn-teal bg-primary text-white' : 'btn-outline-secondary'}`}
            onClick={() => setFilterType('all')}
          >
            All Medicines
          </button>
          <button
            type="button"
            className={`btn btn-sm ${filterType === 'lowStock' ? 'btn-warning text-dark' : 'btn-outline-secondary'}`}
            onClick={() => setFilterType('lowStock')}
          >
            <i className="bi bi-exclamation-circle me-1"></i>Low Stock
          </button>
          <button
            type="button"
            className={`btn btn-sm ${filterType === 'expiringSoon' ? 'btn-danger text-white' : 'btn-outline-secondary'}`}
            onClick={() => setFilterType('expiringSoon')}
          >
            <i className="bi bi-clock-history me-1"></i>Expiring Soon
          </button>
        </div>
      </div>

      {/* Filter Controls Row */}
      <div className="row g-3 mb-4">
        <div className="col-md-7">
          <div className="input-group">
            <span className="input-group-text bg-white border-end-0">
              <i className="bi bi-search text-muted"></i>
            </span>
            <input
              type="text"
              className="form-control border-start-0"
              placeholder="Search by brand name, generic formula, or manufacturer..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            {searchTerm && (
              <button
                className="btn btn-outline-secondary border-start-0 bg-white"
                onClick={() => setSearchTerm('')}
              >
                <i className="bi bi-x"></i>
              </button>
            )}
          </div>
        </div>

        <div className="col-md-5">
          <select
            className="form-select"
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
          >
            {categories.map((cat) => (
              <option key={cat} value={cat}>
                {cat === 'All' ? 'All Categories' : cat}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Medicine Grid */}
      {loading ? (
        <div className="text-center py-5">
          <div className="spinner-border text-teal" role="status"></div>
          <p className="text-muted mt-2">Loading medicine inventory...</p>
        </div>
      ) : medicines.length === 0 ? (
        <div className="text-center py-5 bg-white rounded-3 border">
          <i className="bi bi-prescription2 text-muted fs-1 mb-2"></i>
          <h5 className="fw-semibold">No medicines found</h5>
          <p className="text-muted small">
            Try adjusting your search criteria or category filter.
          </p>
        </div>
      ) : (
        <div className="medicine-grid">
          {medicines.map((med) => (
            <MedicineCard
              key={med._id}
              medicine={med}
              onAddToCart={onAddToCart}
              isAdmin={user?.role === 'admin'}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default MedicineCatalog;
