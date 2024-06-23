import { createSlice, PayloadAction } from '@reduxjs/toolkit';

// Order interface provides a template for how an order should look
export interface Order {
  price: number; // Price of the order
  size: number; // Size of the order
  total?: number; // Running total of the order and its preceding orders
  depth?: number; // Depth is the visual interpretation of size of an order compared to max size among all orders
}

// OrderRes interface models the format of order response from the server which needs to be transformed before usage
export type OrderRes ={
  bids: [string, string][]; // bids array where each bid is represented as [price, size]
  asks: [string, string][]; // asks array where each ask order is represented as [price, size]
}

// OrderBookState is the shape of the state in the order book slice of the Redux Store
export interface OrderBookState {
  bids : Order[]; // The bids array of orders
  asks : Order[]; // The asks array of orders
}

// The initialState of the order book in the Redux Store
const initialState: OrderBookState = {
  bids : [],
  asks : [],
};

// addTotalSums function takes an array of orders and adds a 'total' property to each order
const addTotalSums = (orders: Order[]): Order[] => {
  let total = 0;
  return orders.map(order => {
    total += order.size;
    return { ...order, total: parseFloat(total.toFixed(4)) };
  });
};

const addDepths = (orders: Order[], maxTotal: number): Order[] => {
  return orders.map(order => ({
    ...order,
    depth: (order.total! / maxTotal) * 100,
  }));
};

const getMaxTotal = (orders: Order[]): number => {
  return Math.max(...orders.map(order => order.total || 0));
};

const updateOrders = (existingOrders: Order[], newOrders: Order[]): Order[] => {
  const ordersMap = new Map(existingOrders.map(order => [order.price, order]));

  newOrders.forEach(newOrder => {
    if (newOrder.size === 0) {
      ordersMap.delete(newOrder.price);
    } else {
      ordersMap.set(newOrder.price, newOrder);
    }
  });

  return Array.from(ordersMap.values()).sort((a, b) => b.price - a.price);
};

const transformOrders = (orders: [string, string][]): Order[] => {
  return orders.map(([price, size]) => ({
    price: parseFloat(parseFloat(price).toFixed(4)),
    size: parseFloat(parseFloat(size).toFixed(4)),
  }));
};

// The orderBookSlice is the main reducer responsible for handling state changes in the order book feature of the application
const orderBookSlice = createSlice({
  name: 'orderBook',
  initialState,
  reducers: {
    // updateOrderBook is an action that replaces the current state with the new state
    updateOrderBook(state, action: PayloadAction<{ bids: [string, string][]; asks: [string, string][] }>) {
      const newBids = transformOrders(action.payload.bids);
      const newAsks = transformOrders(action.payload.asks);

      const updatedBids = addTotalSums(updateOrders(state.bids, newBids)).slice(0, 11);
      const updatedAsks = addTotalSums(updateOrders(state.asks, newAsks)).slice(0, 11);

      // Slice orders after all calculations are done and update state
      const slicedBids = updatedBids.slice(0, 11);
      const slicedAsks = updatedAsks.slice(0, 11);

      const maxTotalBids = getMaxTotal(slicedBids);
      const maxTotalAsks = getMaxTotal(slicedAsks);

      state.bids = addDepths(updatedBids, maxTotalBids);
      state.asks = addDepths(updatedAsks, maxTotalAsks);
    },
  },
});

export const { updateOrderBook } = orderBookSlice.actions;
export default orderBookSlice.reducer;
