## Project Overview
This document outlines the approach I've taken in implementing this solution, the challenges I encountered, and potential 
improvements that could be made to enhance efficiency and robustness.

## Live Demo
The live version of this solution is hosted on Vercel and can be accessed at [https://orderbook-beige.vercel.app/](https://orderbook-beige.vercel.app/).

### Approach
The solution was developed using React.js, acting as the backbone of the user interface, while Redux was chosen for state management.

1. The initial step was to set up the required state to hold bid and ask orders. I represented the state in Redux as an 
initially empty object. Each order is an object comprised of properties such as price, size, total, and depth.

````
    interface Order {
      price: number;
      size: number;
      total: number;
      depth: number;
    }

    type OrderState = {
      bids: Order[];
      asks: Order[];
    }
````
2. I then implemented a function to calculate a running total and depth for each order. Here, Running total is essentially 
the sum of the size of the current order and all preceding orders. Depth is a visual representation of the size of 
an order as a proportion of the maximum size amongst all bids and ask orders.
3. To keep the state updated based on multiple, incoming orders, I built a function named updateOrders().
This function works by merging new, incoming orders with the existing Redux state.

### Challenges

Managing the constant stream of data and synchronously updating the UI were the primary challenges I encountered. 
To address this, I leveraged the updateOrders() function to keep the state updated efficiently.

Another challenge was to ensure the total sizes of the orders were calculated before the slicing of data for display 
in the order book. It's a common mistake many developers overlook, but I've managed to correctly implement
this in the given solution.

### Possible Improvements

While the current solution is functional and reliable, there is always room for improvement. Here are a few areas that 
could be addressed to further enhance the solution's robustness and efficiency:
* **Data Error Handling:** Edge cases involving errors or inconsistencies in incoming data can be better handled.
It ensures that the order book doesn't get into an invalid state.
* **Testing Suite:** A robust testing suite would greatly enhance the reliability of the solution since it would allow 
verification and validation of more varied cases.
* **Performance and UI Improvements:** Both the user interface and performance can be improved to handle larger 
volumes of data more smoothly, thereby enhancing the user experience.

This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).

## Available Scripts

In the project directory, you can run:

### `npm start`

Runs the app in the development mode.\
Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

The page will reload if you make edits.\
You will also see any lint errors in the console.
