import { FC } from 'react';

import '../OrderRow/OrderRow.css';

export const OrderHeader: FC = () => {
  return (
    <div className="order-row header">
      <div className="order-price">Price <span className="order-price__label">USD</span></div>
      <div className="order-amount">Amount <span className="order-price__label">BTC</span></div>
      <div className="order-total">Total <span className="order-price__label">BTC</span></div>
    </div>
  );
};
