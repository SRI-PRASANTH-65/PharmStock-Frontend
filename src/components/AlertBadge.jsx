import React from 'react';

export const StockBadge = ({ quantity }) => {
  if (quantity === 0) {
    return <span className="badge badge-soft-danger px-2 py-1"><i className="bi bi-x-circle me-1"></i>Out of Stock</span>;
  }
  if (quantity <= 10) {
    return <span className="badge badge-soft-warning px-2 py-1"><i className="bi bi-exclamation-triangle me-1"></i>Low Stock ({quantity})</span>;
  }
  return <span className="badge badge-soft-success px-2 py-1"><i className="bi bi-check-circle me-1"></i>In Stock ({quantity})</span>;
};

export const ExpiryBadge = ({ expiryDate }) => {
  const expiry = new Date(expiryDate);
  const today = new Date();
  const diffDays = Math.ceil((expiry - today) / (1000 * 60 * 60 * 24));

  if (diffDays <= 0) {
    return <span className="badge badge-soft-danger px-2 py-1"><i className="bi bi-calendar-x me-1"></i>Expired</span>;
  }
  if (diffDays <= 30) {
    return <span className="badge badge-soft-warning px-2 py-1"><i className="bi bi-clock-history me-1"></i>Expires in {diffDays}d</span>;
  }
  return (
    <span className="badge bg-light text-secondary border px-2 py-1">
      <i className="bi bi-calendar-check me-1"></i>{expiry.toLocaleDateString()}
    </span>
  );
};
