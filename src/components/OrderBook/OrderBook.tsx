import React, { useEffect, useRef } from 'react';
import { Centrifuge } from 'centrifuge';

import { useAppDispatch, useAppSelector } from '../../hooks/storeHooks';
import { OrderRes, updateOrderBook } from '../../store/index';
import { OrderHeader } from './OrderHeader/index';
import { OrderRow } from './OrderRow';
import { PriceRow } from './PriceRow';
import './OrderBook.css';

export const OrderBook: React.FC = () => {
  const dispatch = useAppDispatch();
  // Access the Redux store's state using a selector
  const bids = useAppSelector(state => state.orderBook.bids);
  const asks = useAppSelector(state => state.orderBook.asks);

  // Refs to handle the update buffer and setInterval callback
  const updateBuffer = useRef<OrderRes | null>(null);
  const updateTimeout = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    // Instantiate a Centrifuge connection
    const centrifuge = new Centrifuge('wss://api.prod.rabbitx.io/ws');
    centrifuge.setToken('eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiI0MDAwMDAwMDAwIiwiZXhwIjo2NTQ4NDg3NTY5fQ.o_qBZltZdDHBH3zHPQkcRhVBQCtejIuyq8V1yj5kYq8');
    // const centrifuge = new Centrifuge('wss://api.testnet.rabbitx.io/ws');
    // centrifuge.setToken('eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIwIiwiZXhwIjo1MjYyNjUyMDEwfQ.x_245iYDEvTTbraw1gt4jmFRFfgMJb-GJ-hsU9HuDik');

    // Event handlers for the various states of the Websocket connection
    centrifuge.on('connected', () => console.log('Connected to WebSocket'));
    centrifuge.on('connecting', (ctx) => console.log('Connecting to WebSocket', ctx));
    centrifuge.on('disconnected', (ctx) => console.log('Disconnected from WebSocket', ctx));
    centrifuge.on('error', (ctx) => console.error('WebSocket Error', ctx));

    // We create a Centrifuge subscription to the orderbook feed
    const sub = centrifuge.newSubscription('orderbook:BTC-USD');

    sub.on('error', (err) => console.error('Subscription error', err));

    // Handle a new publication from the order book subscription
    sub.on('publication', (ctx) => {
      const data = ctx.data;
      updateBuffer.current = { bids: data.bids, asks: data.asks };

      // We only dispatch updates to the store once per second at most
      if (!updateTimeout.current) {
        updateTimeout.current = setTimeout(() => {
          if (updateBuffer.current) {
            dispatch(updateOrderBook(updateBuffer.current));
          }

          // Reset buffer and timeout reference
          updateBuffer.current = null;
          updateTimeout.current = null;
        }, 1000);
      }
    });

    // Kick off the Centrifuge connection and subscription
    sub.subscribe();
    centrifuge.connect();

    return () => {
      centrifuge.disconnect();
    };
  }, [dispatch, updateBuffer.current, updateTimeout.current]);

  // UI for order book: Asks, the mid-market price, and bids
  return (
    <>
      <div className="container">
        <div className="order-container">
          <OrderHeader />

          <div>
            {asks.map((order, index) => (
              <OrderRow key={index} order={order} orderType="asks" />
            ))}
          </div>
        </div>

        <div className="order-container">
          <PriceRow bids={bids} asks={asks} />
        </div>

        <div className="order-container" style={{ paddingBottom: '0.5rem' }}>
          <div>
            {bids.map((order, index) => (
              <OrderRow key={index} order={order} orderType="bids" />
            ))}
          </div>
        </div>
      </div>
    </>
  );
};
