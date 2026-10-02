import React from 'react';
import { StockBadge, ExpiryBadge } from './AlertBadge';

const MedicineCard = ({ medicine, onAddToCart, isAdmin, onEdit }) => {
  const isOutOfStock = medicine.stockQuantity <= 0;

  return (
    <div className="medicine-card p-3">
      <div className="d-flex justify-content-between align-items-start mb-2">
        <span className="badge bg-secondary-subtle text-secondary border small">
          {medicine.category}
        </span>
        <span className="badge bg-light text-dark border small">
          {medicine.dosageForm || 'Tablet'}
        </span>
      </div>

      <h5 className="fw-bold mb-1 text-truncate" title={medicine.name}>
        {medicine.name}
      </h5>
      <p className="text-muted small mb-2 text-truncate" title={medicine.genericName}>
        <i>{medicine.genericName}</i>
      </p>

      <div className="mb-2 d-flex flex-wrap gap-1">
        <StockBadge quantity={medicine.stockQuantity} />
        <ExpiryBadge expiryDate={medicine.expiryDate} />
      </div>

      <div className="small text-muted mb-3">
        <div><strong>Mfg:</strong> {medicine.manufacturer}</div>
        <div><strong>Batch:</strong> {medicine.batchNumber}</div>
      </div>

      <div className="mt-auto pt-2 border-top d-flex justify-content-between align-items-center">
        <div>
          <span className="text-muted small">Price</span>
          <h4 className="fw-bold text-teal mb-0">${medicine.price.toFixed(2)}</h4>
        </div>

        <div className="d-flex gap-2">
          {isAdmin && onEdit && (
            <button
              onClick={() => onEdit(medicine)}
              className="btn btn-sm btn-outline-secondary"
              title="Edit Medicine"
            >
              <i className="bi bi-pencil"></i>
            </button>
          )}

          <button
            onClick={() => onAddToCart(medicine)}
            disabled={isOutOfStock}
            className={`btn btn-sm ${isOutOfStock ? 'btn-secondary' : 'btn-pharm'}`}
          >
            <i className="bi bi-cart-plus me-1"></i>
            {isOutOfStock ? 'Sold Out' : 'Add to Cart'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default MedicineCard;
