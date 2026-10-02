import React, { useState, useEffect } from 'react';
import API from '../services/api';
import { StockBadge, ExpiryBadge } from '../components/AlertBadge';

const categories = [
  'Antibiotics',
  'Analgesics / Pain Relief',
  'Vitamins & Supplements',
  'Cardiovascular',
  'Antidiabetic',
  'Respiratory / Cough & Cold',
  'Dermatology',
  'First Aid & Gastro',
];

const dosageForms = ['Tablet', 'Capsule', 'Syrup', 'Injection', 'Ointment', 'Drops'];

const AdminDashboard = () => {
  const [medicines, setMedicines] = useState([]);
  const [stats, setStats] = useState({
    totalMedicines: 0,
    lowStock: 0,
    outOfStock: 0,
    expired: 0,
    expiringSoon: 0,
    totalInventoryValue: 0,
  });
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [activeFilter, setActiveFilter] = useState('all');

  // Form modal state
  const [showModal, setShowModal] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [currentId, setCurrentId] = useState(null);
  const [feedbackMsg, setFeedbackMsg] = useState({ type: '', text: '' });

  const initialForm = {
    name: '',
    genericName: '',
    category: 'Analgesics / Pain Relief',
    batchNumber: '',
    price: '',
    costPrice: '',
    stockQuantity: '',
    expiryDate: '',
    manufacturer: '',
    dosageForm: 'Tablet',
    description: '',
  };
  const [formData, setFormData] = useState(initialForm);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const [statsRes, medicinesRes] = await Promise.all([
        API.get('/medicines/stats/dashboard'),
        API.get('/medicines', {
          params: {
            search: searchTerm,
            filter: activeFilter !== 'all' ? activeFilter : undefined,
          },
        }),
      ]);
      setStats(statsRes.data);
      setMedicines(medicinesRes.data);
    } catch (err) {
      console.error('Error fetching dashboard data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, [searchTerm, activeFilter]);

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const openAddModal = () => {
    setIsEditing(false);
    setCurrentId(null);
    setFormData(initialForm);
    setShowModal(true);
  };

  const openEditModal = (medicine) => {
    setIsEditing(true);
    setCurrentId(medicine._id);
    setFormData({
      name: medicine.name,
      genericName: medicine.genericName,
      category: medicine.category,
      batchNumber: medicine.batchNumber,
      price: medicine.price,
      costPrice: medicine.costPrice || '',
      stockQuantity: medicine.stockQuantity,
      expiryDate: medicine.expiryDate ? medicine.expiryDate.split('T')[0] : '',
      manufacturer: medicine.manufacturer,
      dosageForm: medicine.dosageForm || 'Tablet',
      description: medicine.description || '',
    });
    setShowModal(true);
  };

  const handleSaveMedicine = async (e) => {
    e.preventDefault();
    try {
      if (isEditing) {
        await API.put(`/medicines/${currentId}`, formData);
        setFeedbackMsg({ type: 'success', text: 'Medicine updated successfully!' });
      } else {
        await API.post('/medicines', formData);
        setFeedbackMsg({ type: 'success', text: 'Medicine added to inventory!' });
      }
      setShowModal(false);
      fetchDashboardData();
      setTimeout(() => setFeedbackMsg({ type: '', text: '' }), 4000);
    } catch (err) {
      alert(err.response?.data?.message || 'Action failed. Please try again.');
    }
  };

  const handleDelete = async (id, name) => {
    if (window.confirm(`Are you sure you want to remove "${name}" from inventory?`)) {
      try {
        await API.delete(`/medicines/${id}`);
        setFeedbackMsg({ type: 'warning', text: `"${name}" removed from inventory.` });
        fetchDashboardData();
        setTimeout(() => setFeedbackMsg({ type: '', text: '' }), 4000);
      } catch (err) {
        alert(err.response?.data?.message || 'Delete operation failed.');
      }
    }
  };

  // One-click demo database seed
  const handleSeedDemoData = async () => {
    try {
      const res = await API.post('/seed');
      alert(res.data.message);
      fetchDashboardData();
    } catch (err) {
      alert('Error seeding database: ' + (err.response?.data?.message || err.message));
    }
  };

  return (
    <div className="container py-4">
      {/* Header with Title & Action Buttons */}
      <div className="d-flex flex-wrap justify-content-between align-items-center mb-4 gap-3">
        <div>
          <span className="badge bg-primary text-white px-2 py-1 mb-1">
            <i className="bi bi-shield-check me-1"></i> Pharmacist Management Portal
          </span>
          <h2 className="fw-bold mb-0">Inventory Dashboard</h2>
        </div>

        <div className="d-flex gap-2">
          <button onClick={handleSeedDemoData} className="btn btn-outline-secondary btn-sm">
            <i className="bi bi-database-fill-down me-1"></i>Seed Demo Data
          </button>
          <button onClick={openAddModal} className="btn btn-pharm btn-sm">
            <i className="bi bi-plus-circle me-1"></i>Add New Medicine
          </button>
        </div>
      </div>

      {feedbackMsg.text && (
        <div className={`alert alert-${feedbackMsg.type} alert-dismissible fade show py-2`} role="alert">
          <i className="bi bi-info-circle me-2"></i>{feedbackMsg.text}
        </div>
      )}

      {/* Metric Cards Grid */}
      <div className="stats-grid mb-4">
        <div className="stat-card">
          <div className="stat-icon-wrapper bg-primary-subtle text-primary">
            <i className="bi bi-capsule"></i>
          </div>
          <div>
            <div className="text-muted small">Total Medicines</div>
            <h3 className="fw-bold mb-0">{stats.totalMedicines}</h3>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon-wrapper bg-warning-subtle text-warning">
            <i className="bi bi-exclamation-triangle"></i>
          </div>
          <div>
            <div className="text-muted small">Low Stock (&le; 10)</div>
            <h3 className="fw-bold mb-0 text-warning">{stats.lowStock}</h3>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon-wrapper bg-danger-subtle text-danger">
            <i className="bi bi-clock-history"></i>
          </div>
          <div>
            <div className="text-muted small">Expiring Soon (&lt; 30d)</div>
            <h3 className="fw-bold mb-0 text-danger">{stats.expiringSoon}</h3>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon-wrapper bg-success-subtle text-success">
            <i className="bi bi-currency-dollar"></i>
          </div>
          <div>
            <div className="text-muted small">Inventory Valuation</div>
            <h3 className="fw-bold mb-0">${stats.totalInventoryValue.toLocaleString()}</h3>
          </div>
        </div>
      </div>

      {/* Filter Tabs & Search Bar */}
      <div className="bg-white p-3 rounded-3 border mb-4">
        <div className="row g-3 align-items-center">
          <div className="col-md-5">
            <div className="input-group input-group-sm">
              <span className="input-group-text bg-light"><i className="bi bi-search"></i></span>
              <input
                type="text"
                className="form-control"
                placeholder="Filter table by brand or formula..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>

          <div className="col-md-7 text-md-end">
            <div className="btn-group btn-group-sm">
              <button
                className={`btn ${activeFilter === 'all' ? 'btn-primary' : 'btn-outline-secondary'}`}
                onClick={() => setActiveFilter('all')}
              >
                All ({stats.totalMedicines})
              </button>
              <button
                className={`btn ${activeFilter === 'lowStock' ? 'btn-warning text-dark' : 'btn-outline-secondary'}`}
                onClick={() => setActiveFilter('lowStock')}
              >
                Low Stock ({stats.lowStock})
              </button>
              <button
                className={`btn ${activeFilter === 'expiringSoon' ? 'btn-danger' : 'btn-outline-secondary'}`}
                onClick={() => setActiveFilter('expiringSoon')}
              >
                Expiring Soon ({stats.expiringSoon})
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Inventory Table (Full CRUD Read, Update & Delete) */}
      <div className="custom-table border">
        <div className="table-responsive">
          <table className="table table-hover align-middle mb-0">
            <thead>
              <tr>
                <th>Medicine & Formula</th>
                <th>Category</th>
                <th>Batch No</th>
                <th>Selling Price</th>
                <th>Stock Quantity</th>
                <th>Expiry Date</th>
                <th className="text-end">Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan="7" className="text-center py-4">
                    <div className="spinner-border spinner-border-sm text-primary me-2"></div>
                    Fetching records...
                  </td>
                </tr>
              ) : medicines.length === 0 ? (
                <tr>
                  <td colSpan="7" className="text-center py-4 text-muted">
                    No medicine records found. Click <strong>"Seed Demo Data"</strong> or <strong>"Add New Medicine"</strong> to begin.
                  </td>
                </tr>
              ) : (
                medicines.map((med) => (
                  <tr key={med._id}>
                    <td>
                      <div className="fw-bold">{med.name}</div>
                      <small className="text-muted">{med.genericName} • {med.dosageForm}</small>
                    </td>
                    <td>
                      <span className="badge bg-light text-secondary border">
                        {med.category}
                      </span>
                    </td>
                    <td><code>{med.batchNumber}</code></td>
                    <td className="fw-bold">${med.price.toFixed(2)}</td>
                    <td>
                      <StockBadge quantity={med.stockQuantity} />
                    </td>
                    <td>
                      <ExpiryBadge expiryDate={med.expiryDate} />
                    </td>
                    <td className="text-end">
                      <button
                        onClick={() => openEditModal(med)}
                        className="btn btn-sm btn-outline-primary me-1"
                        title="Edit Medicine"
                      >
                        <i className="bi bi-pencil"></i>
                      </button>
                      <button
                        onClick={() => handleDelete(med._id, med.name)}
                        className="btn btn-sm btn-outline-danger"
                        title="Delete Medicine"
                      >
                        <i className="bi bi-trash"></i>
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add / Edit Medicine Bootstrap-style Modal */}
      {showModal && (
        <div className="modal show d-block" tabIndex="-1" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
          <div className="modal-dialog modal-lg modal-dialog-centered">
            <div className="modal-content border-0 shadow">
              <div className="modal-header">
                <h5 className="modal-title fw-bold">
                  {isEditing ? 'Edit Medicine Details' : 'Add New Medicine to Stock'}
                </h5>
                <button
                  type="button"
                  className="btn-close"
                  onClick={() => setShowModal(false)}
                ></button>
              </div>

              <form onSubmit={handleSaveMedicine}>
                <div className="modal-body p-4">
                  <div className="row g-3">
                    <div className="col-md-6">
                      <label className="form-label small fw-medium">Brand Name *</label>
                      <input
                        type="text"
                        name="name"
                        className="form-control"
                        placeholder="e.g. Augmentin 625mg"
                        value={formData.name}
                        onChange={handleInputChange}
                        required
                      />
                    </div>

                    <div className="col-md-6">
                      <label className="form-label small fw-medium">Generic Name / Composition *</label>
                      <input
                        type="text"
                        name="genericName"
                        className="form-control"
                        placeholder="e.g. Amoxicillin & Clavulanate"
                        value={formData.genericName}
                        onChange={handleInputChange}
                        required
                      />
                    </div>

                    <div className="col-md-6">
                      <label className="form-label small fw-medium">Category *</label>
                      <select
                        name="category"
                        className="form-select"
                        value={formData.category}
                        onChange={handleInputChange}
                      >
                        {categories.map((cat) => (
                          <option key={cat} value={cat}>{cat}</option>
                        ))}
                      </select>
                    </div>

                    <div className="col-md-6">
                      <label className="form-label small fw-medium">Dosage Form</label>
                      <select
                        name="dosageForm"
                        className="form-select"
                        value={formData.dosageForm}
                        onChange={handleInputChange}
                      >
                        {dosageForms.map((df) => (
                          <option key={df} value={df}>{df}</option>
                        ))}
                      </select>
                    </div>

                    <div className="col-md-4">
                      <label className="form-label small fw-medium">Batch Number *</label>
                      <input
                        type="text"
                        name="batchNumber"
                        className="form-control"
                        placeholder="e.g. BATCH-2026-X8"
                        value={formData.batchNumber}
                        onChange={handleInputChange}
                        required
                      />
                    </div>

                    <div className="col-md-4">
                      <label className="form-label small fw-medium">Selling Price ($) *</label>
                      <input
                        type="number"
                        step="0.01"
                        name="price"
                        className="form-control"
                        placeholder="12.50"
                        value={formData.price}
                        onChange={handleInputChange}
                        required
                      />
                    </div>

                    <div className="col-md-4">
                      <label className="form-label small fw-medium">Stock Quantity *</label>
                      <input
                        type="number"
                        name="stockQuantity"
                        className="form-control"
                        placeholder="50"
                        value={formData.stockQuantity}
                        onChange={handleInputChange}
                        required
                      />
                    </div>

                    <div className="col-md-6">
                      <label className="form-label small fw-medium">Expiry Date *</label>
                      <input
                        type="date"
                        name="expiryDate"
                        className="form-control"
                        value={formData.expiryDate}
                        onChange={handleInputChange}
                        required
                      />
                    </div>

                    <div className="col-md-6">
                      <label className="form-label small fw-medium">Manufacturer *</label>
                      <input
                        type="text"
                        name="manufacturer"
                        className="form-control"
                        placeholder="e.g. GSK, Pfizer, Cipla"
                        value={formData.manufacturer}
                        onChange={handleInputChange}
                        required
                      />
                    </div>

                    <div className="col-12">
                      <label className="form-label small fw-medium">Description / Usage Notes</label>
                      <textarea
                        name="description"
                        className="form-control"
                        rows="2"
                        placeholder="Indications and dosage instructions..."
                        value={formData.description}
                        onChange={handleInputChange}
                      ></textarea>
                    </div>
                  </div>
                </div>

                <div className="modal-footer bg-light">
                  <button
                    type="button"
                    className="btn btn-outline-secondary"
                    onClick={() => setShowModal(false)}
                  >
                    Cancel
                  </button>
                  <button type="submit" className="btn btn-pharm px-4">
                    {isEditing ? 'Update Medicine' : 'Save to Inventory'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;
