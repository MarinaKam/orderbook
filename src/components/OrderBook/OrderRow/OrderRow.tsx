import React from 'react';

import { formatPrice } from '../../../utils';
import './OrderRow.css';

interface OrderRowProps {
  order: {
    price: number;
    size: number;
    total?: number;
    depth?: number;
  };
  orderType: string;
}

export const OrderRow: React.FC<OrderRowProps> = ({ order, orderType }) => {
  return (
    <div className={`order-row ${orderType}`}>
      <div className="order-price">{formatPrice(order.price)}</div>
      <div className="order-amount">{order.size}</div>
      <div className="order-total">
        {order.total}
        <div
          className="order-total-bg"
          style={{ width: `${order.depth}%` }}
        />
      </div>
    </div>
  );
};
