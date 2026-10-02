import React, { useState, useEffect } from 'react';
import API from '../services/api';

const Orders = ({ user }) => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      // If admin, can view all orders, otherwise myorders
      const endpoint = user?.role === 'admin' ? '/orders' : '/orders/myorders';
      const res = await API.get(endpoint);
      setOrders(res.data);
    } catch (err) {
      console.error('Failed to load orders:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user) {
      fetchOrders();
    }
  }, [user]);

  const handleStatusChange = async (orderId, newStatus) => {
    try {
      await API.put(`/orders/${orderId}/status`, { status: newStatus });
      fetchOrders();
    } catch (err) {
      alert('Failed to update status: ' + (err.response?.data?.message || err.message));
    }
  };

  return (
    <div className="container py-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h2 className="fw-bold mb-1">
            {user?.role === 'admin' ? 'Store Sales & Orders' : 'My Orders'}
          </h2>
          <p className="text-muted small mb-0">
            {user?.role === 'admin'
              ? 'Complete history of prescriptions and customer purchases'
              : 'Track your recent medicine purchases and delivery invoices'}
          </p>
        </div>
      </div>

      {loading ? (
        <div className="text-center py-5">
          <div className="spinner-border text-teal" role="status"></div>
          <p className="text-muted mt-2">Loading orders...</p>
        </div>
      ) : orders.length === 0 ? (
        <div className="text-center py-5 bg-white rounded-3 border">
          <i className="bi bi-receipt-cutoff text-muted fs-1 mb-2"></i>
          <h5 className="fw-semibold">No orders recorded yet</h5>
          <p className="text-muted small">Purchased orders will be shown here.</p>
        </div>
      ) : (
        <div className="custom-table border">
          <div className="table-responsive">
            <table className="table table-hover align-middle mb-0">
              <thead>
                <tr>
                  <th>Order Reference</th>
                  {user?.role === 'admin' && <th>Customer</th>}
                  <th>Items Purchased</th>
                  <th>Payment Mode</th>
                  <th>Total Amount</th>
                  <th>Date</th>
                  <th>Status</th>
                  {user?.role === 'admin' && <th>Manage</th>}
                </tr>
              </thead>
              <tbody>
                {orders.map((order) => (
                  <tr key={order._id}>
                    <td>
                      <code>#{order._id.substring(order._id.length - 8).toUpperCase()}</code>
                    </td>
                    {user?.role === 'admin' && (
                      <td>
                        <div className="fw-semibold">{order.customerName || 'Customer'}</div>
                        <small className="text-muted">{order.customer?.email}</small>
                      </td>
                    )}
                    <td>
                      <ul className="list-unstyled mb-0 small">
                        {order.items.map((it, idx) => (
                          <li key={idx}>
                            • {it.name} &times; <strong>{it.quantity}</strong>
                          </li>
                        ))}
                      </ul>
                    </td>
                    <td>
                      <span className="badge bg-light text-dark border">
                        {order.paymentMethod}
                      </span>
                    </td>
                    <td className="fw-bold text-teal">
                      ${order.totalAmount.toFixed(2)}
                    </td>
                    <td className="small text-muted">
                      {new Date(order.createdAt).toLocaleDateString()} {new Date(order.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </td>
                    <td>
                      <span
                        className={`badge ${
                          order.status === 'Completed'
                            ? 'badge-soft-success'
                            : order.status === 'Cancelled'
                            ? 'badge-soft-danger'
                            : 'badge-soft-warning'
                        } px-2 py-1`}
                      >
                        {order.status}
                      </span>
                    </td>
                    {user?.role === 'admin' && (
                      <td>
                        <select
                          className="form-select form-select-sm"
                          value={order.status}
                          onChange={(e) => handleStatusChange(order._id, e.target.value)}
                        >
                          <option value="Pending">Pending</option>
                          <option value="Confirmed">Confirmed</option>
                          <option value="Completed">Completed</option>
                          <option value="Cancelled">Cancelled</option>
                        </select>
                      </td>
                    )}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

export default Orders;
