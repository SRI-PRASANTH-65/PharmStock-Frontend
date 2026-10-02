import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import API from '../services/api';

const Cart = ({ cart, setCart, user }) => {
  const [paymentMethod, setPaymentMethod] = useState('Cash on Delivery');
  const [loading, setLoading] = useState(false);
  const [orderError, setOrderError] = useState('');
  const navigate = useNavigate();

  const updateQuantity = (id, delta) => {
    setCart((prev) =>
      prev
        .map((item) => {
          if (item._id === id) {
            const newQty = item.quantity + delta;
            return newQty > 0 ? { ...item, quantity: newQty } : null;
          }
          return item;
        })
        .filter(Boolean)
    );
  };

  const removeItem = (id) => {
    setCart((prev) => prev.filter((item) => item._id !== id));
  };

  const subtotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const tax = subtotal * 0.05; // 5% pharmacy sales tax
  const grandTotal = subtotal + tax;

  const handleCheckout = async () => {
    if (!user) {
      alert('Please log in to place an order.');
      navigate('/login');
      return;
    }

    setOrderError('');
    setLoading(true);

    try {
      const orderItems = cart.map((item) => ({
        medicineId: item._id,
        name: item.name,
        price: item.price,
        quantity: item.quantity,
      }));

      await API.post('/orders', {
        items: orderItems,
        paymentMethod,
      });

      // Clear cart
      setCart([]);
      navigate('/orders');
    } catch (err) {
      setOrderError(err.response?.data?.message || 'Failed to place order.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container py-4">
      <h2 className="fw-bold mb-4">Your Prescription & Medicine Cart</h2>

      {orderError && <div className="alert alert-danger py-2">{orderError}</div>}

      {cart.length === 0 ? (
        <div className="text-center py-5 bg-white rounded-3 border">
          <i className="bi bi-cart-x text-muted fs-1 mb-3"></i>
          <h4 className="fw-bold">Your cart is currently empty</h4>
          <p className="text-muted">Explore our medicine catalog to order health supplies.</p>
          <Link to="/catalog" className="btn btn-pharm mt-2">
            Browse Medicines
          </Link>
        </div>
      ) : (
        <div className="row g-4">
          <div className="col-lg-8">
            <div className="bg-white rounded-3 border p-3">
              <div className="table-responsive">
                <table className="table align-middle mb-0">
                  <thead>
                    <tr className="text-muted small">
                      <th>Medicine</th>
                      <th>Price</th>
                      <th className="text-center">Quantity</th>
                      <th className="text-end">Line Total</th>
                      <th></th>
                    </tr>
                  </thead>
                  <tbody>
                    {cart.map((item) => (
                      <tr key={item._id}>
                        <td>
                          <h6 className="fw-bold mb-0">{item.name}</h6>
                          <small className="text-muted">{item.genericName}</small>
                        </td>
                        <td>${item.price.toFixed(2)}</td>
                        <td className="text-center">
                          <div className="btn-group btn-group-sm border rounded">
                            <button
                              onClick={() => updateQuantity(item._id, -1)}
                              className="btn btn-light"
                            >
                              -
                            </button>
                            <span className="btn btn-light disabled text-dark fw-bold px-3">
                              {item.quantity}
                            </span>
                            <button
                              onClick={() => updateQuantity(item._id, 1)}
                              className="btn btn-light"
                            >
                              +
                            </button>
                          </div>
                        </td>
                        <td className="text-end fw-bold">
                          ${(item.price * item.quantity).toFixed(2)}
                        </td>
                        <td className="text-end">
                          <button
                            onClick={() => removeItem(item._id)}
                            className="btn btn-link text-danger p-0"
                            title="Remove"
                          >
                            <i className="bi bi-trash"></i>
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          {/* Order Summary Checkout Card */}
          <div className="col-lg-4">
            <div className="bg-white rounded-3 border p-4">
              <h5 className="fw-bold mb-3">Billing Summary</h5>

              <div className="d-flex justify-content-between mb-2">
                <span className="text-muted">Subtotal</span>
                <span>${subtotal.toFixed(2)}</span>
              </div>

              <div className="d-flex justify-content-between mb-2">
                <span className="text-muted">GST / Pharmacy Tax (5%)</span>
                <span>${tax.toFixed(2)}</span>
              </div>

              <hr />

              <div className="d-flex justify-content-between mb-4">
                <span className="fw-bold">Total Amount</span>
                <span className="fw-bold text-teal fs-5">${grandTotal.toFixed(2)}</span>
              </div>

              <div className="mb-4">
                <label className="form-label small fw-medium">Payment Mode</label>
                <select
                  className="form-select form-select-sm"
                  value={paymentMethod}
                  onChange={(e) => setPaymentMethod(e.target.value)}
                >
                  <option value="Cash on Delivery">Cash on Delivery / Pickup</option>
                  <option value="UPI / Online">UPI / QR Code Scan</option>
                  <option value="Card at Store">Credit / Debit Card</option>
                </select>
              </div>

              <button
                onClick={handleCheckout}
                disabled={loading}
                className="btn btn-pharm w-100 py-2"
              >
                {loading ? 'Processing Order...' : 'Confirm Order & Pay'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Cart;
