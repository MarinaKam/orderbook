import React from 'react';

import { formatPrice } from '../../../utils/index';
import './PriceRow.css';

interface PriceRowProps {
  bids: { price: number; size: number }[];
  asks: { price: number; size: number }[];
}

export const PriceRow: React.FC<PriceRowProps> = ({ bids, asks }) => {
  const lastBidPrice = bids.length ? bids[0].price : 0;
  const lastAskPrice = asks.length ? asks[0].price : 0;
  const priceDifference = lastAskPrice - lastBidPrice;

  const getPriceClass = () => {
    if (priceDifference > 0) {
      return 'price-up';
    } else if (priceDifference < 0) {
      return 'price-down';
    } else {
      return 'price-neutral';
    }
  };

  return (
    <div className="price-row">
      <div className={`current-price ${getPriceClass()}`}>
        <span className="price-icon">{priceDifference > 0 ? '↑' : '↓'}</span>
        {formatPrice(lastBidPrice)}
      </div>
      <div className="price-change">
        {formatPrice(lastAskPrice)}
      </div>
    </div>
  );
};
